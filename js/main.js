/* ═══════════════════════════════════════════════
   main.js — Kamarob Nature Fund
   Main page scripts (index.html)
   ═══════════════════════════════════════════════ */

/* ── EmailJS init ──────────────────────────── */
(function () {
  if (typeof emailjs !== 'undefined') emailjs.init('YOUR_PUBLIC_KEY');
})();

/* ── Supabase (optional — loaded dynamically) ── */
const SUPABASE_URL = 'https://nehcldoqkdknwgluwqds.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OznsK_pqo_SIZSRz0D14Vg_vAPerc0R';
let supabase = null;

async function initSupabase() {
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') return; // Not configured yet
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

/* ── Security helpers ──────────────────────── */
function sanitize(str) {
  const m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return String(str).replace(/[&<>"']/g, c => m[c]);
}

function validateEmail(e) {
  return /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,}$/.test(e);
}

/* ── Rate limiting ─────────────────────────── */
const RL = { key: 'knf_sub', limit: 3, window: 3600000 };
function checkRate() {
  try {
    let d = JSON.parse(sessionStorage.getItem(RL.key) || '{"c":0,"t":0}');
    if (Date.now() - d.t > RL.window) { d = { c: 0, t: Date.now() }; }
    if (d.c >= RL.limit) return false;
    d.c++;
    sessionStorage.setItem(RL.key, JSON.stringify(d));
    return true;
  } catch { return true; }
}

/* ── Contact Form ──────────────────────────── */
document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const msg = document.getElementById('form-msg');
  const t = (k) => window.i18n ? window.i18n.t(k) : k;

  // Honeypot: if this hidden field is filled, it's a bot
  if (this.hp_username.value) { msg.textContent = t('contact.success'); return; }

  // Rate limit
  if (!checkRate()) { msg.className = 'error'; msg.textContent = t('contact.err_rate'); return; }

  const name  = this.from_name.value.trim();
  const email = this.from_email.value.trim();
  const body  = this.message.value.trim();

  if (!name || name.length < 2) { msg.className = 'error'; msg.textContent = t('contact.err_name'); return; }
  if (!validateEmail(email))    { msg.className = 'error'; msg.textContent = t('contact.err_email'); return; }
  if (!body || body.length < 10) { msg.className = 'error'; msg.textContent = t('contact.err_msg'); return; }

  // Validate email domain (from temp-emails.js)
  if (window.validateEmailDomain) {
    const check = window.validateEmailDomain(email);
    if (!check.valid) { msg.className = 'error'; msg.textContent = check.reason; return; }
  }

  const params = {
    from_name:  sanitize(name),
    from_email: sanitize(email),
    subject:    sanitize(this.subject.value || 'General'),
    message:    sanitize(body),
  };

  btn.disabled = true;
  btn.textContent = t('contact.btn_sending');
  msg.className = '';
  msg.textContent = '';

  try {
    // Save to Supabase if configured
    if (supabase) {
      await supabase.from('contact_submissions').insert({
        name:    params.from_name,
        email:   params.from_email,
        subject: params.subject,
        message: params.message
      });
    }
    // Send via EmailJS
    if (typeof emailjs !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params);
    }
    msg.textContent = t('contact.success');
    this.reset();
  } catch (err) {
    msg.className = 'error';
    msg.textContent = t('contact.error');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = t('contact.btn_send');
  }
});

/* ── Navigation: scroll + mobile hamburger ── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navbar.classList.toggle('menu-open');
  hamburger.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    navbar.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
  })
);

/* ── Scroll reveal (Intersection Observer) ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

/* ── Animated counters ─────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const sup    = el.querySelector('sup') ? el.querySelector('sup').outerHTML : '';
  let cur = 0;
  const step = Math.ceil(target / 100);
  const timer = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.innerHTML = cur.toLocaleString() + sup;
    if (cur >= target) clearInterval(timer);
  }, 18);
}

const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      cio.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => cio.observe(el));

/* ── Lightbox gallery ──────────────────────── */
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
const lightbox     = document.getElementById('lightbox');
const lbImg        = document.getElementById('lb-img');
let lbIdx = 0;
const lbSrcs = Array.from(galleryItems).map(gi => gi.dataset.src);
const lbAlts = Array.from(galleryItems).map(gi => gi.querySelector('img').alt);

function openLB(i) {
  lbIdx = i;
  lbImg.src = lbSrcs[i];
  lbImg.alt = lbAlts[i];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lbImg.focus();
}

function closeLB() {
  lightbox.classList.remove('active');
  lbImg.src = '';
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click',   () => openLB(i));
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLB(i); });
});

document.getElementById('lb-close').addEventListener('click', closeLB);
document.getElementById('lb-prev').addEventListener('click', () => {
  lbIdx = (lbIdx - 1 + lbSrcs.length) % lbSrcs.length;
  lbImg.src = lbSrcs[lbIdx];
  lbImg.alt = lbAlts[lbIdx];
});
document.getElementById('lb-next').addEventListener('click', () => {
  lbIdx = (lbIdx + 1) % lbSrcs.length;
  lbImg.src = lbSrcs[lbIdx];
  lbImg.alt = lbAlts[lbIdx];
});

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft')  { lbIdx = (lbIdx - 1 + lbSrcs.length) % lbSrcs.length; lbImg.src = lbSrcs[lbIdx]; lbImg.alt = lbAlts[lbIdx]; }
  if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbSrcs.length; lbImg.src = lbSrcs[lbIdx]; lbImg.alt = lbAlts[lbIdx]; }
});

/* ── Load Expeditions from Supabase ─────────── */
async function loadExpeditions() {
  const loading = document.getElementById('exp-loading');
  const t = (k) => window.i18n ? window.i18n.t(k) : k;

  if (!supabase) {
    // Demo data — shown when Supabase not connected yet
    const demo = [
      {
        title:       'Kamarob Ridge — First Ascent Survey',
        location:    'Shukmak → Kamarob Ridge',
        elevation_m: 3020,
        distance_km: 24,
        date:        '2024-08-15',
        description: 'Three-day research expedition documenting vegetation zones, spring sources, and wildlife signs along the main Kamarob ridge. Highest point reached: 3,020 m.'
      },
      {
        title:       'Kamarob Valley Winter Survey',
        location:    'Lower Kamarob Gorge',
        elevation_m: 1800,
        distance_km: 18,
        date:        '2025-01-20',
        description: 'First winter survey of the lower gorge. Documented snow leopard tracks, assessed stream ice conditions, and verified survival of 2024 autumn saplings.'
      },
    ];
    renderExpeditions(demo);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('expeditions')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      loading.textContent = t('expeditions.no_results');
      return;
    }
    renderExpeditions(data);
  } catch (err) {
    loading.textContent = 'Could not load expeditions.';
    console.error(err);
  }
}

function renderExpeditions(data) {
  const grid    = document.getElementById('expeditionsGrid');
  const loading = document.getElementById('exp-loading');
  const t = (k) => window.i18n ? window.i18n.t(k) : k;

  grid.innerHTML = data.map(exp => `
    <article class="exp-card reveal">
      <div class="exp-meta">
        ${exp.location    ? `<span class="exp-chip">📍 ${sanitize(exp.location)}</span>` : ''}
        ${exp.elevation_m ? `<span class="exp-chip">⛰️ ${exp.elevation_m.toLocaleString()} m</span>` : ''}
        ${exp.distance_km ? `<span class="exp-chip">🥾 ${exp.distance_km} km</span>` : ''}
        ${exp.date        ? `<span class="exp-chip">📅 ${new Date(exp.date).toLocaleDateString()}</span>` : ''}
      </div>
      <h3>${sanitize(exp.title)}</h3>
      <p>${sanitize(exp.description || '')}</p>
      ${exp.slug ? `<a href="expedition.html?slug=${encodeURIComponent(exp.slug)}" class="exp-link">${t('expeditions.read_more')}</a>` : ''}
    </article>
  `).join('');

  loading.style.display = 'none';
  grid.style.display    = 'grid';

  // Animate newly added cards
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ── Toast notification ────────────────────── */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Init on DOM ready ─────────────────────── */
window.addEventListener('DOMContentLoaded', async () => {
  await initSupabase();
  await loadExpeditions();
  if (window.i18n) i18n.apply(); // Re-apply translations after DOM ready
});
