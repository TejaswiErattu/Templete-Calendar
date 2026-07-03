// auth.js — Landing Screen & Sign-In/Out UI
// Must be loaded AFTER firebase-sync.js (which defines `auth`, `signInWithGoogle`, `signOutFirebase`)

// ── LANDING SCREEN ────────────────────────────────────────────
function showLandingScreen() {
  document.getElementById('landing-screen')?.classList.remove('hidden');
  document.getElementById('app-wrapper')?.classList.add('hidden');
}

function hideLandingScreen() {
  document.getElementById('landing-screen')?.classList.add('hidden');
  document.getElementById('app-wrapper')?.classList.remove('hidden');
}

// ── CALENDAR SETTINGS MODAL ───────────────────────────────────
function openCalendarSettingsModal() {
  const settings = window.userCalendarSettings || {};
  const startInput = document.getElementById('cal-start-date');
  const endInput   = document.getElementById('cal-end-date');
  const maxSlider  = document.getElementById('cal-daily-max');
  const maxDisplay = document.getElementById('val-daily-max');

  if (startInput) startInput.value = settings.startDate || '';
  if (endInput)   endInput.value   = settings.endDate   || '';
  if (maxSlider) {
    maxSlider.value  = settings.dailyMaxHours || 8;
    if (maxDisplay) maxDisplay.textContent = maxSlider.value;
    maxSlider.oninput = () => { if (maxDisplay) maxDisplay.textContent = maxSlider.value; };
  }

  document.getElementById('calendar-settings-modal')?.classList.add('open');
  document.getElementById('overlay-backdrop')?.classList.add('active');
}

function closeCalendarSettingsModal() {
  document.getElementById('calendar-settings-modal')?.classList.remove('open');
  const anyModalOpen = document.querySelector('.modal.open');
  if (!anyModalOpen) document.getElementById('overlay-backdrop')?.classList.remove('active');
}

async function saveCalendarSettings() {
  const startDate     = document.getElementById('cal-start-date')?.value;
  const endDate       = document.getElementById('cal-end-date')?.value;
  const dailyMaxHours = parseFloat(document.getElementById('cal-daily-max')?.value) || 8;

  if (!startDate || !endDate) {
    showAuthToast('Please set both a start and end date.', 'error');
    return;
  }
  if (startDate >= endDate) {
    showAuthToast('End date must be after start date.', 'error');
    return;
  }

  window.userCalendarSettings = { startDate, endDate, dailyMaxHours };

  if (typeof currentUser !== 'undefined' && currentUser) {
    await db.collection('users').doc(currentUser.uid)
      .collection('settings').doc('calendar')
      .set({ startDate, endDate, dailyMaxHours });
  }

  closeCalendarSettingsModal();
  showAuthToast('Calendar settings saved!', 'success');

  // Re-render calendar with new range
  if (typeof rerenderCalendarForSettings === 'function') rerenderCalendarForSettings();
  if (typeof renderTrackerMetrics === 'function') renderTrackerMetrics();
}

// ── BIND BUTTONS ON DOM READY ─────────────────────────────────
function _bindAuthButtons() {
  // Landing screen sign-in button
  document.getElementById('landing-signin-btn')
    ?.addEventListener('click', () => { if (typeof signInWithGoogle === 'function') signInWithGoogle(); });

  // Auth bar sign-in
  document.getElementById('auth-signin-btn')
    ?.addEventListener('click', () => { if (typeof signInWithGoogle === 'function') signInWithGoogle(); });

  // Auth bar sign-out
  document.getElementById('auth-signout-btn')
    ?.addEventListener('click', () => { if (typeof signOutFirebase === 'function') signOutFirebase(); });

  // Calendar settings gear button
  document.getElementById('open-cal-settings-btn')
    ?.addEventListener('click', openCalendarSettingsModal);

  // Calendar settings modal close
  document.getElementById('close-cal-settings-btn')
    ?.addEventListener('click', closeCalendarSettingsModal);

  // Calendar settings save
  document.getElementById('save-cal-settings-btn')
    ?.addEventListener('click', saveCalendarSettings);

  // Section manager open button
  document.getElementById('open-section-manager-btn')
    ?.addEventListener('click', () => { if (typeof openSectionModal === 'function') openSectionModal(); });
}

// Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bindAuthButtons);
} else {
  _bindAuthButtons();
}
