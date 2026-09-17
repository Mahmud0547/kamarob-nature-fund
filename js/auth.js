/* ═══════════════════════════════════════════════
   auth.js — Kamarob Nature Fund
   Login / Registration page logic
   NOTE: This file uses ES Modules (import/export)
   Include with: <script type="module" src="js/auth.js"></script>
   ═══════════════════════════════════════════════ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/* ── Config ────────────────────────────────── */
const SUPABASE_URL = 'https://nehcldoqkdknwgluwqds.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OznsK_pqo_SIZSRz0D14Vg_vAPerc0R';

let supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  checkSession();
}

/* ── Check existing session ────────────────── */
async function checkSession() {
  if (!supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    window.location.href = profile?.role === 'admin' ? 'admin.html' : 'index.html';
  }
}

/* ── Tab switching — defined in auth.html inline script ── */
// showPanel is available globally via the inline <script> in auth.html

/* ── Password strength meter ───────────────── */
document.getElementById('r-password').addEventListener('input', function () {
  const val  = this.value;
  const bars = [
    document.getElementById('pb1'),
    document.getElementById('pb2'),
    document.getElementById('pb3')
  ];
  bars.forEach(b => b.className = 'pw-bar');
  const label = document.getElementById('pw-label');

  if (val.length === 0) { label.textContent = ''; return; }

  let score = 0;
  if (val.length >= 8)  score++;
  if (val.length >= 12) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const strength = score <= 1 ? 'weak' : score <= 2 ? 'fair' : 'strong';
  const labels   = { weak: 'Weak', fair: 'Fair', strong: 'Strong' };
  const counts   = { weak: 1, fair: 2, strong: 3 };

  for (let i = 0; i < counts[strength]; i++) bars[i].classList.add(strength);
  label.textContent = labels[strength];
  label.style.color = strength === 'weak'   ? '#e05a5a'
                    : strength === 'fair'   ? '#c9a227'
                    : 'var(--accent)';
});

/* ── Email domain validation on blur ─────────*/
document.getElementById('r-email').addEventListener('blur', function () {
  const warn = document.getElementById('domain-warn');
  if (!this.value) { warn.classList.remove('show'); return; }
  const result = window.validateEmailDomain ? window.validateEmailDomain(this.value) : { valid: true };
  warn.classList.toggle('show', !result.valid);
});

/* ── LOGIN ─────────────────────────────────── */
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const msg = document.getElementById('auth-msg');
  const btn = document.getElementById('loginBtn');
  msg.textContent = '';
  msg.className   = '';

  const email    = this.email.value.trim();
  const password = this.password.value;

  if (!email || !password) {
    msg.className = 'error';
    msg.textContent = 'Please fill all fields.';
    return;
  }

  if (!supabase) {
    // Demo mode
    msg.textContent = '⚠️ Supabase not configured yet. Add your keys to js/auth.js.';
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Signing in…';

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    window.location.href = profile?.role === 'admin' ? 'admin.html' : 'index.html';
  } catch (err) {
    msg.className   = 'error';
    msg.textContent = err.message === 'Invalid login credentials'
      ? '❌ Incorrect email or password.'
      : `❌ ${err.message}`;
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Sign In';
  }
});

/* ── REGISTER ──────────────────────────────── */
document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const msg = document.getElementById('auth-msg');
  const btn = document.getElementById('registerBtn');
  msg.textContent = '';
  msg.className   = '';

  const name     = this.full_name.value.trim();
  const email    = this.email.value.trim();
  const password = this.password.value;
  const confirm  = this.confirm.value;

  // Validation
  if (!name || name.length < 2) {
    msg.className = 'error'; msg.textContent = 'Please enter your full name.'; return;
  }
  if (!email) {
    msg.className = 'error'; msg.textContent = 'Please enter your email.'; return;
  }

  // Block disposable emails
  const emailCheck = window.validateEmailDomain ? window.validateEmailDomain(email) : { valid: true };
  if (!emailCheck.valid) {
    msg.className   = 'error';
    msg.textContent = '❌ Temporary email addresses are not allowed. Please use Gmail, Outlook, iCloud, Yahoo, etc.';
    return;
  }

  if (password.length < 8) {
    msg.className = 'error'; msg.textContent = 'Password must be at least 8 characters.'; return;
  }
  if (password !== confirm) {
    msg.className = 'error'; msg.textContent = 'Passwords do not match.'; return;
  }

  if (!supabase) {
    msg.textContent = '⚠️ Supabase not configured yet. Add your keys to js/auth.js.';
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Creating account…';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin + '/auth.html'
      }
    });
    if (error) throw error;

    // Show verification panel
    document.getElementById('verifyEmail').textContent = email;
    showPanel('verify');
  } catch (err) {
    msg.className   = 'error';
    msg.textContent = err.message.includes('already registered')
      ? '❌ This email is already registered. Try signing in.'
      : `❌ ${err.message}`;
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Create Account';
  }
});
