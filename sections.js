// sections.js — User Section (Category) CRUD
// Depends on: db, currentUser (firebase-sync.js)

let userSections = []; // [{id, name, color, icon, link, order}]
let _sectionUnsub = null;

// ── FIRESTORE LISTENER ────────────────────────────────────────
function startSectionsListener(uid) {
  if (_sectionUnsub) { _sectionUnsub(); _sectionUnsub = null; }
  _sectionUnsub = db.collection('users').doc(uid).collection('sections')
    .orderBy('order', 'asc')
    .onSnapshot(snap => {
      userSections = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSectionLegend();
      updateSectionDropdowns();
      renderResourcesPanel();
      if (document.getElementById('section-modal')?.classList.contains('open')) {
        renderSectionManagerList();
      }
    }, err => console.error('Sections listener error:', err));
  return _sectionUnsub;
}

function stopSectionsListener() {
  if (_sectionUnsub) { _sectionUnsub(); _sectionUnsub = null; }
  userSections = [];
}

// ── HELPERS ───────────────────────────────────────────────────
function getSectionById(id) {
  return userSections.find(s => s.id === id) || null;
}

function getSectionColor(id) {
  const s = getSectionById(id);
  return s ? s.color : 'var(--neon-cyan)';
}

function getSectionLabel(id) {
  const s = getSectionById(id);
  return s ? `${s.icon || ''} ${s.name}`.trim() : (id || '');
}

// ── FIRESTORE CRUD ────────────────────────────────────────────
async function saveSectionToFirestore(section) {
  if (!currentUser) return;
  const col = db.collection('users').doc(currentUser.uid).collection('sections');
  if (section.id) {
    const { id, ...data } = section;
    await col.doc(id).set(data, { merge: true });
  } else {
    const order = userSections.length;
    await col.add({
      name:    section.name  || 'Unnamed',
      color:   section.color || '#8be9fd',
      icon:    section.icon  || '✨',
      link:    section.link  || '',
      order,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

async function deleteSectionFromFirestore(sectionId) {
  if (!currentUser) return;
  await db.collection('users').doc(currentUser.uid)
    .collection('sections').doc(sectionId).delete();
}

// ── SECTION MANAGER MODAL ─────────────────────────────────────
function openSectionModal() {
  renderSectionManagerList();
  document.getElementById('section-modal')?.classList.add('open');
  document.getElementById('overlay-backdrop')?.classList.add('active');
}

function closeSectionModal() {
  document.getElementById('section-modal')?.classList.remove('open');
  const anyOpen = document.querySelector('.modal.open');
  if (!anyOpen) document.getElementById('overlay-backdrop')?.classList.remove('active');
}

function renderSectionManagerList() {
  const list = document.getElementById('sections-list');
  if (!list) return;
  list.innerHTML = '';

  if (userSections.length === 0) {
    list.innerHTML = '<div class="empty-state-text">No sections yet — add your first below!</div>';
    return;
  }

  userSections.forEach(section => {
    const row = document.createElement('div');
    row.className = 'section-manager-row';
    row.dataset.id = section.id;
    const linkHtml = section.link
      ? `<a href="${section.link}" target="_blank" class="section-row-link" title="${section.link}">↗</a>`
      : '<span class="section-row-link-empty">no link</span>';

    row.innerHTML = `
      <div class="section-row-preview">
        <span class="section-color-swatch" style="background:${section.color}"></span>
        <span class="section-row-icon">${section.icon || ''}</span>
        <span class="section-row-name">${section.name}</span>
        ${linkHtml}
      </div>
      <div class="section-row-actions">
        <button class="icon-btn section-edit-btn" title="Edit">✏️</button>
        <button class="icon-btn section-delete-btn" title="Delete">🗑</button>
      </div>
    `;

    row.querySelector('.section-edit-btn').addEventListener('click', () => openSectionEditInline(row, section));
    row.querySelector('.section-delete-btn').addEventListener('click', async () => {
      if (confirm(`Delete section "${section.name}"?\nTasks using this section will keep their section ID.`)) {
        await deleteSectionFromFirestore(section.id);
        if (typeof playSynthSound === 'function') playSynthSound('click');
      }
    });

    list.appendChild(row);
  });
}

function openSectionEditInline(row, section) {
  row.innerHTML = `
    <div class="section-inline-edit">
      <input type="color" class="cat-color-swatch inline-edit-color" value="${section.color}">
      <input class="cat-icon-input form-input inline-edit-icon" placeholder="✨" maxlength="4" value="${section.icon || ''}">
      <input class="form-input cat-name-input inline-edit-name" placeholder="Section name" value="${section.name}">
      <input type="url" class="form-input section-link-input inline-edit-link" placeholder="https://..." value="${section.link || ''}">
      <button class="cat-add-btn inline-save-btn">✓</button>
      <button class="btn btn-ghost inline-cancel-btn">✕</button>
    </div>
  `;

  row.querySelector('.inline-save-btn').addEventListener('click', async () => {
    const name = row.querySelector('.inline-edit-name').value.trim();
    if (!name) return;
    await saveSectionToFirestore({
      id:    section.id,
      name,
      color: row.querySelector('.inline-edit-color').value,
      icon:  row.querySelector('.inline-edit-icon').value.trim(),
      link:  row.querySelector('.inline-edit-link').value.trim(),
      order: section.order ?? 0
    });
    if (typeof playSynthSound === 'function') playSynthSound('success');
  });

  row.querySelector('.inline-cancel-btn').addEventListener('click', () => renderSectionManagerList());
}

async function addNewSectionFromForm() {
  const name = document.getElementById('new-section-name')?.value?.trim();
  if (!name) {
    document.getElementById('new-section-name')?.focus();
    return;
  }
  await saveSectionToFirestore({
    name,
    color: document.getElementById('new-section-color')?.value || '#8be9fd',
    icon:  document.getElementById('new-section-icon')?.value?.trim() || '✨',
    link:  document.getElementById('new-section-link')?.value?.trim() || ''
  });
  if (typeof playSynthSound === 'function') playSynthSound('success');
  // Clear form
  ['new-section-name', 'new-section-icon', 'new-section-link'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ── SECTION LEGEND & DROPDOWNS ────────────────────────────────
function renderSectionLegend() {
  const grid = document.getElementById('user-section-legend-grid');
  if (!grid) return;
  grid.innerHTML = '';

  userSections.forEach(section => {
    const item = document.createElement('div');
    item.className = 'legend-item';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';
    dot.style.background = section.color;

    item.appendChild(dot);

    if (section.link) {
      const a = document.createElement('a');
      a.href = section.link;
      a.target = '_blank';
      a.textContent = ` ${section.icon || ''} ${section.name}`.trim();
      a.style.color = 'inherit';
      item.appendChild(a);
    } else {
      item.appendChild(document.createTextNode(` ${section.icon || ''} ${section.name}`.trim()));
    }
    grid.appendChild(item);
  });
}

function updateSectionDropdowns() {
  document.querySelectorAll('.section-select').forEach(select => {
    const currentVal = select.value;
    select.innerHTML = '<option value="">— No Section —</option>';
    userSections.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.icon || ''} ${s.name}`.trim();
      select.appendChild(opt);
    });
    select.value = currentVal;
  });
}

// ── RESOURCES PANEL ───────────────────────────────────────────
function renderResourcesPanel() {
  const panel = document.getElementById('user-resources-panel');
  if (!panel) return;
  panel.innerHTML = '';

  const withLinks = userSections.filter(s => s.link);
  if (withLinks.length === 0) {
    panel.innerHTML = '<div class="empty-state-text">Add a link to any section to see it here.</div>';
    return;
  }

  withLinks.forEach(section => {
    const card = document.createElement('div');
    card.className = 'resource-card';
    card.innerHTML = `
      <div class="resource-card-header" style="border-left:3px solid ${section.color}">
        <span class="resource-card-icon">${section.icon || '🔗'}</span>
        <div class="resource-card-info">
          <span class="resource-card-name">${section.name}</span>
          <a href="${section.link}" target="_blank" class="resource-card-link">${section.link}</a>
        </div>
        <button class="icon-btn resource-edit-link-btn" data-id="${section.id}" title="Edit link">✏️</button>
      </div>
    `;
    card.querySelector('.resource-edit-link-btn').addEventListener('click', e => {
      e.stopPropagation();
      const newLink = prompt('Enter link URL:', section.link);
      if (newLink !== null) {
        saveSectionToFirestore({ ...section, link: newLink.trim() });
      }
    });
    panel.appendChild(card);
  });
}

// ── SECTION MANAGER INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-section-modal-btn')
    ?.addEventListener('click', closeSectionModal);

  document.getElementById('add-new-section-btn')
    ?.addEventListener('click', addNewSectionFromForm);

  // Enter key in name field
  document.getElementById('new-section-name')
    ?.addEventListener('keydown', e => { if (e.key === 'Enter') addNewSectionFromForm(); });
});
