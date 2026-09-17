/* ═══════════════════════════════════════════════
   admin.js — Kamarob Nature Fund
   Admin panel logic
   NOTE: ES Module — load with <script type="module" src="js/admin.js"></script>
   ═══════════════════════════════════════════════ */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

/* ── Config ────────────────────────────────── */
const SUPABASE_URL = 'https://nehcldoqkdknwgluwqds.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OznsK_pqo_SIZSRz0D14Vg_vAPerc0R';

/* ── Sanitize helper (XSS prevention) ──────── */
function esc(str) {
  const m = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return String(str || '').replace(/[&<>"']/g, c => m[c]);
}

let supabase     = null;
let currentUser  = null;

/* ═══════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════ */
async function init() {
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
    // Demo mode — show UI with placeholder data
    showDemoMode();
    return;
  }

  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) { showAccessDenied(); return; }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') { showAccessDenied(); return; }

  currentUser = { ...session.user, ...profile };
  showAdminUI();
  loadAll();
}

function showAccessDenied() {
  document.getElementById('accessDenied').style.display = 'flex';
  document.getElementById('adminUI').style.display      = 'none';
}

function showDemoMode() {
  document.getElementById('adminUI').style.display      = 'flex';
  document.getElementById('accessDenied').style.display = 'none';
  document.getElementById('userName').textContent    = 'Mahmud (Demo)';
  document.getElementById('userInitial').textContent = 'M';
  loadDemoData();
}

function showAdminUI() {
  document.getElementById('adminUI').style.display      = 'flex';
  document.getElementById('accessDenied').style.display = 'none';
  const name = currentUser.full_name || currentUser.email;
  document.getElementById('userName').textContent    = name;
  document.getElementById('userInitial').textContent = (name[0] || 'A').toUpperCase();
}

/* ═══════════════════════════════════════════════
   PANEL SWITCHING
   ═══════════════════════════════════════════════ */
const panelTitles = {
  dashboard:   'Dashboard',
  projects:    'Projects',
  expeditions: 'Expeditions',
  contacts:    'Messages',
  users:       'Users'
};

window.showPanel = function (name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');

  // Highlight active nav item by matching button text
  document.querySelectorAll('.nav-item').forEach(b => {
    if (b.textContent.trim().toLowerCase().includes(name.split('-')[0].toLowerCase())) {
      b.classList.add('active');
    }
  });

  document.getElementById('topbarTitle').textContent = panelTitles[name] || name;

  const action = document.getElementById('primaryAction');
  if (name === 'projects') {
    action.style.display = '';
    action.textContent   = '+ New Project';
    action.onclick       = () => openModal('project');
  } else if (name === 'expeditions') {
    action.style.display = '';
    action.textContent   = '+ New Expedition';
    action.onclick       = () => openModal('expedition');
  } else {
    action.style.display = 'none';
  }
};

/* ═══════════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════════ */
window.openModal = function (type, data = {}) {
  if (type === 'project') {
    document.getElementById('modal-project-title').textContent = data.id ? 'Edit Project' : 'New Project';
    document.getElementById('pf-id').value        = data.id || '';
    document.getElementById('pf-title').value     = data.title || '';
    document.getElementById('pf-slug').value      = data.slug || '';
    document.getElementById('pf-cat').value       = data.category || 'general';
    document.getElementById('pf-desc').value      = data.description || '';
    document.getElementById('pf-content').value   = data.content || '';
    document.getElementById('pf-img').value       = data.cover_image || '';
    document.getElementById('pf-tags').value      = (data.tags || []).join(', ');
    document.getElementById('pf-published').checked = data.published || false;
    document.getElementById('projectModal').classList.add('open');
  } else {
    document.getElementById('modal-exp-title').textContent = data.id ? 'Edit Expedition' : 'New Expedition';
    document.getElementById('ef-id').value         = data.id || '';
    document.getElementById('ef-title').value      = data.title || '';
    document.getElementById('ef-slug').value       = data.slug || '';
    document.getElementById('ef-location').value   = data.location || '';
    document.getElementById('ef-elevation').value  = data.elevation_m || '';
    document.getElementById('ef-distance').value   = data.distance_km || '';
    document.getElementById('ef-duration').value   = data.duration_days || '';
    document.getElementById('ef-date').value       = data.date || '';
    document.getElementById('ef-desc').value       = data.description || '';
    document.getElementById('ef-content').value    = data.content || '';
    document.getElementById('ef-published').checked = data.published || false;
    document.getElementById('expeditionModal').classList.add('open');
  }
};

window.closeModal = function (id) {
  document.getElementById(id).classList.remove('open');
};

// Close on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

/* ── Auto-generate slug from title ─────────── */
document.getElementById('pf-title').addEventListener('input', function () {
  if (!document.getElementById('pf-id').value) {
    document.getElementById('pf-slug').value = this.value.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 100);
  }
});
document.getElementById('ef-title').addEventListener('input', function () {
  if (!document.getElementById('ef-id').value) {
    document.getElementById('ef-slug').value = this.value.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 100);
  }
});

/* ═══════════════════════════════════════════════
   SAVE PROJECT
   ═══════════════════════════════════════════════ */
document.getElementById('projectForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('pf-id').value;
  const payload = {
    title:       document.getElementById('pf-title').value.trim(),
    slug:        document.getElementById('pf-slug').value.trim(),
    category:    document.getElementById('pf-cat').value,
    description: document.getElementById('pf-desc').value.trim(),
    content:     document.getElementById('pf-content').value.trim(),
    cover_image: document.getElementById('pf-img').value.trim() || null,
    tags:        document.getElementById('pf-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    published:   document.getElementById('pf-published').checked,
  };

  try {
    if (!supabase) { toast('Demo mode — data not saved to DB'); closeModal('projectModal'); return; }
    if (id) {
      const { error } = await supabase.from('projects').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('projects').insert({ ...payload, author_id: currentUser.id });
      if (error) throw error;
    }
    toast('✅ Project saved');
    closeModal('projectModal');
    loadProjects();
  } catch (err) { toast('❌ ' + err.message, true); }
});

/* ═══════════════════════════════════════════════
   SAVE EXPEDITION
   ═══════════════════════════════════════════════ */
document.getElementById('expeditionForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('ef-id').value;
  const payload = {
    title:         document.getElementById('ef-title').value.trim(),
    slug:          document.getElementById('ef-slug').value.trim(),
    location:      document.getElementById('ef-location').value.trim() || null,
    elevation_m:   parseInt(document.getElementById('ef-elevation').value) || null,
    distance_km:   parseFloat(document.getElementById('ef-distance').value) || null,
    duration_days: parseInt(document.getElementById('ef-duration').value) || null,
    date:          document.getElementById('ef-date').value || null,
    description:   document.getElementById('ef-desc').value.trim(),
    content:       document.getElementById('ef-content').value.trim(),
    published:     document.getElementById('ef-published').checked,
  };

  try {
    if (!supabase) { toast('Demo mode'); closeModal('expeditionModal'); return; }
    if (id) {
      const { error } = await supabase.from('expeditions').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('expeditions').insert({ ...payload, author_id: currentUser.id });
      if (error) throw error;
    }
    toast('✅ Expedition saved');
    closeModal('expeditionModal');
    loadExpeditions();
  } catch (err) { toast('❌ ' + err.message, true); }
});

/* ═══════════════════════════════════════════════
   DELETE
   ═══════════════════════════════════════════════ */
window.deleteRecord = async function (table, id) {
  if (!confirm('Are you sure? This cannot be undone.')) return;
  if (!supabase) { toast('Demo mode — nothing deleted'); return; }
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) { toast('❌ ' + error.message, true); return; }
  toast('🗑️ Deleted');
  if (table === 'projects')             loadProjects();
  if (table === 'expeditions')          loadExpeditions();
  if (table === 'contact_submissions')  loadContacts();
};

window.markContactStatus = async function (id, status) {
  if (!supabase) { toast('Demo mode'); return; }
  const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
  if (error) { toast('❌ ' + error.message, true); return; }
  toast('✅ Status updated');
  loadContacts();
};

/* ═══════════════════════════════════════════════
   LOAD DATA
   ═══════════════════════════════════════════════ */
async function loadAll() {
  await Promise.all([loadDashboard(), loadProjects(), loadExpeditions(), loadContacts(), loadUsers()]);
}

async function loadDashboard() {
  if (!supabase) return;
  const [proj, exped, contacts, users] = await Promise.all([
    supabase.from('projects').select('id', { count: 'exact' }),
    supabase.from('expeditions').select('id', { count: 'exact' }),
    supabase.from('contact_submissions').select('id,name,email,subject,status,created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('user_profiles').select('id', { count: 'exact' }),
  ]);

  document.getElementById('stat-projects').textContent    = proj.count    ?? '—';
  document.getElementById('stat-expeditions').textContent = exped.count   ?? '—';
  document.getElementById('stat-users').textContent       = users.count   ?? '—';

  const newMsgs = contacts.data?.filter(c => c.status === 'new').length || 0;
  document.getElementById('stat-messages').textContent       = newMsgs;
  document.getElementById('stat-messages-trend').textContent = `${newMsgs} unread`;
  document.getElementById('stat-messages-trend').className   = 'stat-trend ' + (newMsgs > 0 ? 'trend-up' : '');

  const tbody = document.getElementById('recent-contacts-body');
  if (!contacts.data?.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty"><div class="empty-icon">📭</div>No messages yet.</td></tr>';
    return;
  }
  tbody.innerHTML = contacts.data.map(c => `
    <tr>
      <td>${esc(c.name)}</td>
      <td>${esc(c.subject || '—')}</td>
      <td><span class="badge badge-${c.status}">${c.status}</span></td>
      <td>${new Date(c.created_at).toLocaleDateString()}</td>
    </tr>`).join('');
}

async function loadProjects() {
  const tbody = document.getElementById('projects-body');
  if (!supabase) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty"><div class="empty-icon">⚙️</div>Connect Supabase to see live data.</td></tr>';
    return;
  }
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error || !data?.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty"><div class="empty-icon">📂</div>No projects yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(p => `
    <tr data-search="${esc(p.title)} ${esc(p.category)}">
      <td>${esc(p.title)}</td>
      <td>${esc(p.category)}</td>
      <td><span class="badge ${p.published ? 'badge-pub' : 'badge-draft'}">${p.published ? 'Published' : 'Draft'}</span></td>
      <td>${new Date(p.created_at).toLocaleDateString()}</td>
      <td><div class="td-actions">
        <button class="btn btn-outline btn-sm" onclick='openModal("project",${JSON.stringify(p)})'>Edit</button>
        <button class="btn btn-danger btn-sm"  onclick="deleteRecord('projects','${p.id}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

async function loadExpeditions() {
  const tbody = document.getElementById('expeditions-body');
  if (!supabase) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty"><div class="empty-icon">⚙️</div>Connect Supabase to see live data.</td></tr>';
    return;
  }
  const { data, error } = await supabase.from('expeditions').select('*').order('date', { ascending: false });
  if (error || !data?.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty"><div class="empty-icon">🏔️</div>No expeditions yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(e => `
    <tr data-search="${esc(e.title)} ${esc(e.location || '')}">
      <td>${esc(e.title)}</td>
      <td>${esc(e.location || '—')}</td>
      <td>${e.elevation_m ? e.elevation_m.toLocaleString() + ' m' : '—'}</td>
      <td>${e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
      <td><span class="badge ${e.published ? 'badge-pub' : 'badge-draft'}">${e.published ? 'Published' : 'Draft'}</span></td>
      <td><div class="td-actions">
        <button class="btn btn-outline btn-sm" onclick='openModal("expedition",${JSON.stringify(e)})'>Edit</button>
        <button class="btn btn-danger btn-sm"  onclick="deleteRecord('expeditions','${e.id}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

async function loadContacts() {
  const tbody = document.getElementById('contacts-body');
  if (!supabase) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty"><div class="empty-icon">⚙️</div>Connect Supabase to see messages.</td></tr>';
    return;
  }
  const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
  if (error || !data?.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty"><div class="empty-icon">📭</div>No messages yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(c => `
    <tr data-search="${esc(c.name)} ${esc(c.email)} ${esc(c.subject || '')}">
      <td>${esc(c.name)}</td>
      <td><a href="mailto:${esc(c.email)}" style="color:var(--accent);">${esc(c.email)}</a></td>
      <td>${esc(c.subject || '—')}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${esc(c.message.slice(0, 80))}…</td>
      <td><span class="badge badge-${c.status}">${c.status}</span></td>
      <td>${new Date(c.created_at).toLocaleDateString()}</td>
      <td><div class="td-actions">
        ${c.status === 'new' ? `<button class="btn btn-outline btn-sm" onclick="markContactStatus('${c.id}','read')">Mark Read</button>` : ''}
        <button class="btn btn-danger btn-sm" onclick="deleteRecord('contact_submissions','${c.id}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

async function loadUsers() {
  const tbody = document.getElementById('users-body');
  if (!supabase) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty"><div class="empty-icon">⚙️</div>Connect Supabase to see users.</td></tr>';
    return;
  }
  const { data, error } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
  if (error || !data?.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty"><div class="empty-icon">👥</div>No users yet.</td></tr>';
    return;
  }
  tbody.innerHTML = data.map(u => `
    <tr data-search="${esc(u.full_name || '')}">
      <td>${esc(u.full_name || '—')}</td>
      <td>—</td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-pub' : 'badge-draft'}">${u.role}</span></td>
      <td>${new Date(u.created_at).toLocaleDateString()}</td>
      <td>
        ${u.role !== 'admin'
          ? `<button class="btn btn-outline btn-sm" onclick="promoteUser('${u.id}')">Make Admin</button>`
          : '<span style="color:var(--muted);font-size:.78rem;">Admin</span>'
        }
      </td>
    </tr>`).join('');
}

window.promoteUser = async function (id) {
  if (!confirm('Give this user admin access?')) return;
  if (!supabase) { toast('Demo mode'); return; }
  const { error } = await supabase.from('user_profiles').update({ role: 'admin' }).eq('id', id);
  if (error) { toast('❌ ' + error.message, true); return; }
  toast('✅ User promoted to admin');
  loadUsers();
};

/* ═══════════════════════════════════════════════
   DEMO DATA (no Supabase)
   ═══════════════════════════════════════════════ */
function loadDemoData() {
  document.getElementById('stat-projects').textContent        = '2';
  document.getElementById('stat-expeditions').textContent     = '2';
  document.getElementById('stat-messages').textContent        = '3';
  document.getElementById('stat-users').textContent           = '1';
  document.getElementById('stat-messages-trend').textContent  = '3 unread';
  document.getElementById('stat-messages-trend').className    = 'stat-trend trend-up';
  document.getElementById('recent-contacts-body').innerHTML   = `
    <tr>
      <td>Demo User</td>
      <td>Volunteering</td>
      <td><span class="badge badge-new">new</span></td>
      <td>Today</td>
    </tr>`;
}

/* ═══════════════════════════════════════════════
   TABLE SEARCH FILTER
   ═══════════════════════════════════════════════ */
window.filterTable = function (tbodyId, query) {
  const q = query.toLowerCase();
  document.querySelectorAll(`#${tbodyId} tr[data-search]`).forEach(row => {
    row.style.display = row.dataset.search.toLowerCase().includes(q) ? '' : 'none';
  });
};

/* ═══════════════════════════════════════════════
   LOGOUT
   ═══════════════════════════════════════════════ */
window.logout = async function () {
  if (supabase) await supabase.auth.signOut();
  window.location.href = 'auth.html';
};

/* ═══════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════ */
function toast(msg, isError = false) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = 'show' + (isError ? ' error' : '');
  setTimeout(() => el.className = '', 3500);
}

/* ── Close modals on Escape ─────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }
});

/* ── Start ──────────────────────────────────── */
init();
