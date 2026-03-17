// Base API URL
// In development, use http://localhost:5000/api
// In production, when served by the same backend, use /api
const API_URL = window.location.origin === 'http://127.0.0.1:5500' || window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';

// Mobile menu toggling logic
document.addEventListener('DOMContentLoaded', () => {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if(mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu on click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Initialize specific page logic based on current path
    const path = window.location.pathname;
    
    // Landing Page Detection
    const isLandingPage = path === '/' || path.endsWith('index.html') || path.endsWith('Geeksforgeeks/') || path === '';
    
    if(path.includes('events.html')) {
        fetchEvents();
        setupRegistrationForm();
    } else if (path.includes('leaderboard.html')) {
        fetchLeaderboard();
    } else if (path.includes('roadmap.html')) {
        setupRoadmapForm();
    } else if (path.includes('resources.html')) {
        fetchResources();
    } else if (path.includes('contact.html')) {
        setupContactForm();
    } else if (path.includes('challenges.html')) {
        fetchChallenges();
        initMemberAuth();
    } else if (path.includes('coding.html')) {
        initCodingPage();
        initMemberAuth();
    }
    
    if (isLandingPage) {
        console.log('Detected Landing Page - Fetching Previews');
        fetchEventsPreview();
        fetchLeaderboardPreview();
    }

    // Setup Join Community buttons on ALL pages
    setupJoinCommunity();

    // Setup Global Auth Modal
    injectAuthModal();

    // Setup Floating Action Buttons (Admin & AI Mentor)
    setupFloatingButtons();
});

// ---------------------------------------------
// JOIN COMMUNITY MODAL & API
// ---------------------------------------------
function setupJoinCommunity() {
    // Inject modal HTML into the page (once)
    const modalHtml = `
    <div id="join-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="glass-card w-full max-w-md mx-4 p-8 rounded-2xl border-t-4 border-t-gfg-light shadow-[0_0_40px_rgba(74,222,128,0.15)] relative animate-[fadeInUp_0.3s_ease]">
            <button onclick="closeJoinModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition-colors"><i class="fa-solid fa-xmark"></i></button>
            <h3 class="text-2xl font-bold text-white mb-2 flex items-center gap-3"><i class="fa-solid fa-user-plus text-gfg-light"></i> Join the Community</h3>
            <p class="text-gray-400 text-sm mb-6">Become a part of the GeeksforGeeks RIT Campus Club family!</p>
            <form id="join-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input type="text" id="join-name" required class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg placeholder-gray-600" placeholder="Your full name">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1">College Email</label>
                    <input type="email" id="join-email" required pattern=".+@(.*\.)?ritchennai\.edu\.in$" class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg placeholder-gray-600" placeholder="you@ritchennai.edu.in">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Branch</label>
                        <input type="text" id="join-branch" required class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg placeholder-gray-600" placeholder="e.g. CSE">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Year</label>
                        <select id="join-year" required class="w-full bg-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg appearance-none">
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                        </select>
                    </div>
                </div>
                <button type="submit" id="join-submit-btn" class="w-full bg-gradient-to-r from-gfg to-gfg-light hover:from-gfg-dark hover:to-gfg text-black font-extrabold py-3 rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all mt-2 flex justify-center items-center gap-2">
                    <i class="fa-solid fa-rocket"></i> Join Now
                </button>
            </form>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Add animation keyframe
    const style = document.createElement('style');
    style.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
    document.head.appendChild(style);

    // Bind all "Join Community" buttons on the page
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.trim().includes('Join Community') || btn.textContent.trim() === 'Join') {
            btn.addEventListener('click', openJoinModal);
        }
    });

    // Handle form submission
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('join-name').value,
                email: document.getElementById('join-email').value,
                branch: document.getElementById('join-branch').value,
                year: document.getElementById('join-year').value
            };

            // Validate email domain
            if (!payload.email.endsWith('ritchennai.edu.in')) {
                showToast('Please use your @ritchennai.edu.in college email', true);
                return;
            }

            const btn = document.getElementById('join-submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Joining...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/community/join`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();

                if (data.success) {
                    showToast('🎉 Welcome to the community!');
                    joinForm.reset();
                    // Replace form with success + WhatsApp link
                    const modalContent = joinForm.closest('.glass-card');
                    modalContent.innerHTML = `
                        <button onclick="closeJoinModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white text-xl transition-colors"><i class="fa-solid fa-xmark"></i></button>
                        <div class="text-center py-4">
                            <div class="w-20 h-20 mx-auto bg-gfg/20 rounded-full flex items-center justify-center mb-6">
                                <i class="fa-solid fa-check text-gfg-light text-4xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-white mb-2">You're In! 🎉</h3>
                            <p class="text-gray-400 text-sm mb-6">Welcome to the GeeksforGeeks RIT Campus Club family!</p>
                            <a href="https://chat.whatsapp.com/HZjaf6LCpEPCvgiJkdQxi8" target="_blank"
                               class="w-full inline-flex justify-center items-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all text-sm">
                                <i class="fa-brands fa-whatsapp text-xl"></i> Join our WhatsApp Group
                            </a>
                            <p class="text-gray-500 text-xs mt-4">Stay updated with events, resources & coding challenges!</p>
                        </div>
                    `;
                } else {
                    showToast(data.error || 'Could not join', true);
                }
            } catch (error) {
                showToast('Server error, try again later', true);
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
}

function openJoinModal() {
    const modal = document.getElementById('join-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeJoinModal() {
    const modal = document.getElementById('join-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Helper Function: Show Toast Message
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-xl z-50 transform transition-transform duration-300 font-bold ${isError ? 'bg-red-500' : 'bg-gfg'}`;
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ---------------------------------------------
// EVENT API INTEGRATION
// ---------------------------------------------
async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();
        const eventContainer = document.getElementById('events-container');
        
        if (data.success && eventContainer) {
            eventContainer.innerHTML = '';
            data.data.forEach(event => {
                const dateObj = new Date(event.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                const html = `
                <div class="glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start hover:border-gfg transition-colors">
                    <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="${event.title}" class="w-full md:w-48 h-32 object-cover rounded-xl shadow-lg">
                    <div class="flex-grow">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-2xl font-bold text-white">${event.title}</h3>
                            <span class="bg-gfg/20 text-gfg-light px-3 py-1 rounded text-sm font-bold">${dateStr}</span>
                        </div>
                        <p class="text-gray-300 mb-4 line-clamp-2">${event.description}</p>
                        <button class="text-sm border border-gfg text-gfg hover:bg-gfg hover:text-white px-4 py-2 rounded-lg transition-colors font-bold" onclick="document.getElementById('reg-event-id').value='${event._id}';">Select Event</button>
                    </div>
                </div>`;
                eventContainer.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function fetchEventsPreview() {
    const container = document.getElementById('events-preview-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/events`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.slice(0, 2).forEach(event => {
                const dateObj = new Date(event.date);
                const month = dateObj.toLocaleString('en-US', { month: 'short' });
                const day = dateObj.getDate();
                
                const html = `
                <div class="glass-card p-5 rounded-xl flex items-start gap-4 h-full">
                    <div class="bg-gfg/20 text-gfg-light p-3 rounded-lg text-center min-w-[60px]">
                        <span class="block text-xs uppercase font-bold">${month}</span>
                        <span class="block text-xl font-extrabold">${day}</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-1">${event.title}</h3>
                        <p class="text-gray-300 text-sm mb-3"><i class="fa-regular fa-clock"></i> ${event.time || 'TBA'}</p>
                        <span class="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Update</span>
                    </div>
                </div>`;
                container.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (err) {
        console.error('Error fetching events preview:', err);
    }
}

function setupRegistrationForm() {
    const form = document.getElementById('registration-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            studentName: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            department: document.getElementById('reg-dept').value,
            eventId: document.getElementById('reg-event-id').value
        };

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/events/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                showToast('Registration successful!');
                form.reset();
            } else {
                showToast(data.error || 'Registration failed', true);
            }
        } catch (error) {
            showToast('Server error during registration', true);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// ---------------------------------------------
// LEADERBOARD API INTEGRATION
// ---------------------------------------------
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const data = await response.json();
        const tbody = document.getElementById('leaderboard-body');
        
        if (data.success && tbody) {
             tbody.innerHTML = '';
             data.data.forEach(student => {
                 let badgeHtml = '';
                 let rankStyle = '';
                 if (student.rank === 1) {
                     badgeHtml = `<span class="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20"><i class="fa-solid fa-medal"></i> Gold</span>`;
                     rankStyle = 'bg-yellow-500/20 text-yellow-500 font-bold border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]';
                 } else if (student.rank === 2) {
                     badgeHtml = `<span class="inline-flex items-center gap-1 bg-gray-400/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-400/20"><i class="fa-solid fa-medal"></i> Silver</span>`;
                     rankStyle = 'bg-gray-400/20 text-gray-300 font-bold border border-gray-400/50';
                 } else if (student.rank === 3) {
                     badgeHtml = `<span class="inline-flex items-center gap-1 bg-orange-700/10 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-700/20"><i class="fa-solid fa-medal"></i> Bronze</span>`;
                     rankStyle = 'bg-orange-700/20 text-orange-400 font-bold border border-orange-700/50';
                 } else {
                     badgeHtml = `<span class="inline-flex items-center gap-1 bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-700">Member</span>`;
                     rankStyle = 'text-gray-500 font-bold';
                 }

                 const seed = encodeURIComponent(student.studentName);
                 
                 const rowHtml = `
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td class="p-4 text-center">
                            <div class="w-10 h-10 mx-auto rounded-full ${rankStyle} flex items-center justify-center">${student.rank}</div>
                        </td>
                        <td class="p-4">
                            <div class="flex items-center gap-4">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}" alt="${student.studentName}" class="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-gfg transition-colors bg-white/10">
                                <div>
                                    <div class="font-bold text-white text-lg">${student.studentName}</div>
                                </div>
                            </div>
                        </td>
                        <td class="p-4 text-right font-bold text-gfg-light text-lg">${student.points}</td>
                        <td class="p-4 text-center">${badgeHtml}</td>
                    </tr>
                 `;
                 tbody.insertAdjacentHTML('beforeend', rowHtml);
             });
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

async function fetchLeaderboardPreview() {
    const container = document.getElementById('leaderboard-preview-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
            container.innerHTML = '';
            data.data.slice(0, 3).forEach((student, idx) => {
                const rank = idx + 1;
                const rankColor = rank === 1 ? 'yellow-500' : rank === 2 ? 'gray-400' : 'orange-700';
                const rowHtml = `
                <div class="p-4 ${idx < 2 ? 'border-b border-gray-800' : ''} flex justify-between items-center ${idx === 0 ? 'bg-white/5' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-${rankColor}/20 flex items-center justify-center text-${rankColor} font-bold border border-${rankColor}/50">${rank}</div>
                        <span class="font-semibold ${idx > 0 ? 'text-gray-300' : 'text-white'}">${student.studentName}</span>
                    </div>
                    <span class="text-gfg-light font-bold">${student.points} pts</span>
                </div>`;
                container.insertAdjacentHTML('beforeend', rowHtml);
            });
        }
    } catch (err) {
        console.error('Error fetching leaderboard preview:', err);
    }
}

// ---------------------------------------------
// ROADMAP GENERATOR API INTEGRATION
// ---------------------------------------------
function setupRoadmapForm() {
    const form = document.getElementById('roadmap-form');
    if (!form) return;

    window.generateRoadmap = async function() {
        const payload = {
            skillLevel: document.querySelector('input[name="level"]:checked').value,
            language: document.getElementById('road-lang').value,
            goal: document.getElementById('road-goal').value,
            hoursPerDay: document.getElementById('timeSlider').value
        };

        const emptyState = document.getElementById('empty-state');
        const loadState = document.getElementById('loading-state');
        const resState = document.getElementById('result-state');

        emptyState.classList.add('hidden');
        resState.classList.add('hidden');
        loadState.classList.remove('hidden');
        loadState.classList.add('flex');

        try {
            const res = await fetch(`${API_URL}/roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                // Populate Results
                const listContainer = document.getElementById('roadmap-list-container');
                listContainer.innerHTML = ''; // clear old

                // Header Info
                document.getElementById('road-res-goal').innerHTML = `<i class="fa-solid fa-bullseye"></i> Goal: ${payload.goal} (${payload.language})`;
                document.getElementById('road-res-desc').innerText = `Based on ${payload.hoursPerDay} hrs/day commitment for a ${payload.skillLevel}.`;

                const colors = ['gfg', 'gray-700', 'gray-700', 'gray-700'];

                data.data.roadmap.forEach((weekObj, idx) => {
                    const color = colors[idx] || 'gray-700';
                    const activeClass = idx === 0 ? 'text-white' : 'text-white opacity-80';
                    const liItems = weekObj.tasks.map(t => `<li>${t}</li>`).join('');

                    const weekHtml = `
                    <div class="relative pl-8 pb-4">
                        <div class="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-${color} border-4 border-dark"></div>
                        <h4 class="text-lg font-bold ${activeClass} mb-2">Week ${weekObj.week}: ${weekObj.title}</h4>
                        <ul class="text-gray-300 space-y-2 text-sm list-disc list-inside">
                            ${liItems}
                        </ul>
                    </div>
                    `;
                    listContainer.insertAdjacentHTML('beforeend', weekHtml);
                });

                loadState.classList.remove('flex');
                loadState.classList.add('hidden');
                resState.classList.remove('hidden');
                resState.classList.add('block');
            } else {
                showToast(data.error || 'Failed to generate roadmap', true);
                loadState.classList.add('hidden');
                emptyState.classList.remove('hidden');
            }
        } catch (error) {
            showToast('Generation request failed', true);
            loadState.classList.remove('flex');
            loadState.classList.add('hidden');
            emptyState.classList.remove('hidden');
        }
    };
}

// ---------------------------------------------
// RESOURCES API INTEGRATION
// ---------------------------------------------
let allResources = [];

async function fetchResources() {
    const loading = document.getElementById('resources-loading');
    const containers = {
        'Beginner Programming': document.getElementById('category-beginner'),
        'DSA Preparation': document.getElementById('category-dsa'),
        'Interview Prep': document.getElementById('category-interview')
    };
    
    // Safety check: if containers don't exist, we aren't on the resources page
    if (!containers['Beginner Programming']) return;

    loading?.classList.remove('hidden');
    Object.values(containers).forEach(c => c.innerHTML = '');

    try {
        const res = await fetch(`${API_URL}/resources`);
        const data = await res.json();

        if (data.success) {
            renderResourcesGrouped(data.data, containers);
        } else {
            Object.values(containers).forEach(c => c.innerHTML = '<p class="text-red-400 text-xs">Failed to load content.</p>');
        }
    } catch (error) {
        Object.values(containers).forEach(c => c.innerHTML = '<p class="text-red-400 text-xs text-center">Server unreachable.</p>');
    } finally {
        loading?.classList.add('hidden');
    }
}

function renderResourcesGrouped(resources, containers) {
    const styles = {
        'Beginner Programming': { color: 'blue-400', hoverBg: 'blue-500/10', hoverBorder: 'blue-500/20' },
        'DSA Preparation': { color: 'gfg-light', hoverBg: 'gfg/10', hoverBorder: 'gfg/20' },
        'Interview Prep': { color: 'purple-400', hoverBg: 'purple-500/10', hoverBorder: 'purple-400/20' }
    };

    resources.forEach(r => {
        const target = containers[r.category];
        if (!target) return;

        const style = styles[r.category] || styles['DSA Preparation'];
        
        const html = `
            <a href="${r.link}" target="_blank" class="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-${style.hoverBg} hover:border-${style.hoverBorder} transition-all group/item">
                <span class="text-gray-300 group-hover/item:text-white font-medium">${r.title}</span>
                <i class="fa-solid fa-arrow-right text-${style.color} text-xs opacity-50 group-hover/item:opacity-100 transition-opacity"></i>
            </a>`;
        
        target.insertAdjacentHTML('beforeend', html);
    });

    // Handle empty categories
    Object.keys(containers).forEach(cat => {
        if (containers[cat].children.length === 0) {
            containers[cat].innerHTML = '<p class="text-gray-600 text-xs italic py-4">Stay tuned! Resources arriving soon.</p>';
        }
    });
}

// ---------------------------------------------
// CONTACT FORM API INTEGRATION
// ---------------------------------------------
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('contact-fname').value;
        const lastName = document.getElementById('contact-lname').value;
        const payload = {
            name: `${firstName} ${lastName}`,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-msg').value
        };

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                showToast('Message sent successfully!');
                form.reset();
            } else {
                showToast(data.error || 'Failed to send message', true);
            }
        } catch (error) {
            showToast('Server error during sending', true);
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}


// ---------------------------------------------
// CODING CHALLENGE PLATFORM LOGIC
// ---------------------------------------------

// Global state
let editor = null;
let currentProblemId = null;

// Authentication Modal Injection
function injectAuthModal() {
    if (document.getElementById('auth-modal')) return;

    const modalHtml = `
    <!-- Login Modal -->
    <div id="auth-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="glass-card w-full max-w-md overflow-hidden rounded-3xl animate-[fadeInUp_0.3s_ease] border-none shadow-2xl">
            <div class="bg-gfg p-8 text-center relative">
                <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"><i class="fa-solid fa-xmark text-xl"></i></button>
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 backdrop-blur-md">
                    <i class="fa-solid fa-user text-white text-3xl"></i>
                </div>
                <h3 id="auth-modal-title" class="text-2xl font-bold text-white">Welcome Back</h3>
                <p id="auth-modal-desc" class="text-white/80 text-sm">Login to start solving challenges</p>
            </div>
            <div id="auth-form-container" class="p-8 space-y-4">
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <input type="email" id="auth-email" required class="w-full bg-dark/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg transition-all mt-1" placeholder="name@ritchennai.edu.in">
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <input type="password" id="auth-password" required class="w-full bg-dark/50 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg transition-all mt-1" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full bg-gfg hover:bg-gfg-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-gfg/30 transition-all mt-4">Login</button>
                    <p class="text-center text-gray-500 text-sm mt-4">Don't have an account? <a href="#" onclick="showSignup()" class="text-gfg font-bold">Join Community</a></p>
                </form>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    initMemberAuth();
}

// Authentication
async function initMemberAuth() {
    const token = localStorage.getItem('memberToken');
    const authBtn = document.getElementById('auth-btn');
    
    if (authBtn) {
        if (token) {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    authBtn.innerText = `Hi, ${data.data.name.split(' ')[0]}`;
                    authBtn.onclick = () => {
                        if(confirm('Do you want to logout?')) {
                            localStorage.removeItem('memberToken');
                            window.location.reload();
                        }
                    };
                } else {
                    localStorage.removeItem('memberToken');
                    authBtn.onclick = openAuthModal;
                }
            } catch (error) {
                console.error('Auth error:', error);
                authBtn.onclick = openAuthModal;
            }
        } else {
            authBtn.onclick = openAuthModal;
        }
    }

    // Initialize Login Form Listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Logging in...';
            btn.disabled = true;

            try {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('memberToken', data.token);
                    showToast('Login successful!');
                    closeAuthModal();
                    initMemberAuth(); // Refresh auth state
                    if(window.location.pathname.includes('coding.html')) window.location.reload();
                } else {
                    showToast(data.error || 'Login failed', true);
                }
            } catch (error) {
                showToast('Server connection error', true);
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        };
    }
}


// Challenges Listing
async function fetchChallenges() {
    const list = document.getElementById('challenges-list');
    if (!list) return;

    try {
        const res = await fetch(`${API_URL}/challenges`);
        const data = await res.json();
        
        if (data.success) {
            list.innerHTML = '';
            data.data.forEach(p => {
                const diffColor = p.difficulty === 'Easy' ? 'text-gfg' : p.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600';
                const html = `
                <div class="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-gfg/30 transition-all">
                    <div>
                        <h3 class="font-bold text-white text-xl mb-1">${p.title}</h3>
                        <div class="flex gap-4 items-center">
                            <span class="${diffColor} text-sm font-bold">${p.difficulty}</span>
                            <div class="flex gap-2">
                                ${p.tags.map(t => `<span class="bg-white/5 text-gray-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-white/5">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                    <a href="coding.html?id=${p._id}" class="bg-white/5 group-hover:bg-gfg group-hover:text-white text-gray-300 px-6 py-2.5 rounded-xl font-bold transition-all border border-white/10 group-hover:border-gfg">Solve</a>
                </div>`;
                list.insertAdjacentHTML('beforeend', html);
            });
        }
    } catch (error) {
        list.innerHTML = `<p class="text-red-500 text-center">Failed to load challenges.</p>`;
    }
}

// Coding Page
async function initCodingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentProblemId = urlParams.get('id');
    
    if (!currentProblemId) {
        window.location.href = 'challenges.html';
        return;
    }

    // Initialize Monaco
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: '# write your code here\\nprint("Hello GfG RIT!")',
            language: 'python',
            theme: 'vs-light',
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 20 }
        });
    });

    // Language Change
    document.getElementById('lang-select').addEventListener('change', (e) => {
        const lang = e.target.value;
        const models = monaco.editor.getModels();
        if (models.length > 0) {
            monaco.editor.setModelLanguage(models[0], lang);
        }
    });

    // Fetch problem details
    try {
        const res = await fetch(`${API_URL}/challenges/${currentProblemId}`);
        const data = await res.json();
        if (data.success) {
            const p = data.data;
            document.getElementById('problem-title').innerText = p.title;
            document.getElementById('problem-difficulty').innerText = p.difficulty;
            document.getElementById('problem-description').innerHTML = p.description.replace(/\\n/g, '<br>');
            document.getElementById('input-format').innerText = p.inputFormat;
            document.getElementById('output-format').innerText = p.outputFormat;
            
            const sample = p.testCases.find(tc => tc.isSample) || p.testCases[0];
            if (sample) {
                document.getElementById('sample-input').innerText = sample.input;
                document.getElementById('sample-output').innerText = sample.expectedOutput;
            }
        }
    } catch (error) {
        showToast('Error loading problem', true);
    }

    // Submit Logic
    document.getElementById('submit-btn').addEventListener('click', async () => {
        const token = localStorage.getItem('memberToken');
        if (!token) {
            showToast('Please login to submit', true);
            openAuthModal();
            return;
        }

        const code = editor.getValue();
        const lang = document.getElementById('lang-select').value;
        const btn = document.getElementById('submit-btn');
        const originalText = btn.innerText;
        
        btn.innerText = 'Submitting...';
        btn.disabled = true;
        document.getElementById('console-output').innerHTML = '<p class="text-gfg animate-pulse">Running test cases...</p>';

        try {
            const res = await fetch(`${API_URL}/challenges/${currentProblemId}/submit`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code, language: lang })
            });
            const data = await res.json();
            
            if (data.success) {
                const result = data.data;
                const statusColor = result.status === 'Accepted' ? 'text-gfg font-bold' : 'text-red-500 font-bold';
                
                document.getElementById('console-output').innerHTML = `
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm">Status: <span class="${statusColor}">${result.status}</span></span>
                            <span class="text-xs text-gray-400">Time: ${result.time}s | Memory: ${result.memory}KB</span>
                        </div>
                        <div class="mt-4">
                            <label class="text-[10px] font-bold text-gray-400 uppercase">Your Output:</label>
                            <pre class="bg-gray-100 p-3 rounded-lg mt-1 text-xs truncate">${result.stdout || 'No output'}</pre>
                        </div>
                        ${result.stderr ? `<div class="mt-2"><label class="text-[10px] font-bold text-red-400 uppercase">Error:</label><pre class="text-red-500 text-xs">${result.stderr}</pre></div>` : ''}
                        ${result.compile_output ? `<div class="mt-2"><label class="text-[10px] font-bold text-orange-400 uppercase">Compile Error:</label><pre class="text-orange-500 text-xs">${result.compile_output}</pre></div>` : ''}
                    </div>
                `;

                if (result.status === 'Accepted') {
                    showToast('🎉 Challenge Solved! Points updated.');
                }
            } else {
                showToast(data.error || 'Submission failed', true);
                document.getElementById('console-output').innerHTML = `<p class="text-red-500">${data.error || 'An error occurred.'}</p>`;
            }
        } catch (error) {
            showToast('Submission error', true);
            document.getElementById('console-output').innerHTML = '<p class="text-red-500">Could not reach the execution engine.</p>';
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });

    // Run Logic (Simulated or Sample only)
    document.getElementById('run-btn').addEventListener('click', () => {
        showToast('Running on sample input...');
        document.getElementById('submit-btn').click(); // Reuse submit for now
    });

    // Resizer Logic
    const resizer = document.querySelector('.resizer');
    const leftPane = document.getElementById('problem-pane');
    let isResizing = false;

    if(resizer) {
        resizer.addEventListener('mousedown', () => isResizing = true);
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const percentage = (e.clientX / window.innerWidth) * 100;
            if (percentage > 20 && percentage < 80) {
                leftPane.style.width = `${percentage}%`;
            }
        });
        document.addEventListener('mouseup', () => isResizing = false);
    }
}

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Show Signup View
window.showSignup = function() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;

    modal.querySelector('h3').innerText = 'Join Community';
    modal.querySelector('p').innerText = 'Create an account to track your progress';
    
    const form = document.getElementById('login-form');
    if (!form) return;

    form.id = 'signup-form';
    // Add Name, Branch, Year fields
    form.innerHTML = `
        <div class="grid grid-cols-1 gap-4">
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" id="auth-name" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gfg/20 transition-all mt-1" placeholder="Your Name">
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">College Email</label>
                <input type="email" id="auth-email" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gfg/20 transition-all mt-1" placeholder="you@ritchennai.edu.in">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Branch</label>
                    <input type="text" id="auth-branch" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gfg/20 transition-all mt-1" placeholder="e.g. CSE">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                    <select id="auth-year" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gfg/20 transition-all mt-1">
                        <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" id="auth-password" required class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gfg/20 transition-all mt-1" placeholder="••••••••">
            </div>
        </div>
        <button type="submit" class="w-full bg-gfg hover:bg-gfg-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-gfg/30 transition-all mt-4">Create Account</button>
        <p class="text-center text-gray-500 text-xs mt-4">Already have an account? <a href="#" onclick="window.location.reload()" class="text-gfg font-bold">Login</a></p>
    `;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            name: document.getElementById('auth-name').value,
            email: document.getElementById('auth-email').value,
            password: document.getElementById('auth-password').value,
            branch: document.getElementById('auth-branch').value,
            year: document.getElementById('auth-year').value
        };

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Creating account...';
        btn.disabled = true;

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('memberToken', data.token);
                showToast('Welcome to GfG RIT! 🎉');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showToast(data.error || 'Signup failed', true);
            }
        } catch (error) {
            showToast('Server connection error', true);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
};

// ---------------------------------------------
// FLOATING ACTION BUTTONS (ADMIN & AI MENTOR)
// ---------------------------------------------
function setupFloatingButtons() {
    // Create container for floating buttons
    const container = document.createElement('div');
    container.id = 'floating-buttons-container';
    container.className = 'fixed inset-x-0 bottom-0 pointer-events-none z-[999] flex justify-between p-6 pb-8 md:p-8 md:pb-10 items-end';
    
    // Admin Portal Button (Left)
    const adminBtnHtml = `
        <a href="/admin" class="pointer-events-auto flex items-center gap-0 hover:gap-3 p-0 rounded-full glass-card text-white transition-all duration-300 group w-14 hover:w-48 h-14 overflow-hidden shadow-lg border-none">
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-[#1e293b] flex items-center justify-center text-gray-400 group-hover:bg-gfg group-hover:text-white transition-all">
                <i class="fa-solid fa-user-shield text-xl"></i>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pr-8 pl-4">
                <span class="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none block mb-1">Internal</span>
                <span class="font-bold text-sm tracking-tight">Admin Portal</span>
            </div>
        </a>
    `;

    // Mentor Button (Right)
    const mentorBtnHtml = `
        <a href="mentor.html" class="pointer-events-auto flex flex-row-reverse items-center gap-0 hover:gap-4 p-0 rounded-full glass-card text-white hover:scale-105 transition-all duration-300 group relative w-14 hover:w-52 h-14 overflow-hidden shadow-[0_0_30px_rgba(47,141,70,0.2)] border-none">
            <div class="absolute top-1 right-1 w-3.5 h-3.5 bg-gfg rounded-full z-20 transition-transform group-hover:scale-0 shadow-sm border border-white/20">
                <span class="absolute inset-0 rounded-full bg-gfg animate-ping opacity-75"></span>
            </div>
            <div class="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-tr from-gfg to-gfg-light flex items-center justify-center text-white text-xl shadow-lg relative z-10">
                <i class="fa-solid fa-headset"></i>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end whitespace-nowrap pl-8 pr-4">
                <span class="text-[10px] uppercase font-black text-gfg-light tracking-widest leading-none mb-1">Ask Anything</span>
                <span class="font-bold text-base tracking-tight">Mentor 24/7</span>
            </div>
        </a>
    `;

    container.innerHTML = adminBtnHtml + mentorBtnHtml;
    document.body.appendChild(container);
}
