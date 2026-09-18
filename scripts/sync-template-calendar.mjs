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

async function readSummerState(sa, uid) {
  const token = await getGoogleAccessToken(sa);
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/databases/(default)/documents/users/${encodeURIComponent(uid)}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Firestore read failed (${res.status}): ${await res.text()}`);
  const doc = await res.json();
  const raw = doc?.fields?.state?.stringValue;
  if (!raw) throw new Error('Firestore user document is missing fields.state.stringValue');
  return { appState: JSON.parse(raw), updatedAt: doc?.fields?.updatedAt?.timestampValue || null };
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

function todayKey() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
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

  const date = todayKey();
  const candidates = [
    ...diffTasks(previousState.tasks || {}, currentTasks, date, updatedAt),
    ...await sourceEvents(previousState.sourceHead, head, date)
  ];
  const seen = new Set(existing.map(e => e.id));
  const added = candidates.filter(e => !seen.has(e.id));
  const entries = [...existing, ...added];

  writeJson(STATE_PATH, { version: 1, initialized: true, initializedAt: previousState.initializedAt, lastCheckedAt: new Date().toISOString(), firestoreUpdatedAt: updatedAt, sourceHead: head.sha, tasks: currentTasks });
  writeJson(DATA_PATH, { updatedAt: new Date().toISOString(), entries });
  fs.writeFileSync(MARKDOWN_PATH, renderMarkdown(entries));
  console.log(added.length ? `Added ${added.length} new entries.` : 'No new Template Calendar entries detected.');
}

main().catch(err => { console.error(err.stack || err); process.exit(1); });
