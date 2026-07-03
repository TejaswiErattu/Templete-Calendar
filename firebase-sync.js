// Firebase Sync Engine — Google Auth + Firestore cloud save/load

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;
let isSyncing = false;

// Global calendar settings (loaded from Firestore on sign-in)
window.userCalendarSettings = null;

// All active Firestore unsubscribers (cleaned up on sign-out)
const _allUnsubs = [];

function _trackUnsub(fn) {
  if (typeof fn === 'function') _allUnsubs.push(fn);
}

function unsubAll() {
  _allUnsubs.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
  _allUnsubs.length = 0;
}

// ── SIGN IN / OUT ─────────────────────────────────────────────
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(err => {
    console.error("Sign-in error:", err.code, err.message);
    if (err.code === "auth/unauthorized-domain") {
      const domain = window.location.hostname;
      const firebaseUrl = `https://console.firebase.google.com/project/tejaswisummer/authentication/settings`;
      showAuthToast(`❌ "${domain}" is not authorized. Open Firebase Console → Authentication → Authorized Domains and add: ${domain}`, "error");
      console.error(`[Auth] Add "${domain}" to: ${firebaseUrl}`);
    } else if (err.code === "auth/popup-blocked") {
      showAuthToast("❌ Popup blocked — please allow popups for this site.", "error");
    } else {
      showAuthToast(`❌ Sign-in failed: ${err.code}`, "error");
    }
  });
}

function signOutFirebase() {
  unsubAll();
  if (typeof stopSectionsListener === 'function') stopSectionsListener();
  if (typeof stopTasksListeners  === 'function') stopTasksListeners();
  auth.signOut().then(() => {
    showAuthToast("Signed out successfully.", "info");
    if (typeof showLandingScreen === 'function') showLandingScreen();
  });
}

// ── DATA LISTENERS (starts all subcollection listeners) ───────
async function startDataListeners(uid) {
  // Load calendar settings
  try {
    const settingsDoc = await db.collection('users').doc(uid)
      .collection('settings').doc('calendar').get();
    if (settingsDoc.exists) {
      window.userCalendarSettings = settingsDoc.data();
    } else {
      // First-time user — prompt to set up calendar
      window.userCalendarSettings = null;
    }
  } catch (e) {
    console.error('Settings load error:', e);
  }

  // Start real-time listeners for sections, tasks, day notes
  if (typeof startSectionsListener === 'function') {
    _trackUnsub(startSectionsListener(uid));
  }
  if (typeof startTasksListener === 'function') {
    _trackUnsub(startTasksListener(uid));
  }
  if (typeof startDayNotesListener === 'function') {
    _trackUnsub(startDayNotesListener(uid));
  }
}

// ── AUTH STATE LISTENER ───────────────────────────────────────
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  updateAuthUI(user);

  if (user) {
    // Hide landing screen, show app
    if (typeof hideLandingScreen === 'function') hideLandingScreen();

    showAuthToast("Loading your workspace...", "info");

    // Load legacy schedule state (for existing users)
    await loadStateFromFirestore();

    if (typeof migrateScheduleIfNeeded === "function")  migrateScheduleIfNeeded();
    if (typeof maybeAutoRepairRollover  === "function")  maybeAutoRepairRollover();
    if (typeof applyCategoryColors      === "function")  applyCategoryColors();

    // Start new subcollection listeners
    await startDataListeners(user.uid);

    // Initialize UI
    if (typeof initUI === 'function') initUI();

    // If new user with no calendar settings, open setup modal
    if (!window.userCalendarSettings) {
      setTimeout(() => {
        if (typeof openCalendarSettingsModal === 'function') openCalendarSettingsModal();
      }, 800);
    }

    showAuthToast(`Welcome back, ${user.displayName?.split(' ')[0] || 'user'}! ☁️`, "success");
  } else {
    // Show landing screen
    if (typeof showLandingScreen === 'function') showLandingScreen();
    unsubAll();
    if (typeof stopSectionsListener === 'function') stopSectionsListener();
    if (typeof stopTasksListeners   === 'function') stopTasksListeners();
  }
});

// ── SAVE TO FIRESTORE ─────────────────────────────────────────
async function saveStateToFirestore() {
  if (!currentUser || isSyncing) return;
  isSyncing = true;
  try {
    const { rolloverUndoSnapshot, ...persistable } = appState;
    await db.collection("users").doc(currentUser.uid).set({
      state: JSON.stringify(persistable),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      displayName: currentUser.displayName,
      email: currentUser.email
    });
  } catch (e) {
    console.error("Firebase save error:", e.code, e.message);
    if (e.code === "permission-denied") {
      showAuthToast("☁️ Cloud blocked by Firestore rules — see setup. Saved locally.", "error");
    } else {
      showAuthToast("Cloud save failed. Progress still saved locally.", "error");
    }
  } finally {
    isSyncing = false;
  }
}

// ── LOAD FROM FIRESTORE ───────────────────────────────────────
async function loadStateFromFirestore() {
  if (!currentUser) return;
  try {
    const doc = await db.collection("users").doc(currentUser.uid).get();
    const countTasks = (s) => (s?.days || []).reduce((n, d) => n + (d.tasks?.length || 0), 0);
    const countDone  = (s) => (s?.days || []).reduce((n, d) => n + (d.tasks?.filter(t => t.completed).length || 0), 0);

    if (doc.exists && doc.data().state) {
      const cloudState = JSON.parse(doc.data().state);
      const cloudTasks = countTasks(cloudState);
      const localTasks = countTasks(appState);

      if (cloudTasks === 0 && localTasks === 0) {
        // Both empty — generate fresh and upload
        generateNewState();
        await saveStateToFirestore();
      } else if (cloudTasks === 0 || countDone(cloudState) < countDone(appState)) {
        // Cloud is empty or behind local — keep local, repair cloud
        await saveStateToFirestore();
      } else {
        // Cloud has data — use it
        appState = cloudState;
        localStorage.setItem("cyber_study_plan_state_2026", JSON.stringify(appState));
      }
    } else {
      // No cloud doc — upload local (or generate if also empty)
      if (countTasks(appState) === 0) generateNewState();
      await saveStateToFirestore();
    }
  } catch (e) {
    console.error("Firebase load error:", e);
    showAuthToast("Cloud load failed. Using local save.", "error");
  }
}

// ── AUTH UI ───────────────────────────────────────────────────
function updateAuthUI(user) {
  const bar       = document.getElementById("auth-status-bar");
  const signInBtn = document.getElementById("auth-signin-btn");
  const signOutBtn= document.getElementById("auth-signout-btn");
  const userInfo  = document.getElementById("auth-user-info");
  const avatar    = document.getElementById("auth-avatar");

  if (user) {
    bar?.classList.remove("auth-unsigned");
    bar?.classList.add("auth-signed");
    signInBtn?.classList.add("hidden");
    signOutBtn?.classList.remove("hidden");
    if (userInfo) {
      userInfo.innerText = `${user.displayName || user.email}`;
      userInfo.classList.remove("hidden");
    }
    if (avatar) {
      avatar.src = user.photoURL || "";
      avatar.classList.toggle("hidden", !user.photoURL);
    }
    // Update landing screen profile if visible
    const landingName = document.getElementById('landing-user-name');
    if (landingName) landingName.textContent = user.displayName || user.email;
  } else {
    bar?.classList.add("auth-unsigned");
    bar?.classList.remove("auth-signed");
    signInBtn?.classList.remove("hidden");
    signOutBtn?.classList.add("hidden");
    if (userInfo) { userInfo.innerText = ""; userInfo.classList.add("hidden"); }
    if (avatar) avatar.classList.add("hidden");
  }
}

// ── TOAST NOTIFICATIONS ───────────────────────────────────────
function showAuthToast(message, type = "info") {
  const existing = document.getElementById("auth-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "auth-toast";
  toast.className = `auth-toast auth-toast-${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("auth-toast-visible"), 50);
  setTimeout(() => {
    toast.classList.remove("auth-toast-visible");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
