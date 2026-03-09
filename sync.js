// DevLearn v2 — Supabase Cross-Device Sync
// Uses logged-in user ID when available, falls back to device ID

const SUPABASE_URL  = 'https://mqnosenddinigyurvkwx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbm9zZW5kZGluaWd5dXJ2a3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTkxNDcsImV4cCI6MjA4ODYzNTE0N30.o78QfqJdXA2jTVENbCcP1vHbDx1jksf1LId7SFylIKA';
const DEVICE_KEY    = 'devlearn_device_id';
const STORAGE_KEY   = 'devlearn_v2';
const SYNC_INTERVAL = 30000; // sync every 30s

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

// Get the best available sync key: user ID > device ID
function getSyncKey() {
  if (window.Auth?.session?.access_token) {
    // Extract user ID from JWT
    try {
      const payload = JSON.parse(atob(window.Auth.session.access_token.split('.')[1]));
      if (payload.sub) return 'user_' + payload.sub;
    } catch {}
  }
  return getDeviceId();
}

function getAuthHeader() {
  const token = window.Auth?.session?.access_token || SUPABASE_ANON;
  return { 'apikey': SUPABASE_ANON, 'Authorization': 'Bearer ' + token };
}

async function sfetch(path, opts = {}) {
  try {
    const res = await fetch(SUPABASE_URL + path, {
      ...opts,
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal',
        ...(opts.headers || {})
      }
    });
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch { return null; }
}

async function pushProgress() {
  const key = getSyncKey();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  await sfetch('/rest/v1/progress', {
    method: 'POST',
    body: JSON.stringify({
      device_id: key,
      data: JSON.parse(raw),
      updated_at: new Date().toISOString()
    })
  });
}

async function pullProgress() {
  const key = getSyncKey();
  // If logged in as user, fetch their specific row
  const rows = await sfetch(`/rest/v1/progress?device_id=eq.${encodeURIComponent(key)}&limit=1`);
  if (!rows || rows.length === 0) return false;

  const remote = rows[0];
  const remoteTime = new Date(remote.updated_at).getTime();

  const localRaw = localStorage.getItem(STORAGE_KEY);
  const localData = localRaw ? JSON.parse(localRaw) : {};
  const localTime = localData._savedAt || 0;

  if (remoteTime > localTime) {
    // Merge: take highest XP, streak, union completed
    const remoteData = remote.data;
    const merged = {
      ...localData,
      xp:        Math.max(localData.xp || 0, remoteData.xp || 0),
      streak:    Math.max(localData.streak || 0, remoteData.streak || 0),
      completed: { ...(localData.completed || {}), ...(remoteData.completed || {}) },
      cardIndex: mergeCardIndex(localData.cardIndex, remoteData.cardIndex),
      lastActive: remoteTime > localTime ? remoteData.lastActive : localData.lastActive,
      _savedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  }
  return false;
}

function mergeCardIndex(local = {}, remote = {}) {
  const merged = { ...local };
  for (const [k, v] of Object.entries(remote)) {
    merged[k] = Math.max(merged[k] || 0, v || 0);
  }
  return merged;
}

function showSyncBadge(text = '☁️ Synced') {
  let badge = document.getElementById('sync-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'sync-badge';
    badge.style.cssText = 'position:fixed;bottom:72px;right:16px;z-index:9999;background:rgba(16,185,129,.9);color:#fff;font-size:11px;font-weight:700;padding:5px 10px;border-radius:20px;opacity:0;transition:opacity .3s;pointer-events:none;';
    document.body.appendChild(badge);
  }
  badge.textContent = text;
  badge.style.opacity = '1';
  setTimeout(() => { badge.style.opacity = '0'; }, 2500);
}

const Sync = {
  userId: null,

  async init() {
    if (this._started) return;
    this._started = true;
    // Initial pull
    const updated = await pullProgress();
    if (updated) {
      showSyncBadge('☁️ Progress synced');
      if (window.app?.refreshHomeStats) { app.refreshHomeStats(); app.renderTopicMap(); }
    }
    await pushProgress();

    // Periodic sync
    setInterval(async () => {
      await pushProgress();
      const updated = await pullProgress();
      if (updated && window.app?.refreshHomeStats) { app.refreshHomeStats(); app.renderTopicMap(); }
    }, SYNC_INTERVAL);

    window.addEventListener('beforeunload', pushProgress);
    document.addEventListener('devlearn:cardAdvanced', pushProgress);
    document.addEventListener('devlearn:chapterComplete', pushProgress);
  },

  // Called by auth.js after login — push local progress under user ID
  async onLogin() {
    await pushProgress(); // now uses user ID as key
    const updated = await pullProgress();
    if (updated) {
      showSyncBadge('☁️ Progress synced from your account');
      if (window.app?.refreshHomeStats) { app.refreshHomeStats(); app.renderTopicMap(); }
    }
  }
};

// Wait for auth to restore session before first sync
// Auth fires 'devlearn:authReady' when done
document.addEventListener('devlearn:authReady', () => Sync.init());
// Fallback: if no auth event in 2s, sync anyway (logged-out users)
setTimeout(() => { if (!Sync._started) Sync.init(); }, 2000);
