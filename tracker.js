// tracker.js — Dashboard Metrics & Analytics
// Depends on: userTasks (tasks.js), userSections (sections.js), getRealCurrentDate, getDaysBetween, parseDate, formatDate (app.js)

// ── METRICS COMPUTATION ───────────────────────────────────────
function computeMetrics() {
  const tasks  = typeof userTasks !== 'undefined' ? userTasks : [];
  const total  = tasks.length;
  const done   = tasks.filter(t => t.completed).length;
  const doneHrs = tasks.filter(t => t.completed)
                       .reduce((s, t) => s + (t.estimatedHours || 0), 0);
  const remainHrs = tasks.filter(t => !t.completed)
                         .reduce((s, t) => s + (t.estimatedHours || 0), 0);
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0;

  // Days left until user's end date
  let daysLeft     = 0;
  let dailyAvgNeeded = '0.0';
  try {
    const today   = getRealCurrentDate();
    const endDate = window.userCalendarSettings?.endDate || null;
    if (endDate && endDate > today) {
      daysLeft          = getDaysBetween(today, endDate);
      dailyAvgNeeded    = remainHrs > 0 && daysLeft > 0
        ? (remainHrs / daysLeft).toFixed(1)
        : '0.0';
    }
  } catch (e) { /* ignore if helpers not ready */ }

  // Streak
  const streak = _computeStreak(tasks);

  // Per-section hours
  const sections = typeof userSections !== 'undefined' ? userSections : [];
  const hoursPerSection = {};
  sections.forEach(s => {
    const st  = tasks.filter(t => t.sectionId === s.id);
    const tot = st.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const dnH = st.filter(t => t.completed).reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    if (tot > 0) {
      hoursPerSection[s.id] = { total: tot, done: dnH, name: s.name, color: s.color, icon: s.icon || '' };
    }
  });

  return { total, done, doneHrs, remainHrs, pct, daysLeft, dailyAvgNeeded, streak, hoursPerSection };
}

function _computeStreak(tasks) {
  if (!tasks || tasks.length === 0) return 0;

  const completedDates = new Set();
  tasks.forEach(t => {
    if (t.completed && t.completedAt) {
      completedDates.add(t.completedAt.substring(0, 10));
    }
  });
  if (completedDates.size === 0) return 0;

  let streak = 0;
  try {
    let checkDate = getRealCurrentDate();
    for (let i = 0; i < 365; i++) {
      if (completedDates.has(checkDate)) {
        streak++;
        const d = parseDate(checkDate);
        d.setDate(d.getDate() - 1);
        checkDate = formatDate(d);
      } else {
        break;
      }
    }
  } catch (e) { /* ignore */ }
  return streak;
}

// ── DOM RENDERING ─────────────────────────────────────────────
function renderTrackerMetrics() {
  if (typeof userTasks === 'undefined') return;

  const m = computeMetrics();

  _setText('metric-completion',    m.pct + '%');
  _setWidth('metric-completion-fill', m.pct);
  _setText('metric-completion-sub', `${m.done}/${m.total} Tasks Done`);

  _setText('metric-hours-logged',    m.doneHrs.toFixed(1) + 'h logged');
  _setText('metric-hours-remaining', m.remainHrs.toFixed(1) + 'h left');
  _setText('metric-daily-avg',       m.dailyAvgNeeded + 'h/day needed');
  _setText('metric-streak',          m.streak + (m.streak === 1 ? ' day' : ' days'));
  _setText('metric-countdown',       m.daysLeft + ' days');

  _renderHoursBreakdown(m.hoursPerSection);

  // Also update at-risk warning based on daily avg needed
  const warningEl = document.getElementById('at-risk-warning');
  if (warningEl && window.userCalendarSettings) {
    const dailyMax = window.userCalendarSettings.dailyMaxHours || 8;
    if (parseFloat(m.dailyAvgNeeded) > dailyMax && m.remainHrs > 0) {
      warningEl.classList.remove('hidden');
      const span = warningEl.querySelector('span');
      if (span) {
        span.textContent = `PLAN AT RISK: You need ${m.dailyAvgNeeded}h/day but your daily cap is ${dailyMax}h. Adjust your end date or reduce tasks.`;
      }
    } else {
      warningEl.classList.add('hidden');
    }
  }
}

function _renderHoursBreakdown(hoursPerSection) {
  const container = document.getElementById('section-hours-breakdown');
  if (!container) return;
  container.innerHTML = '';

  const entries = Object.entries(hoursPerSection);
  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-state-text" style="font-size:.75rem">Add tasks to sections to see the breakdown.</div>';
    return;
  }

  entries.sort((a, b) => b[1].total - a[1].total);
  entries.forEach(([, data]) => {
    const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
    const row = document.createElement('div');
    row.className = 'section-hours-row';
    row.innerHTML = `
      <div class="section-hours-label">
        <span class="section-hours-icon">${data.icon}</span>
        <span class="section-hours-name">${data.name}</span>
        <span class="section-hours-nums">${data.done.toFixed(1)}h / ${data.total.toFixed(1)}h</span>
      </div>
      <div class="section-hours-bar-track">
        <div class="section-hours-bar-fill" style="width:${pct}%;background:${data.color}"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

// ── HELPERS ───────────────────────────────────────────────────
function _setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function _setWidth(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%';
}
