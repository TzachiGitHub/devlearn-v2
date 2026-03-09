// DevLearn — Supabase Cross-Device Sync
// Silently syncs progress between phone and laptop via Supabase

const SUPABASE_URL  = 'https://mqnosenddinigyurvkwx.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbm9zZW5kZGluaWd5dXJ2a3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTkxNDcsImV4cCI6MjA4ODYzNTE0N30.o78QfqJdXA2jTVENbCcP1vHbDx1jksf1LId7SFylIKA';
const DEVICE_KEY    = 'devlearn_device_id';
const STORAGE_KEY   = 'devlearn_v2';
const SYNC_INTERVAL = 60000; // sync every 60s while active

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(SUPABASE_URL + path, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': 'Bearer ' + SUPABASE_ANON,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Push local progress to Supabase
async function pushProgress() {
  try {
    const deviceId = getDeviceId();
    const data = localStorage.getItem(STORAGE_KEY) || '{}';
    await supabaseFetch('/rest/v1/progress', {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        device_id: deviceId,
        data: JSON.parse(data),
        updated_at: new Date().toISOString()
      })
    });
  } catch (e) {
    // Silent fail — offline is fine
  }
}

// Pull latest progress from Supabase (whichever device is most recent)
async function pullProgress() {
  try {
    const deviceId = getDeviceId();
    // Get all device rows for this user — we merge by taking latest updated_at
    const rows = await supabaseFetch(
      '/rest/v1/progress?order=updated_at.desc&limit=10'
    );
    if (!rows || rows.length === 0) return false;

    // Find the most recent row that isn't this device (remote progress)
    const remote = rows.find(r => r.device_id !== deviceId);
    const local  = rows.find(r => r.device_id === deviceId);

    if (!remote) return false;

    const remoteTime = new Date(remote.updated_at).getTime();
    const localTime  = local ? new Date(local.updated_at).getTime() : 0;

    if (remoteTime > localTime) {
      // Remote is newer — merge remote into local
      const localData  = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const remoteData = remote.data;

      // Merge: take higher XP, higher streak, union completed chapters
      const merged = {
        ...localData,
        xp:       Math.max(localData.xp || 0, remoteData.xp || 0),
        streak:   Math.max(localData.streak || 0, remoteData.streak || 0),
        completed: { ...(localData.completed || {}), ...(remoteData.completed || {}) },
        cardIndex: mergeCardIndex(localData.cardIndex, remoteData.cardIndex),
        lastActive: remoteTime > localTime ? remoteData.lastActive : localData.lastActive
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return true; // progress was updated from remote
    }
    return false;
  } catch (e) {
    return false;
  }
}

function mergeCardIndex(local = {}, remote = {}) {
  const merged = { ...local };
  for (const [key, val] of Object.entries(remote)) {
    merged[key] = Math.max(merged[key] || 0, val || 0);
  }
  return merged;
}

// Show a subtle "synced" indicator
function showSyncBadge(text = '☁️ Synced') {
  let badge = document.getElementById('sync-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'sync-badge';
    badge.style.cssText = `
      position:fixed; bottom:72px; right:16px; z-index:9999;
      background:rgba(16,185,129,.9); color:#fff;
      font-size:11px; font-weight:700; padding:5px 10px;
      border-radius:20px; opacity:0; transition:opacity .3s;
      pointer-events:none;
    `;
    document.body.appendChild(badge);
  }
  badge.textContent = text;
  badge.style.opacity = '1';
  setTimeout(() => { badge.style.opacity = '0'; }, 2000);
}

// Init — pull on load, then push periodically
const Sync = {
  async init() {
    const updated = await pullProgress();
    if (updated) {
      showSyncBadge('☁️ Progress synced from other device');
      // Refresh home screen if app is loaded
      if (window.app && app.refreshHomeStats) {
        app.refreshHomeStats();
        app.renderTopicMap();
      }
    }
    // Push on load
    await pushProgress();
    // Push every 60s
    setInterval(pushProgress, SYNC_INTERVAL);
    // Push before tab closes
    window.addEventListener('beforeunload', pushProgress);
    // Push after each card advance (hook into app)
    document.addEventListener('devlearn:cardAdvanced', pushProgress);
    document.addEventListener('devlearn:chapterComplete', pushProgress);
  }
};

document.addEventListener('DOMContentLoaded', () => Sync.init());
