import fs from 'node:fs';
import crypto from 'node:crypto';

const STATE_PATH = '.template-calendar-state.json';
const DATA_PATH = 'template-calendar.json';
const MARKDOWN_PATH = 'TEMPLATE_CALENDAR.md';
const SOURCE_REPO = 'TejaswiErattu/tejaswisummer';
const TIME_ZONE = 'America/Los_Angeles';

function fail(message) { console.error(message); process.exit(1); }
function readJson(path, fallback) { try { return JSON.parse(fs.readFileSync(path, 'utf8')); } catch { return fallback; } }
function writeJson(path, value) { fs.writeFileSync(path, JSON.stringify(value, null, 2) + '\n'); }
function base64url(value) { return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_'); }
// The parser's own message quotes part of the input, and Actions logs on this repo are public.
function parseJson(raw, label) { try { return JSON.parse(raw); } catch { throw new Error(`${label} is not valid JSON.`); } }

async function getGoogleAccessToken(sa) {
  const tokenUri = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: tokenUri,
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${payload}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), sa.private_key);
  const assertion = `${unsigned}.${base64url(signature)}`;
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  if (!res.ok) throw new Error(`Google OAuth failed (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

function decodeFirestoreValue(field) {
  if (!field) return undefined;
  if ('stringValue' in field) return field.stringValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('timestampValue' in field) return field.timestampValue;
  if ('nullValue' in field) return null;
  if (field.arrayValue) return (field.arrayValue.values || []).map(decodeFirestoreValue);
  if (field.mapValue) {
    return Object.fromEntries(Object.entries(field.mapValue.fields || {}).map(([k, v]) => [k, decodeFirestoreValue(v)]));
  }
  return undefined;
}

async function firestoreGet(url, token, optional = false) {
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (optional && res.status === 404) return null;
  if (!res.ok) throw new Error(`Firestore read failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function readSummerState(sa, uid) {
  const token = await getGoogleAccessToken(sa);
  const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
  const doc = await firestoreGet(base, token);
  const fields = doc?.fields || {};
  const updatedAt = fields.updatedAt?.timestampValue || null;

  // Split layout written by the tracker (tejaswisummer js/sync-core.js, SCHEMA = 2):
  //   users/{uid}                  { schema: 2, root: JSON string, months: ["YYYY-MM", ...], meta, updatedAt }
  //   users/{uid}/months/{YYYY-MM} { days: JSON string of that month's days }
  //   users/{uid}/notes/main       { notes: JSON string }
  // Checked before the legacy field, in the same order the tracker's readCloud() uses.
  const schema = decodeFirestoreValue(fields.schema);
  if (schema === 2) {
    const rootRaw = decodeFirestoreValue(fields.root);
    const months = decodeFirestoreValue(fields.months);
    const meta = decodeFirestoreValue(fields.meta);
    if (typeof rootRaw !== 'string') throw new Error('Firestore user document (schema 2) has no "root" string.');
    if (!Array.isArray(months) || months.some(m => typeof m !== 'string')) throw new Error('Firestore user document (schema 2) has no valid "months" list.');

    const appState = parseJson(rootRaw || '{}', 'Firestore users/{uid}.root');
    const monthDocs = await Promise.all(months.map(month =>
      firestoreGet(`${base}/months/${encodeURIComponent(month)}`, token, true)
    ));

    // The tracker writes every listed month in the same batch as the root, so a
    // gap here is a bad read. Skipping it would record that month's tasks as removed.
    const days = [];
    for (let i = 0; i < months.length; i += 1) {
      const raw = decodeFirestoreValue(monthDocs[i]?.fields?.days);
      if (typeof raw !== 'string') throw new Error(`Firestore month ${months[i]} is listed on the user document but its document or "days" field is missing.`);
      const parsed = parseJson(raw, `Firestore months/${months[i]}.days`);
      if (!Array.isArray(parsed)) throw new Error(`Firestore months/${months[i]}.days is not a list.`);
      days.push(...parsed);
    }
    days.sort((a, b) => String(a?.date || '').localeCompare(String(b?.date || '')));
    appState.days = days;

    const notesDoc = await firestoreGet(`${base}/notes/main`, token, true);
    const notesRaw = decodeFirestoreValue(notesDoc?.fields?.notes);
    appState.taskNotes = typeof notesRaw === 'string' ? parseJson(notesRaw, 'Firestore notes/main.notes') : {};
    if (meta && typeof meta === 'object') appState.meta = meta;

    return { appState, updatedAt };
  }

  // Pre-split single-document format; the tracker migrates it on its next save.
  const legacyRaw = fields.state?.stringValue;
  if (typeof legacyRaw === 'string' && legacyRaw) {
    return { appState: parseJson(legacyRaw, 'Firestore users/{uid}.state'), updatedAt };
  }

  // Field names only, never values.
  throw new Error(`Firestore user document is not in a supported format (schema=${JSON.stringify(schema ?? null)}; fields: ${Object.keys(fields).sort().join(', ') || 'none'}).`);
}

function flattenTasks(appState) {
  const out = {};
  for (const day of appState?.days || []) {
    const date = String(day?.date || '');
    (day?.tasks || []).forEach((task, index) => {
      const title = String(task?.title || 'Untitled task').trim() || 'Untitled task';
      const id = String(task?.id || `${date}|${task?.category || ''}|${title}|${index}`);
      out[id] = {
        id,
        title,
        date,
        completed: Boolean(task?.completed),
        skipped: Boolean(task?.skipped),
        duration: task?.duration ?? null,
        category: task?.category ?? null
      };
    });
  }
  return out;
}

// Pacific calendar date of an ISO timestamp, or of now when it is missing or unparseable.
function dateKey(iso) {
  const parsed = iso ? new Date(iso) : null;
  const when = parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date();
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(when);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
}

function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function eventId(parts) { return crypto.createHash('sha256').update(parts.join('|')).digest('hex').slice(0, 24); }
function hours(value) { return value === null || value === undefined || value === '' ? 'unspecified' : `${value}h`; }

function diffTasks(previous, current, date, stamp) {
  const events = [];
  for (const [id, task] of Object.entries(current)) {
    const old = previous[id];
    if (!old) {
      events.push({ id: eventId(['add', stamp || '', id]), date, text: `Added task "${clean(task.title)}".` });
      continue;
    }
    if (old.completed !== task.completed) events.push({ id: eventId(['complete', stamp || '', id, String(task.completed)]), date, text: task.completed ? `Completed "${clean(task.title)}".` : `Marked "${clean(task.title)}" incomplete.` });
    if (old.skipped !== task.skipped) events.push({ id: eventId(['skip', stamp || '', id, String(task.skipped)]), date, text: task.skipped ? `Skipped "${clean(task.title)}".` : `Unskipped "${clean(task.title)}".` });
    if (old.title !== task.title) events.push({ id: eventId(['rename', stamp || '', id, old.title, task.title]), date, text: `Renamed task "${clean(old.title)}" to "${clean(task.title)}".` });
    if (old.date !== task.date) events.push({ id: eventId(['move', stamp || '', id, old.date, task.date]), date, text: `Moved "${clean(task.title)}" from ${old.date || 'no date'} to ${task.date || 'no date'}.` });
    if (String(old.duration ?? '') !== String(task.duration ?? '')) events.push({ id: eventId(['duration', stamp || '', id, String(old.duration), String(task.duration)]), date, text: `Updated "${clean(task.title)}" duration from ${hours(old.duration)} to ${hours(task.duration)}.` });
  }
  for (const [id, task] of Object.entries(previous)) {
    if (!current[id]) events.push({ id: eventId(['remove', stamp || '', id]), date, text: `Removed task "${clean(task.title)}".` });
  }
  return events;
}

async function githubJson(path) {
  const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', 'user-agent': 'template-calendar-sync' };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function sourceHead() {
  const commit = await githubJson(`/repos/${SOURCE_REPO}/commits/main`);
  return { sha: commit.sha, message: clean(commit?.commit?.message?.split('\n')[0] || 'Updated website') };
}

async function sourceEvents(previousSha, head, date) {
  if (!previousSha || previousSha === head.sha) return [];
  try {
    const comparison = await githubJson(`/repos/${SOURCE_REPO}/compare/${encodeURIComponent(previousSha)}...${encodeURIComponent(head.sha)}`);
    return (comparison?.commits || []).map(commit => ({ id: `git:${commit.sha}`, date, text: `Website update: ${clean(commit?.commit?.message?.split('\n')[0] || 'Updated website')}.` }));
  } catch {
    return [{ id: `git:${head.sha}`, date, text: `Website update: ${head.message}.` }];
  }
}

function renderMarkdown(entries) {
  if (!entries.length) return '# Template Calendar\n\nNo new updates yet.\n';
  const grouped = new Map();
  for (const e of entries) { if (!grouped.has(e.date)) grouped.set(e.date, []); grouped.get(e.date).push(e); }
  const lines = ['# Template Calendar', ''];
  for (const date of [...grouped.keys()].sort()) {
    lines.push(`## ${prettyDate(date)}`, '');
    for (const e of grouped.get(date)) lines.push(`- ${e.text}`);
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

async function main() {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) fail('Missing FIREBASE_SERVICE_ACCOUNT secret.');
  if (!process.env.SOURCE_FIREBASE_USER_UID) fail('Missing SOURCE_FIREBASE_USER_UID secret.');

  let sa;
  try { sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT); }
  catch (e) { fail(`FIREBASE_SERVICE_ACCOUNT is not valid JSON: ${e.message}`); }
  if (!sa.project_id || !sa.client_email || !sa.private_key) fail('FIREBASE_SERVICE_ACCOUNT is missing required fields.');

  const [{ appState, updatedAt }, head] = await Promise.all([
    readSummerState(sa, process.env.SOURCE_FIREBASE_USER_UID),
    sourceHead()
  ]);

  const currentTasks = flattenTasks(appState);
  const previousState = readJson(STATE_PATH, null);
  const data = readJson(DATA_PATH, { entries: [] });
  const existing = Array.isArray(data.entries) ? data.entries : [];

  if (!previousState?.initialized) {
    writeJson(STATE_PATH, { version: 1, initialized: true, initializedAt: new Date().toISOString(), firestoreUpdatedAt: updatedAt, sourceHead: head.sha, tasks: currentTasks });
    writeJson(DATA_PATH, { updatedAt: new Date().toISOString(), entries: existing });
    fs.writeFileSync(MARKDOWN_PATH, renderMarkdown(existing));
    console.log(`Baseline created with ${Object.keys(currentTasks).length} tasks. No old activity was added.`);
    return;
  }

  const currentCount = Object.keys(currentTasks).length;
  const previousCount = Object.keys(previousState.tasks || {}).length;
  if (currentCount === 0 && previousCount > 0) {
    fail(`Firestore returned 0 tasks but the last snapshot had ${previousCount}. Refusing to record them all as removed. Check that the tracker's cloud save is intact and that SOURCE_FIREBASE_USER_UID points at the right user.`);
  }

  // Task changes are dated by the tracker's last cloud save, not by when this run
  // happened, so an 11:50pm change synced after midnight keeps its own day.
  const activityDate = dateKey(updatedAt);
  const candidates = [
    ...diffTasks(previousState.tasks || {}, currentTasks, activityDate, updatedAt),
    ...await sourceEvents(previousState.sourceHead, head, dateKey())
  ];
  const seen = new Set(existing.map(e => e.id));
  const added = candidates.filter(e => !seen.has(e.id));

  // Nothing new: leave every file untouched so the commit step has nothing to commit.
  // The snapshot only advances together with the entries it produced.
  if (!added.length) {
    console.log(`No new activity (${currentCount} tasks; tracker last saved ${updatedAt || 'unknown'}). Nothing written.`);
    return;
  }

  const entries = [...existing, ...added];
  writeJson(STATE_PATH, { version: 1, initialized: true, initializedAt: previousState.initializedAt, lastCheckedAt: new Date().toISOString(), firestoreUpdatedAt: updatedAt, sourceHead: head.sha, tasks: currentTasks });
  writeJson(DATA_PATH, { updatedAt: new Date().toISOString(), entries });
  fs.writeFileSync(MARKDOWN_PATH, renderMarkdown(entries));
  console.log(`Added ${added.length} new entries (${currentCount} tasks; tracker last saved ${updatedAt || 'unknown'}).`);
}

main().catch(err => { console.error(err.stack || err); process.exit(1); });
