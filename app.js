// --- THEME TOGGLE LOGIC ---
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('wwc_theme', isLight ? 'light' : 'dark');
    
    const labelText = isLight ? 'Light Mode' : 'Dark Mode';
    if(document.getElementById('theme-label')) document.getElementById('theme-label').innerText = labelText;
    if(document.getElementById('theme-label-dash')) document.getElementById('theme-label-dash').innerText = labelText;
}

function initTheme() {
    const savedTheme = localStorage.getItem('wwc_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if(document.getElementById('theme-label')) document.getElementById('theme-label').innerText = 'Light Mode';
        if(document.getElementById('theme-label-dash')) document.getElementById('theme-label-dash').innerText = 'Light Mode';
    }
}

// --- DYNAMIC ROLLING SCHEDULE LOGIC ---
function generateSchedule() {
    const scheduleContainer = document.getElementById('schedule-list');
    if(!scheduleContainer) return;

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };

    scheduleContainer.innerHTML = `
        <div class="bg-theme-card border border-theme rounded-lg p-4 flex justify-between items-center opacity-50">
            <div>
                <div class="text-xs text-theme-muted font-bold mb-1">Yesterday, ${yesterday.toLocaleDateString('en-US', options)}</div>
                <div class="font-bold text-theme-main text-lg">Spain vs Italy</div>
            </div>
            <span class="text-xs font-bold text-theme-muted bg-theme-panel border border-theme px-3 py-1 rounded">Ended</span>
        </div>
        
        <div class="bg-theme-card border border-theme rounded-lg p-4 flex justify-between items-center relative overflow-hidden shadow-lg shadow-green-900/10">
            <div class="absolute top-0 left-0 w-1 h-full bg-[#10b981]"></div>
            <div class="pl-2">
                <div class="text-xs text-[#10b981] font-bold mb-1 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Today, ${today.toLocaleDateString('en-US', options)}
                </div>
                <div class="font-bold text-theme-main text-lg">Brazil vs Argentina</div>
            </div>
            <button onclick="switchTab('tab-home', document.querySelector('.bottom-nav').children[0])" class="bg-theme-body border border-theme text-theme-main px-4 py-2 rounded text-xs font-bold hover:bg-[#10b981] hover:text-black transition">Watch Live</button>
        </div>

        <div class="bg-theme-card border border-theme rounded-lg p-4 flex justify-between items-center opacity-80">
            <div>
                <div class="text-xs text-theme-muted font-bold mb-1">Tomorrow, ${tomorrow.toLocaleDateString('en-US', options)} • 18:00 GMT</div>
                <div class="font-bold text-theme-main text-lg">France vs Germany</div>
            </div>
            <span class="text-xs font-bold text-theme-muted bg-theme-panel border border-theme px-3 py-1 rounded">Upcoming</span>
        </div>
    `;
}

// --- GLOBAL UI & AUTH LOGIC ---
function triggerLoader(callback) {
    const loader = document.getElementById('global-loader');
    loader.classList.remove('hidden');
    setTimeout(() => { callback(); loader.classList.add('hidden'); }, 500); 
}

function switchTab(tabId, navElement) {
    if (navElement.classList.contains('active')) return; 
    triggerLoader(() => {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        navElement.classList.add('active');
    });
}

function switchInnerScreen(hideId, showId) {
    triggerLoader(() => {
        document.getElementById(hideId).classList.remove('active');
        document.getElementById(showId).classList.add('active');
    });
}

let currentUser = JSON.parse(localStorage.getItem('wwc_user'));
let displayUsername = currentUser ? currentUser.username : "GuestFan";

function initProfile() {
    if (currentUser) {
        document.getElementById('profile-auth').classList.add('hidden');
        document.getElementById('profile-dashboard').classList.remove('hidden');
        document.getElementById('user-display-name').innerText = currentUser.username;
        displayUsername = currentUser.username;
        if(currentUser.avatar) document.getElementById('user-avatar').src = currentUser.avatar;
    } else {
        document.getElementById('profile-auth').classList.remove('hidden');
        document.getElementById('profile-dashboard').classList.add('hidden');
        displayUsername = "GuestFan";
    }
}

window.onload = () => { 
    initTheme();
    generateSchedule();
    initProfile(); 
    initChat(); 
    startViewerFluctuation(); 
};

function toggleAuthMode() {
    document.getElementById('form-login').classList.toggle('hidden');
    document.getElementById('form-signup').classList.toggle('hidden');
}

function handleSignup() {
    triggerLoader(() => {
        const user = document.getElementById('sign-user').value.trim();
        const pass = document.getElementById('sign-pass').value.trim();
        if(!user || !pass) return alert("Fill all fields.");
        currentUser = { username: user, password: pass, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}` };
        localStorage.setItem('wwc_user', JSON.stringify(currentUser));
        initProfile();
    });
}

function handleLogin() {
    triggerLoader(() => {
        const user = document.getElementById('login-user').value.trim();
        const pass = document.getElementById('login-pass').value.trim();
        const savedUser = JSON.parse(localStorage.getItem('wwc_user'));
        if (savedUser && savedUser.username === user && savedUser.password === pass) {
            currentUser = savedUser;
            initProfile();
        } else { alert("Invalid credentials."); }
    });
}

function handleLogout() {
    triggerLoader(() => {
        currentUser = null;
        document.getElementById('login-user').value = '';
        document.getElementById('login-pass').value = '';
        initProfile();
    });
}

// --- STREAMING UI & CPA SEQUENCE ---
function startUnlockSequence() {
    document.getElementById('video-ui').classList.add('hidden');
    document.getElementById('video-buffering').classList.remove('hidden');
    document.getElementById('video-buffering').classList.add('flex');

    setTimeout(() => {
        switchInnerScreen('screen-landing', 'screen-terminal');
        
        setTimeout(() => {
            const lines = [
                { text: "[Sys] Attempting direct P2P video stream...", class: "log-sys", delay: 300 },
                { text: "[Warn] Excessive traffic detected on node US-East.", class: "log-warn", delay: 1000 },
                { text: "[Sys] Initiating Anti-DDoS protocol...", class: "log-sys", delay: 1800 },
                { text: "[Error] Connection Paused. Automated Bot Suspected.", class: "log-err", delay: 2800 },
                { text: "[Sys] Redirecting to human verification gateway...", class: "log-sys", delay: 4000 }
            ];

            const terminal = document.getElementById('terminal-output');
            terminal.innerHTML = '';

            lines.forEach(line => {
                setTimeout(() => {
                    terminal.innerHTML += `<div class="log-line ${line.class}">${line.text}</div>`;
                    terminal.scrollTop = terminal.scrollHeight;
                }, line.delay);
            });

            setTimeout(() => {
                switchInnerScreen('screen-terminal', 'screen-tasks');
                fetchAdBlueMediaOffers();
            }, 5000);
        }, 600); 
    }, 2500);
}

// --- ADBLUEMEDIA JSONP FETCH LOGIC ---
function fetchAdBlueMediaOffers() {
    $("#loading-offers").removeClass('hidden');
    $("#offers-list").empty();

    const adBlueUrl = "https://de6jvomfbm0af.cloudfront.net/public/offers/feed.php?user_id=779217&api_key=45665e45f6e0cc2e67c90724cfedcfe8&s1=&s2=&callback=?";

    $.getJSON(adBlueUrl, function(offers) {
        $("#loading-offers").addClass('hidden');
        if (offers && offers.length > 0) {
            const displayOffers = offers.slice(0, 4);
            displayOffers.forEach((offer) => {
                let html = `
                    <div class="offer-row" onclick="openOffer('${offer.url}', this)">
                        <div class="flex-1 pr-4">
                            <div class="text-[13px] font-bold text-theme-main mb-1">${offer.anchor || 'Complete Verification Task'}</div>
                            <div class="text-[11px] text-theme-muted">Verifies in ~60 seconds</div>
                        </div>
                        <div class="offer-btn">Verify</div>
                    </div>`;
                $("#offers-list").append(html);
            });
        } else {
            $("#offers-list").html('<p class="text-xs text-center text-theme-muted py-6">No tasks available in your region. Disable adblock or VPN.</p>');
        }
    }).fail(function() {
        $("#loading-offers").addClass('hidden');
        $("#offers-list").html('<p class="text-xs text-center text-red-500 py-6">Network error. Disable adblock and refresh.</p>');
    });
}

let lockerProgress = 5;
let progressInterval;
function openOffer(url, el) {
    $(el).find('.offer-btn').text('Checking...').css({background: 'var(--bg-panel)', color: 'var(--text-muted)'});
    window.open(url, '_blank');
    
    clearInterval(progressInterval);
    document.getElementById('progress-fill').classList.remove('duration-1000');
    
    progressInterval = setInterval(() => {
        lockerProgress += (Math.random() * 2);
        if(lockerProgress > 94) {
            lockerProgress = 94; 
            clearInterval(progressInterval);
        }
        document.getElementById('progress-fill').style.width = lockerProgress + '%';
    }, 800);
}

// --- ADVANCED CHAT SIMULATOR ---
const chatContainer = document.getElementById('chat-container');
let baseViewers = 1492041;

const userNames = [
    "TikiTaka99", "GoalHunter", "Fanatic", "VAR_Official", "MessiGoat", "CR7Fanboy", 
    "PitchMaster", "SoccerDad", "UltraFan", "ElNino", "RedCard", "OffsideTrap",
    "GoldenBoot", "Sweeper", "Playmaker10", "GooooooolAzul", "LeButeur", "Carlos99",
    "NinjaStriker", "FootyLover21", "NeymarSamba", "MbappeDash", "PeleLegend", 
    "RefIsTrash", "AwayDays", "UltraHooligan", "CornerKick", "CrossbarChallenge"
];

const chatSequences = {
    cheering: [
        "VAMOSSS!", "Let's gooo!", "What a pass!", "Quality looks insane", "Goal incoming...", 
        "Here we go boys!", "This match is fire 🔥", "Did you see that touch?", "Pure class.",
        "Absolutely beautiful football."
    ],
    beefing: [
        "Ref is blind wtf", "That was literally a dive 😂", "You guys know nothing about football", 
        "Lucky shot.", "Wake up defense!!", "How is that not a red card??", "VAR is a joke.",
        "This game is rigged 100%", "Overrated player tbh"
    ],
    verifying: [
        "Did the verification work for anyone?", "Yeah bro took me like 1 min", "Just do the app install one, it's fastest", 
        "Is this legit?", "Works perfect 4K too", "I did the survey and it unlocked immediately", 
        "Wait I'm stuck on 90%?", "Just wait a few seconds it takes a moment to process",
        "Yo the stream hasn't buffered once, W site"
    ]
};

function initChat() {
    addChatBubble("StreamBot", "Welcome to the Global Live Chat! (Note: Older messages delete to save memory).", "other", true);
    
    setInterval(() => {
        const msgsToGenerate = Math.floor(Math.random() * 3) + 1;
        for(let i=0; i<msgsToGenerate; i++) {
            setTimeout(() => {
                const themes = ["cheering", "cheering", "beefing", "verifying"];
                const pickedTheme = themes[Math.floor(Math.random() * themes.length)];
                const textList = chatSequences[pickedTheme];
                const msg = textList[Math.floor(Math.random() * textList.length)];
                const usr = userNames[Math.floor(Math.random() * userNames.length)];
                addChatBubble(usr, msg, "other", false);
            }, i * 800); 
        }
    }, 3000); 
}

function addChatBubble(name, text, type, isSystem) {
    const wrap = document.createElement('div');
    wrap.className = `chat-bubble ${type}`;
    
    let nameStyle = type === 'you' ? 'color: var(--chat-bubble-you);' : (isSystem ? 'color: #ef4444;' : 'color: #10b981;');
    let verifiedBadge = isSystem ? ' <span style="font-size:8px; background:#ef4444; color:white; padding:1px 3px; border-radius:3px; vertical-align:middle;">MOD</span>' : '';

    wrap.innerHTML = `
        <span class="chat-name" style="${nameStyle}">${name}${verifiedBadge}</span>
        ${text}
    `;
    chatContainer.appendChild(wrap);
    
    if (chatContainer.children.length > 8) {
        chatContainer.removeChild(chatContainer.firstChild);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if(!text) return;

    addChatBubble(displayUsername, text, 'you', false);
    input.value = '';

    setTimeout(() => {
        const replies = [
            "Agreed bro!", "Haha totally.", `I see you @${displayUsername}, facts.`, 
            "Wait really?", "Nah you're tripping", `Lol @${displayUsername} true`
        ];
        const rep = replies[Math.floor(Math.random() * replies.length)];
        const usr = userNames[Math.floor(Math.random() * userNames.length)];
        addChatBubble(usr, rep, 'other', false);
    }, 2500);
}

document.getElementById('chat-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendChatMessage();
});

function startViewerFluctuation() {
    const countEl = document.getElementById('chat-live-count');
    const countElHome = document.getElementById('live-viewer-count'); 
    
    setInterval(() => {
        const change = Math.floor(Math.random() * 800) - 300; 
        baseViewers += change;
        const formatted = baseViewers.toLocaleString();
        if(countEl) countEl.innerText = formatted;
        if(countElHome) countElHome.innerText = formatted;
    }, 4000);
}

