// DevLearn v2 — Auth (GitHub OAuth via Supabase)


// ── Supabase auth helpers (no SDK — raw fetch) ──────────────
const Auth = {
  session: null,

  fireReady() {
    document.dispatchEvent(new Event('devlearn:authReady'));
  },

  async init() {
    // Check for OAuth callback (hash contains access_token)
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.slice(1));
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (accessToken) {
        this.session = { access_token: accessToken, refresh_token: refreshToken };
        localStorage.setItem('devlearn_session', JSON.stringify(this.session));
        // Clean URL
        history.replaceState(null, '', window.location.pathname);
        await this.onLogin();
        this.fireReady();
        return;
      }
    }

    // Restore saved session
    const saved = localStorage.getItem('devlearn_session');
    if (saved) {
      try {
        this.session = JSON.parse(saved);
        const user = await this.getUser();
        if (user) { await this.onLogin(); return; }
        else { this.session = null; localStorage.removeItem('devlearn_session'); }
      } catch { this.session = null; }
    }

    this.renderAuthButton(null);
    this.fireReady();
  },

  async getUser() {
    if (!this.session?.access_token) return null;
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${this.session.access_token}`
        }
      });
      if (!res.ok) return null;
      return await res.json();
    } catch { return null; }
  },

  loginWithGitHub() {
    const redirectTo = encodeURIComponent(window.location.href.split('#')[0]);
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=github&redirect_to=${redirectTo}`;
  },

  async logout() {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${this.session?.access_token}` }
      });
    } catch {}
    this.session = null;
    localStorage.removeItem('devlearn_session');
    this.renderAuthButton(null);
    // Show logged out state
    const el = document.getElementById('auth-name');
    if (el) el.textContent = '';
  },

  async onLogin() {
    const user = await this.getUser();
    if (!user) return;
    this.renderAuthButton(user);
    // Push local progress under user ID, then pull latest from account
    if (window.Sync) await Sync.onLogin();
  },

  async migrateProgress(userId) {
    const localData = localStorage.getItem('devlearn_v2');
    if (!localData) return;
    try {
      // Upsert progress under user ID
      await fetch(`${SUPABASE_URL}/rest/v1/progress`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${this.session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal'
        },
        body: JSON.stringify({
          device_id: 'user_' + userId,
          data: JSON.parse(localData),
          updated_at: new Date().toISOString()
        })
      });
    } catch {}
  },

  renderAuthButton(user) {
    // Find or create auth slot in home header
    let slot = document.getElementById('auth-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'auth-slot';
      slot.style.cssText = 'display:flex;align-items:center;gap:8px;';
      const header = document.querySelector('.home-header');
      if (header) header.appendChild(slot);
    }

    if (user) {
      const name = user.user_metadata?.user_name || user.email?.split('@')[0] || 'You';
      const avatar = user.user_metadata?.avatar_url;
      slot.innerHTML = `
        <img src="${avatar||''}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;${avatar?'':'display:none'}">
        <span id="auth-name" style="font-size:12px;font-weight:600;color:var(--text-dim);">${name}</span>
        <button onclick="Auth.logout()" style="background:none;border:1px solid var(--border);color:var(--text-dim);font-size:11px;padding:4px 10px;border-radius:20px;cursor:pointer;">Sign out</button>
      `;
    } else {
      slot.innerHTML = `
        <button onclick="Auth.loginWithGitHub()" style="
          display:flex;align-items:center;gap:6px;
          background:var(--surface2);border:1px solid var(--border);
          color:var(--text);font-size:13px;font-weight:600;
          padding:7px 14px;border-radius:20px;cursor:pointer;
          transition:border-color .15s;
        " onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='var(--border)'">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          Sign in with GitHub
        </button>
      `;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Auth.init());
