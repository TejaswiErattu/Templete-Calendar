// tasks.js — User Task CRUD, Checklists, Day Notes
// Depends on: db, currentUser (firebase-sync.js), getSectionById, getSectionColor, getSectionLabel (sections.js)

let userTasks = [];     // [{id, title, sectionId, estimatedHours, notes, dueDate, priority, completed, completedAt, checklist, link, createdAt}]
let userDayNotes = {};  // { dateKey: {notes: "", checklist: [{id, text, done}]} }

let _taskUnsub      = null;
let _dayNotesUnsub  = null;
let _currentEditTaskId  = null;   // null = new task
let _taskModalDateKey   = null;   // pre-fill due date when adding from a day

// ── FIRESTORE LISTENERS ───────────────────────────────────────
function startTasksListener(uid) {
  if (_taskUnsub) { _taskUnsub(); _taskUnsub = null; }
  _taskUnsub = db.collection('users').doc(uid).collection('tasks')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snap => {
      userTasks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (typeof renderTrackerMetrics === 'function') renderTrackerMetrics();
      if (typeof selectedDate !== 'undefined' && selectedDate) {
        renderUserTasksForDay(selectedDate);
      }
      renderCalendarUserTaskDots();
    }, err => console.error('Tasks listener error:', err));
  return _taskUnsub;
}

function startDayNotesListener(uid) {
  if (_dayNotesUnsub) { _dayNotesUnsub(); _dayNotesUnsub = null; }
  _dayNotesUnsub = db.collection('users').doc(uid).collection('dayNotes')
    .onSnapshot(snap => {
      userDayNotes = {};
      snap.docs.forEach(d => { userDayNotes[d.id] = d.data(); });
      if (typeof selectedDate !== 'undefined' && selectedDate) {
        renderDayChecklist(selectedDate);
      }
    }, err => console.error('Day notes listener error:', err));
  return _dayNotesUnsub;
}

function stopTasksListeners() {
  if (_taskUnsub)     { _taskUnsub();     _taskUnsub     = null; }
  if (_dayNotesUnsub) { _dayNotesUnsub(); _dayNotesUnsub = null; }
  userTasks    = [];
  userDayNotes = {};
}

// ── FIRESTORE CRUD ────────────────────────────────────────────
async function saveTaskToFirestore(task) {
  if (!currentUser) return null;
  const col = db.collection('users').doc(currentUser.uid).collection('tasks');
  if (task.id) {
    const { id, ...data } = task;
    await col.doc(id).set(data, { merge: true });
    return id;
  } else {
    const doc = await col.add({
      ...task,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return doc.id;
  }
}

async function deleteTaskFromFirestore(taskId) {
  if (!currentUser) return;
  await db.collection('users').doc(currentUser.uid).collection('tasks').doc(taskId).delete();
}

async function toggleTaskComplete(taskId) {
  const task = userTasks.find(t => t.id === taskId);
  if (!task || !currentUser) return;
  const nowDone = !task.completed;
  await db.collection('users').doc(currentUser.uid).collection('tasks').doc(taskId).update({
    completed:   nowDone,
    completedAt: nowDone ? new Date().toISOString() : null
  });
  if (typeof playSynthSound === 'function') playSynthSound(nowDone ? 'success' : 'click');
}

async function toggleChecklistItem(taskId, itemId) {
  const task = userTasks.find(t => t.id === taskId);
  if (!task || !currentUser) return;
  const checklist = (task.checklist || []).map(i =>
    i.id === itemId ? { ...i, done: !i.done } : i
  );
  await db.collection('users').doc(currentUser.uid).collection('tasks').doc(taskId).update({ checklist });
}

async function saveDayNote(dateKey, data) {
  if (!currentUser) return;
  await db.collection('users').doc(currentUser.uid)
    .collection('dayNotes').doc(dateKey).set(data, { merge: true });
}

// ── TASK MODAL ────────────────────────────────────────────────
function openAddTaskModal(dateKey) {
  _currentEditTaskId = null;
  _taskModalDateKey  = dateKey || null;

  document.getElementById('task-modal-heading').textContent = 'ADD_TASK';
  document.getElementById('task-modal-title-input').value   = '';
  document.getElementById('task-modal-hours').value         = 1;
  document.getElementById('task-modal-due-date').value      = dateKey || '';
  document.getElementById('task-modal-priority').value      = 'medium';
  document.getElementById('task-modal-notes').value         = '';
  document.getElementById('task-modal-link').value          = '';
  document.getElementById('task-modal-delete-btn').style.display = 'none';

  _populateTaskModalSections(null);
  _renderModalChecklist([]);

  document.getElementById('task-modal')?.classList.add('open');
  document.getElementById('overlay-backdrop')?.classList.add('active');
  document.getElementById('task-modal-title-input')?.focus();
}

function openEditTaskModal(taskId) {
  const task = userTasks.find(t => t.id === taskId);
  if (!task) return;

  _currentEditTaskId = taskId;
  _taskModalDateKey  = task.dueDate || null;

  document.getElementById('task-modal-heading').textContent         = 'EDIT_TASK';
  document.getElementById('task-modal-title-input').value           = task.title         || '';
  document.getElementById('task-modal-hours').value                 = task.estimatedHours ?? 1;
  document.getElementById('task-modal-due-date').value              = task.dueDate        || '';
  document.getElementById('task-modal-priority').value              = task.priority       || 'medium';
  document.getElementById('task-modal-notes').value                 = task.notes          || '';
  document.getElementById('task-modal-link').value                  = task.link           || '';
  document.getElementById('task-modal-delete-btn').style.display    = 'inline-flex';

  _populateTaskModalSections(task.sectionId || null);
  _renderModalChecklist(task.checklist || []);

  document.getElementById('task-modal')?.classList.add('open');
  document.getElementById('overlay-backdrop')?.classList.add('active');
}

function closeTaskModal() {
  document.getElementById('task-modal')?.classList.remove('open');
  const anyOpen = document.querySelector('.modal.open');
  if (!anyOpen) document.getElementById('overlay-backdrop')?.classList.remove('active');
  _currentEditTaskId = null;
  _taskModalDateKey  = null;
}

function _populateTaskModalSections(selectedId) {
  const select = document.getElementById('task-modal-section');
  if (!select) return;
  select.innerHTML = '<option value="">— No Section —</option>';
  (typeof userSections !== 'undefined' ? userSections : []).forEach(s => {
    const opt = document.createElement('option');
    opt.value   = s.id;
    opt.textContent = `${s.icon || ''} ${s.name}`.trim();
    if (s.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  });
}

async function saveTaskFromModal() {
  const titleEl = document.getElementById('task-modal-title-input');
  const title   = titleEl?.value?.trim();
  if (!title) {
    titleEl?.focus();
    titleEl?.style && (titleEl.style.borderColor = 'var(--neon-pink)');
    setTimeout(() => { if (titleEl) titleEl.style.borderColor = ''; }, 1200);
    return;
  }

  const checklist = _getModalChecklist();
  const taskData  = {
    title,
    sectionId:      document.getElementById('task-modal-section')?.value  || null,
    estimatedHours: parseFloat(document.getElementById('task-modal-hours')?.value) || 1,
    dueDate:        document.getElementById('task-modal-due-date')?.value  || null,
    priority:       document.getElementById('task-modal-priority')?.value  || 'medium',
    notes:          document.getElementById('task-modal-notes')?.value?.trim() || '',
    link:           document.getElementById('task-modal-link')?.value?.trim()  || '',
    checklist,
    completed: _currentEditTaskId
      ? (userTasks.find(t => t.id === _currentEditTaskId)?.completed || false)
      : false
  };

  if (_currentEditTaskId) taskData.id = _currentEditTaskId;

  await saveTaskToFirestore(taskData);
  if (typeof playSynthSound === 'function') playSynthSound('success');
  closeTaskModal();
}

async function deleteTaskFromModal() {
  if (!_currentEditTaskId) return;
  if (!confirm('Delete this task permanently?')) return;
  await deleteTaskFromFirestore(_currentEditTaskId);
  if (typeof playSynthSound === 'function') playSynthSound('click');
  closeTaskModal();
}

// ── CHECKLIST IN MODAL ────────────────────────────────────────
function _renderModalChecklist(items) {
  const container = document.getElementById('task-modal-checklist-items');
  if (!container) return;
  container.innerHTML = '';

  items.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className      = 'checklist-row';
    row.dataset.itemId = item.id || `idx_${idx}`;
    row.innerHTML = `
      <input type="checkbox" class="checklist-modal-check" ${item.done ? 'checked' : ''}>
      <input type="text" class="checklist-modal-text form-input-sm" value="${item.text || ''}" placeholder="Checklist item...">
      <button class="icon-btn checklist-delete-btn" title="Remove">✕</button>
    `;
    row.querySelector('.checklist-delete-btn').addEventListener('click', () => {
      const current = _getModalChecklist();
      current.splice(idx, 1);
      _renderModalChecklist(current);
    });
    container.appendChild(row);
  });
}

function addChecklistItemToModal() {
  const current = _getModalChecklist();
  current.push({ id: `item_${Date.now()}`, text: '', done: false });
  _renderModalChecklist(current);
  // Focus the last input
  const inputs = document.querySelectorAll('#task-modal-checklist-items .checklist-modal-text');
  inputs[inputs.length - 1]?.focus();
}

function _getModalChecklist() {
  const rows = document.querySelectorAll('#task-modal-checklist-items .checklist-row');
  const items = [];
  rows.forEach((row, idx) => {
    const text = row.querySelector('.checklist-modal-text')?.value?.trim();
    const done = row.querySelector('.checklist-modal-check')?.checked || false;
    const id   = row.dataset.itemId || `item_${idx}`;
    if (text) items.push({ id, text, done });
  });
  return items;
}

// ── RENDER TASKS IN DAY DRAWER ────────────────────────────────
function renderUserTasksForDay(dateKey) {
  const container = document.getElementById('user-tasks-for-day');
  if (!container) return;
  container.innerHTML = '';

  const dayTasks = userTasks.filter(t => t.dueDate === dateKey);

  if (dayTasks.length === 0) {
    container.innerHTML = `<div class="empty-state-text" style="font-size:.78rem;color:var(--text-muted);text-align:center;padding:.6rem 0">
      No tasks for this day. Click "+ Add Task" below.
    </div>`;
    return;
  }

  // Sort: priority high → medium → low, incomplete first
  const pOrder = { high: 0, medium: 1, low: 2 };
  dayTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
  });

  dayTasks.forEach(task => {
    const section      = task.sectionId ? getSectionById(task.sectionId) : null;
    const sColor       = section ? section.color : 'var(--neon-cyan)';
    const sLabel       = section ? `${section.icon || ''} ${section.name}`.trim() : '';
    const checklist    = task.checklist || [];
    const doneCount    = checklist.filter(i => i.done).length;
    const pColors      = { high: 'var(--neon-pink)', medium: 'var(--neon-yellow)', low: 'var(--text-muted)' };
    const pColor       = pColors[task.priority] || pColors.medium;

    const checklistHtml = checklist.length > 0 ? `
      <div class="task-checklist-summary">
        <div class="task-checklist-bar-track">
          <div class="task-checklist-bar-fill" style="width:${Math.round((doneCount / checklist.length) * 100)}%"></div>
        </div>
        <span class="task-checklist-count">${doneCount}/${checklist.length} steps</span>
      </div>` : '';

    const row = document.createElement('div');
    row.className   = `user-task-row ${task.completed ? 'task-checked' : ''}`;
    row.style.borderLeft = `3px solid ${sColor}`;
    row.innerHTML = `
      <label class="checkbox-container user-task-checkbox">
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span class="custom-checkbox"></span>
      </label>
      <div class="user-task-details">
        <div class="user-task-header-row">
          <span class="user-task-title ${task.completed ? 'strikethrough' : ''}">${task.title}</span>
          <span class="priority-badge" style="color:${pColor}">${(task.priority || 'medium').toUpperCase()}</span>
        </div>
        <div class="user-task-meta">
          ${sLabel ? `<span class="task-cat-badge" style="background:${sColor}22;color:${sColor};border:1px solid ${sColor}55">${sLabel}</span>` : ''}
          <span class="task-hours-badge">${task.estimatedHours ?? 1}h</span>
          ${task.link ? `<a href="${task.link}" target="_blank" class="task-link-badge">↗</a>` : ''}
        </div>
        ${checklistHtml}
        ${task.notes ? `<div class="user-task-notes">${task.notes}</div>` : ''}
      </div>
      <div class="user-task-actions">
        <button class="icon-btn user-task-edit-btn" title="Edit task">✏️</button>
        ${checklist.length > 0 ? `<button class="icon-btn user-task-expand-btn" title="Show checklist">▾</button>` : ''}
      </div>
    `;

    // Checkbox toggle
    row.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTaskComplete(task.id));

    // Edit
    row.querySelector('.user-task-edit-btn').addEventListener('click', e => {
      e.stopPropagation();
      openEditTaskModal(task.id);
    });

    // Expand inline checklist
    const expandBtn = row.querySelector('.user-task-expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', e => {
        e.stopPropagation();
        _toggleExpandedChecklist(row, task);
      });
    }

    container.appendChild(row);
  });

  // Total hours summary
  const totalHrs = dayTasks.reduce((s, t) => s + (t.estimatedHours || 0), 0);
  const doneHrs  = dayTasks.filter(t => t.completed).reduce((s, t) => s + (t.estimatedHours || 0), 0);
  const summaryEl = document.getElementById('user-tasks-hours-summary');
  if (summaryEl) {
    summaryEl.textContent = `${doneHrs.toFixed(1)}h done / ${totalHrs.toFixed(1)}h total`;
  }
}

function _toggleExpandedChecklist(taskRow, task) {
  const existing = taskRow.querySelector('.user-task-checklist-expanded');
  if (existing) { existing.remove(); return; }

  const expanded = document.createElement('div');
  expanded.className = 'user-task-checklist-expanded';

  (task.checklist || []).forEach(item => {
    const itemRow = document.createElement('div');
    itemRow.className = `checklist-expanded-item ${item.done ? 'done' : ''}`;
    itemRow.innerHTML = `
      <label class="checkbox-container" style="font-size:.8rem;gap:.4rem">
        <input type="checkbox" ${item.done ? 'checked' : ''}>
        <span class="custom-checkbox"></span>
        ${item.text}
      </label>
    `;
    itemRow.querySelector('input').addEventListener('change', () => toggleChecklistItem(task.id, item.id));
    expanded.appendChild(itemRow);
  });

  taskRow.appendChild(expanded);
}

// ── DAY CHECKLIST (standalone daily notes) ────────────────────
function renderDayChecklist(dateKey) {
  const container = document.getElementById('day-checklist-container');
  if (!container) return;

  const dayData   = userDayNotes[dateKey] || {};
  const checklist = dayData.checklist || [];

  const notesEl = document.getElementById('day-notes-textarea');
  if (notesEl && notesEl !== document.activeElement) notesEl.value = dayData.notes || '';

  container.innerHTML = '';

  checklist.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = `day-checklist-item ${item.done ? 'done' : ''}`;
    row.innerHTML = `
      <label class="checkbox-container">
        <input type="checkbox" ${item.done ? 'checked' : ''}>
        <span class="custom-checkbox"></span>
      </label>
      <span class="day-checklist-text" contenteditable="true">${item.text}</span>
      <button class="icon-btn day-checklist-delete" title="Remove">✕</button>
    `;

    row.querySelector('input').addEventListener('change', async () => {
      const list = [...(userDayNotes[dateKey]?.checklist || [])];
      list[idx] = { ...list[idx], done: !list[idx].done };
      await saveDayNote(dateKey, { checklist: list });
    });

    const textEl = row.querySelector('.day-checklist-text');
    textEl.addEventListener('blur', async () => {
      const list = [...(userDayNotes[dateKey]?.checklist || [])];
      if (list[idx]) {
        list[idx] = { ...list[idx], text: textEl.textContent.trim() };
        await saveDayNote(dateKey, { checklist: list });
      }
    });

    row.querySelector('.day-checklist-delete').addEventListener('click', async () => {
      const list = [...(userDayNotes[dateKey]?.checklist || [])];
      list.splice(idx, 1);
      await saveDayNote(dateKey, { checklist: list });
    });

    container.appendChild(row);
  });
}

async function addDayChecklistItem(dateKey) {
  const list = [...(userDayNotes[dateKey]?.checklist || [])];
  list.push({ id: `dci_${Date.now()}`, text: 'New item', done: false });
  await saveDayNote(dateKey, { checklist: list });
}

async function saveDayNoteText(dateKey) {
  const notes = document.getElementById('day-notes-textarea')?.value?.trim() || '';
  await saveDayNote(dateKey, { notes });
  if (typeof showAuthToast === 'function') showAuthToast('Day note saved!', 'success');
}

// ── CALENDAR USER TASK DOTS ───────────────────────────────────
function renderCalendarUserTaskDots() {
  document.querySelectorAll('.day-cell[data-date]').forEach(cell => {
    const dateKey  = cell.dataset.date;
    const dayTasks = userTasks.filter(t => t.dueDate === dateKey);

    let dotsEl = cell.querySelector('.user-tasks-dots');
    if (!dotsEl) {
      dotsEl = document.createElement('div');
      dotsEl.className = 'user-tasks-dots';
      cell.appendChild(dotsEl);
    }
    dotsEl.innerHTML = '';

    dayTasks.forEach(task => {
      const dot = document.createElement('div');
      dot.className = `user-task-dot ${task.completed ? 'completed' : ''}`;
      const sec = task.sectionId ? getSectionById(task.sectionId) : null;
      dot.style.background = sec ? sec.color : 'var(--neon-cyan)';
      dot.title = task.title;
      dotsEl.appendChild(dot);
    });
  });
}

// ── WIRE MODAL BUTTONS ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('task-modal-save-btn')
    ?.addEventListener('click', saveTaskFromModal);

  document.getElementById('task-modal-delete-btn')
    ?.addEventListener('click', deleteTaskFromModal);

  document.getElementById('task-modal-cancel-btn')
    ?.addEventListener('click', closeTaskModal);

  document.getElementById('close-task-modal-btn')
    ?.addEventListener('click', closeTaskModal);

  document.getElementById('add-checklist-item-btn')
    ?.addEventListener('click', addChecklistItemToModal);
});
