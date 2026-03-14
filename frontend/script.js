// Base API URL
const API_URL = 'http://localhost:5000/api';

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
    
    if(path.includes('events.html')) {
        fetchEvents();
        setupRegistrationForm();
    } else if (path.includes('leaderboard.html')) {
        fetchLeaderboard();
    } else if (path.includes('roadmap.html')) {
        setupRoadmapForm();
    } else if (path.includes('contact.html')) {
        setupContactForm();
    }

    // Setup Join Community buttons on ALL pages
    setupJoinCommunity();

    // Setup floating AI Mentor chatbot button (on all pages except mentor.html)
    if (!path.includes('mentor.html')) {
        setupFloatingMentor();
    }
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
                    <input type="email" id="join-email" required class="w-full bg-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gfg focus:ring-1 focus:ring-gfg placeholder-gray-600" placeholder="you@college.edu">
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
                    closeJoinModal();
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
                        <p class="text-gray-400 mb-4 line-clamp-2">${event.description}</p>
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
                        <ul class="text-gray-400 space-y-2 text-sm list-disc list-inside">
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
// FLOATING AI MENTOR BUTTON (All Pages)
// ---------------------------------------------
function setupFloatingMentor() {
    const floatingHtml = `
    <a href="mentor.html" id="floating-mentor-btn" class="fixed bottom-6 right-6 z-50 group cursor-pointer" title="Ask AI Mentor">
        <div class="relative">
            <div class="absolute inset-0 bg-gfg rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
            <div class="relative w-14 h-14 bg-gradient-to-br from-gfg to-gfg-light rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(74,222,128,0.4)] group-hover:shadow-[0_0_35px_rgba(74,222,128,0.6)] transition-all group-hover:scale-110">
                <i class="fa-solid fa-robot text-white text-xl"></i>
            </div>
            <span class="absolute -top-8 right-0 bg-dark-card text-gfg-light text-xs font-bold px-3 py-1 rounded-lg border border-gfg/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">Mentor 24/7 🤖</span>
        </div>
    </a>`;
    document.body.insertAdjacentHTML('beforeend', floatingHtml);
}
