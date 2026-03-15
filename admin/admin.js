const API_URL = 'http://localhost:5000/api';

// ---- AUTH ----
function getToken() { return localStorage.getItem('admin_token'); }
function setToken(t) { localStorage.setItem('admin_token', t); }
function clearToken() { localStorage.removeItem('admin_token'); }
function authHeaders() { return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }; }

function logout() {
    clearToken();
    window.location.href = 'login.html';
}

// ---- LOGIN PAGE ----
const loginForm = document.getElementById('login-form');
if (loginForm) {
    // If already logged in, redirect
    if (getToken()) window.location.href = 'dashboard.html';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = document.getElementById('login-error');
        errEl.classList.add('hidden');

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-btn');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
                setToken(data.token);
                window.location.href = 'dashboard.html';
            } else {
                errEl.textContent = data.error || 'Invalid credentials';
                errEl.classList.remove('hidden');
            }
        } catch (err) {
            errEl.textContent = 'Server unreachable. Is the backend running?';
            errEl.classList.remove('hidden');
        } finally {
            btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
            btn.disabled = false;
        }
    });
}

// ---- DASHBOARD PAGE ----
if (document.getElementById('stats-grid')) {
    if (!getToken()) { window.location.href = 'login.html'; }
    else { loadDashboard(); }
}

async function loadDashboard() {
    loadStats();
    loadEvents();
    loadResources();
    loadMembers();
    loadMessages();
    loadRegistrations();
}

async function apiFetch(endpoint) {
    const res = await fetch(`${API_URL}/admin/${endpoint}`, { headers: authHeaders() });
    if (res.status === 401) { logout(); return null; }
    return res.json();
}

// ---- STATS ----
async function loadStats() {
    const data = await apiFetch('stats');
    if (!data || !data.success) return;
    document.getElementById('stat-events').textContent = data.data.events;
    document.getElementById('stat-resources').textContent = data.data.resources;
    document.getElementById('stat-members').textContent = data.data.members;
    document.getElementById('stat-messages').textContent = data.data.messages;
    document.getElementById('stat-registrations').textContent = data.data.registrations;
}

// ---- TAB SWITCHING ----
function switchTab(name) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tab-${name}`).classList.remove('hidden');
    document.querySelectorAll('.admin-tab').forEach(b => b.classList.remove('active'));
    event.target.closest('button').classList.add('active');
}

// ---- EVENTS ----
function toggleAddEvent() {
    document.getElementById('add-event-form').classList.toggle('hidden');
}

async function loadEvents() {
    const data = await apiFetch('../events');
    const list = document.getElementById('events-list');
    if (!data || !data.success) return;
    list.innerHTML = data.data.length === 0 ? '<p class="text-gray-500 text-sm">No events yet.</p>' : '';
    data.data.forEach(ev => {
        const date = new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        list.innerHTML += `
        <div class="bg-[#111827] border border-white/5 rounded-xl p-4 flex justify-between items-center">
            <div>
                <span class="text-white font-bold">${ev.title}</span>
                <span class="text-gray-500 text-xs ml-3">${date}</span>
                <p class="text-gray-500 text-xs mt-1">${ev.description || ''}</p>
            </div>
            <button onclick="deleteEvent('${ev._id}')" class="text-red-400 hover:text-red-300 text-sm font-bold">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;
    });
}

async function addEvent() {
    const btn = event.target;
    // Basic validation
    const eventId = document.getElementById('evt-id').value.trim();
    const title = document.getElementById('evt-title').value.trim();
    const date = document.getElementById('evt-date').value;
    const description = document.getElementById('evt-desc').value.trim();

    if (!eventId || !title || !date || !description) {
        alert('Please fill out all fields.');
        return;
    }

    const body = { eventId, title, date, description };
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/admin/events`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        
        if (data.success) {
            document.getElementById('evt-id').value = '';
            document.getElementById('evt-title').value = '';
            document.getElementById('evt-date').value = '';
            document.getElementById('evt-desc').value = '';
            document.getElementById('add-event-form').classList.add('hidden');
            loadEvents(); loadStats();
        } else {
            alert('Error adding event: ' + (data.error || 'Server error'));
        }
    } catch (err) {
        alert('Failed to reach the server.');
    } finally {
        btn.textContent = 'Save Event';
        btn.disabled = false;
    }
}

async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return;
    await fetch(`${API_URL}/admin/events/${id}`, { method: 'DELETE', headers: authHeaders() });
    loadEvents(); loadStats();
}

// ---- RESOURCES ----
function toggleAddResource() {
    document.getElementById('add-resource-form').classList.toggle('hidden');
}

async function loadResources() {
    const data = await apiFetch('../resources');
    const list = document.getElementById('resources-list');
    if (!data || !data.success) return;
    list.innerHTML = data.data.length === 0 ? '<p class="text-gray-500 text-sm">No resources yet.</p>' : '';
    data.data.forEach(r => {
        list.innerHTML += `
        <div class="bg-[#111827] border border-white/5 rounded-xl p-4 flex justify-between items-center">
            <div>
                <span class="text-white font-bold">${r.title}</span>
                <span class="text-gfg text-xs ml-2">${r.category}</span>
                <span class="text-gray-500 text-xs ml-2">${r.level}</span>
            </div>
            <button onclick="deleteResource('${r._id}')" class="text-red-400 hover:text-red-300 text-sm font-bold">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>`;
    });
}

async function addResource() {
    const btn = event.target;
    const title = document.getElementById('res-title').value.trim();
    const category = document.getElementById('res-category').value;
    const link = document.getElementById('res-link').value.trim();
    const level = document.getElementById('res-level').value;
    const description = document.getElementById('res-desc').value.trim();

    if (!title || !link || !description) {
        alert('Please fill out all fields.');
        return;
    }

    const body = { title, category, link, level, description };
    btn.textContent = 'Saving...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/admin/resources`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        
        if (data.success) {
            document.getElementById('res-title').value = '';
            document.getElementById('res-link').value = '';
            document.getElementById('res-desc').value = '';
            document.getElementById('add-resource-form').classList.add('hidden');
            loadResources(); loadStats();
        } else {
            alert('Error adding resource: ' + (data.error || 'Server error'));
        }
    } catch (err) {
        alert('Failed to reach the server.');
    } finally {
        btn.textContent = 'Save Resource';
        btn.disabled = false;
    }
}

async function deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    await fetch(`${API_URL}/admin/resources/${id}`, { method: 'DELETE', headers: authHeaders() });
    loadResources(); loadStats();
}

// ---- MEMBERS ----
async function loadMembers() {
    const data = await apiFetch('members');
    const list = document.getElementById('members-list');
    if (!data || !data.success) return;
    list.innerHTML = data.data.length === 0 ? '<tr><td colspan="5" class="text-gray-500 text-sm p-4 text-center">No members yet.</td></tr>' : '';
    data.data.forEach(m => {
        const joined = new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        list.innerHTML += `<tr class="border-b border-white/5 hover:bg-white/[0.02]">
            <td class="p-3 text-white">${m.name}</td>
            <td class="p-3 text-gray-400">${m.email}</td>
            <td class="p-3 text-gray-400">${m.branch}</td>
            <td class="p-3 text-gray-400">${m.year}</td>
            <td class="p-3 text-gray-500 text-xs">${joined}</td>
        </tr>`;
    });
}

// ---- MESSAGES ----
async function loadMessages() {
    const data = await apiFetch('messages');
    const list = document.getElementById('messages-list');
    if (!data || !data.success) return;
    list.innerHTML = data.data.length === 0 ? '<p class="text-gray-500 text-sm">No messages yet.</p>' : '';
    data.data.forEach(msg => {
        const date = new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        list.innerHTML += `
        <div class="bg-[#111827] border border-white/5 rounded-xl p-4">
            <div class="flex justify-between items-start mb-2">
                <span class="text-white font-bold">${msg.firstName || ''} ${msg.lastName || ''}</span>
                <span class="text-gray-600 text-xs">${date}</span>
            </div>
            <p class="text-gray-400 text-xs mb-1">${msg.email || ''}</p>
            <p class="text-gray-300 text-sm">${msg.message || ''}</p>
        </div>`;
    });
}

// ---- REGISTRATIONS ----
async function loadRegistrations() {
    const data = await apiFetch('registrations');
    const list = document.getElementById('registrations-list');
    if (!data || !data.success) return;
    list.innerHTML = data.data.length === 0 ? '<tr><td colspan="4" class="text-gray-500 text-sm p-4 text-center">No registrations yet.</td></tr>' : '';
    data.data.forEach(r => {
        const date = new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        list.innerHTML += `<tr class="border-b border-white/5 hover:bg-white/[0.02]">
            <td class="p-3 text-white">${r.studentName}</td>
            <td class="p-3 text-gray-400">${r.email}</td>
            <td class="p-3 text-gray-400">${r.department}</td>
            <td class="p-3 text-gray-500 text-xs">${date}</td>
        </tr>`;
    });
}
