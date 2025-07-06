// Telegram Web App initialization
const tg = window.Telegram.WebApp;

// App state
let appState = {
    user: null,
    balance: 0,
    currentScreen: 'game',
    gameState: 'idle',
    referrals: {
        level1: 0,
        level2: 0,
        level3: 0
    },
    tasks: {
        referrals: [
            { id: 'ref3', target: 3, current: 0, reward: 21, name: 'Invite 3 active friends!' },
            { id: 'ref7', target: 7, current: 0, reward: 28, name: 'Invite 7 active friends!' },
            { id: 'ref15', target: 15, current: 0, reward: 40, name: 'Invite 15 active friends!' },
            { id: 'ref50', target: 50, current: 0, reward: 140, name: 'Invite 50 active friends!' }
        ],
        bets: [
            { id: 'bet500', target: 500, current: 1, reward: 25, name: 'Place 500 Bets!' },
            { id: 'bet1000', target: 1000, current: 1, reward: 50, name: 'Place 1000 Bets!' },
            { id: 'bet5000', target: 5000, current: 1, reward: 250, name: 'Place 5000 Bets!' },
            { id: 'bet25000', target: 25000, current: 1, reward: 1250, name: 'Place 25000 Bets!' }
        ]
    },
    soundEnabled: true
};

// DOM elements
const elements = {
    username: document.getElementById('username'),
    userId: document.getElementById('userId'),
    balance: document.getElementById('balance'),
    avatarImg: document.getElementById('avatarImg'),
    avatarPlaceholder: document.getElementById('avatarPlaceholder'),
    screens: document.querySelectorAll('.screen'),
    navBtns: document.querySelectorAll('.nav-btn'),
    backBtn: document.getElementById('backBtn'),
    playersList: document.getElementById('playersList'),
    gameHistory: document.getElementById('gameHistory'),
    rollingIndicator: document.getElementById('rollingIndicator'),
    rollingTimer: document.getElementById('rollingTimer'),
    gameNotification: document.getElementById('gameNotification'),
    betAmount: document.getElementById('betAmount'),
    inviteBtn: document.getElementById('inviteBtn'),
    copyWalletBtn: document.getElementById('copyWalletBtn'),
    walletAddress: document.getElementById('walletAddress'),
    exchangeRate: document.getElementById('exchangeRate'),
    depositMethodTitle: document.getElementById('depositMethodTitle')
};

// Initialize app
function initApp() {
    // Expand the Web App
    tg.expand();
    
    // Disable closing confirmation
    tg.disableClosingConfirmation();
    
    // Set theme colors
    tg.setHeaderColor('#1a1a2e');
    tg.setBackgroundColor('#0a0a0a');
    
    // Get user data
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        appState.user = tg.initDataUnsafe.user;
        updateUserInfo();
    } else {
        // Fallback for testing
        appState.user = {
            id: 123456789,
            first_name: "Demo User",
            username: "demouser",
            photo_url: null
        };
        updateUserInfo();
    }
    
    // Initialize UI
    setupNavigation();
    setupGameControls();
    setupCryptoOptions();
    loadGameData();
    updateTasksDisplay();
    
    // Add event listeners
    addEventListeners();
    
    // Start the game if on game screen
    if (appState.currentScreen === 'game') {
        startGameLoop();
    }
    
    console.log('Neon Roll initialized successfully');
}

// Update user information display
function updateUserInfo() {
    if (!appState.user) return;
    
    elements.username.textContent = appState.user.first_name || 'Unknown User';
    elements.userId.textContent = `ID: ${appState.user.id}`;
    
    if (appState.user.photo_url) {
        elements.avatarImg.src = appState.user.photo_url;
        elements.avatarImg.style.display = 'block';
        elements.avatarPlaceholder.style.display = 'none';
    } else {
        elements.avatarPlaceholder.textContent = appState.user.first_name ? 
            appState.user.first_name.charAt(0).toUpperCase() : '?';
    }
    
    updateBalance();
}

// Update balance display
function updateBalance() {
    elements.balance.textContent = `${appState.balance.toFixed(2)} AI`;
}

// Setup navigation
function setupNavigation() {
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const screen = btn.dataset.screen;
            navigateToScreen(screen);
        });
    });
    
    elements.backBtn.addEventListener('click', () => {
        navigateToScreen('game');
    });
}

// Navigate to screen
function navigateToScreen(screenName) {
    // Hide all screens
    elements.screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(`${screenName}Screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenName;
        
        // Update navigation
        elements.navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.screen === screenName) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide back button
        elements.backBtn.style.display = screenName === 'game' ? 'none' : 'block';
        
        // Screen-specific actions
        switch (screenName) {
            case 'game':
                startGameLoop();
                break;
            case 'friends':
                updateReferralStats();
                break;
            case 'tasks':
                updateTasksDisplay();
                break;
        }
        
        // Trigger haptic feedback
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    }
}

// Setup game controls
function setupGameControls() {
    // Bet amount controls
    document.querySelectorAll('.bet-control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const currentBet = parseFloat(elements.betAmount.value) || 5;
            
            let newBet = currentBet;
            switch (action) {
                case 'min':
                    newBet = 1;
                    break;
                case 'half':
                    newBet = Math.max(1, Math.floor(currentBet / 2));
                    break;
                case 'double':
                    newBet = Math.min(10000, currentBet * 2);
                    break;
                case 'max':
                    newBet = Math.min(10000, appState.balance);
                    break;
            }
            
            elements.betAmount.value = newBet;
            
            // Add visual feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Win buttons (place bet)
    document.querySelectorAll('.win-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            const multiplier = parseFloat(btn.dataset.multiplier);
            const betAmount = parseFloat(elements.betAmount.value) || 5;
            
            placeBet(color, multiplier, betAmount);
        });
    });
    
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

// Setup crypto options
function setupCryptoOptions() {
    document.querySelectorAll('.crypto-option').forEach(option => {
        option.addEventListener('click', () => {
            const crypto = option.dataset.crypto;
            handleCryptoSelection(crypto);
        });
    });
    
    // Copy wallet button
    elements.copyWalletBtn.addEventListener('click', () => {
        copyToClipboard(elements.walletAddress.textContent);
        
        // Show feedback
        elements.copyWalletBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            elements.copyWalletBtn.textContent = '✅ Wallet copied ✅';
        }, 2000);
    });
}

// Handle crypto selection
function handleCryptoSelection(crypto) {
    const cryptoData = {
        ton: { name: 'TON', rate: 316.06, min: 27 },
        usdt: { name: 'Tether TRC20', rate: 1.0, min: 15 },
        trx: { name: 'TRON', rate: 0.12, min: 41 },
        bnb: { name: 'BNB', rate: 245.50, min: 29 },
        btc: { name: 'Bitcoin', rate: 45000.00, min: 100 },
        doge: { name: 'DOGE', rate: 0.08, min: 10 },
        ltc: { name: 'Litecoin', rate: 75.00, min: 15 },
        usdc: { name: 'USDC ERC20', rate: 1.0, min: 20 }
    };
    
    const data = cryptoData[crypto];
    if (!data) return;
    
    // For deposit, show crypto details screen
    if (appState.currentScreen === 'deposit') {
        elements.depositMethodTitle.textContent = `Deposit via ${data.name}`;
        elements.exchangeRate.textContent = `Exchange rate 1 ${data.name} = ${data.rate} AI`;
        
        // Generate a unique wallet address (demo)
        const walletAddress = generateWalletAddress(crypto);
        elements.walletAddress.textContent = walletAddress;
        
        // Show crypto details screen
        document.getElementById('cryptoDetailsScreen').style.display = 'block';
        document.getElementById('depositScreen').classList.remove('active');
        document.getElementById('cryptoDetailsScreen').classList.add('active');
    }
    
    // For withdraw, show withdrawal form (simplified for demo)
    if (appState.currentScreen === 'withdraw') {
        showNotification(`Withdrawal via ${data.name} (Min. ${data.min} AI)`);
    }
}

// Generate wallet address (demo)
function generateWalletAddress(crypto) {
    const prefixes = {
        ton: 'UQ',
        usdt: 'T',
        trx: 'T',
        bnb: 'bnb',
        btc: '1',
        doge: 'D',
        ltc: 'L',
        usdc: '0x'
    };
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let address = prefixes[crypto] || '';
    
    const length = crypto === 'usdc' ? 40 : 33;
    for (let i = address.length; i < length; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return address;
}

// Switch tab
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    if (tab === 'players') {
        updatePlayersList();
    } else if (tab === 'history') {
        updateGameHistory();
    }
}

// Update players list
function updatePlayersList() {
    const players = generateRandomPlayers();
    elements.playersList.innerHTML = '';
    
    players.forEach(player => {
        const playerElement = createPlayerElement(player);
        elements.playersList.appendChild(playerElement);
    });
}

// Generate random players for demo
function generateRandomPlayers() {
    const names = ['Romeo ID...', 'Fuhod Sh...', 'Ramah Ali', 'King Walter', 'Sumaiya', 'Tong XD', 'Angelo ra...', 'WilliamSE...', 'N', 'Edgar Ro...'];
    const players = [];
    
    for (let i = 0; i < Math.min(10, names.length); i++) {
        const multipliers = ['x2.2', 'x5', 'x45'];
        const colors = ['red', 'green', 'yellow'];
        const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        players.push({
            name: names[i],
            bet: Math.floor(Math.random() * 450) + 50,
            multiplier: multiplier,
            color: color,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[i]}`
        });
    }
    
    return players;
}

// Create player element
function createPlayerElement(player) {
    const div = document.createElement('div');
    div.className = 'player-item';
    
    const multiplierClass = player.multiplier.includes('2.2') ? 'x2' : 
                           player.multiplier.includes('5') ? 'x5' : 'x45';
    
    div.innerHTML = `
        <div class="player-info">
            <div class="player-avatar">
                <img src="${player.avatar}" alt="${player.name}" onerror="this.style.display='none'">
            </div>
            <div class="player-details">
                <div class="player-name">${player.name}</div>
                <div class="player-bet">${player.bet} AI</div>
            </div>
        </div>
        <div class="player-multiplier ${multiplierClass}">${player.multiplier}</div>
    `;
    
    return div;
}

// Update game history
function updateGameHistory() {
    elements.playersList.innerHTML = '<div style="text-align: center; color: #888; padding: 20px;">Game history will be shown here</div>';
}

// Update referral stats
function updateReferralStats() {
    document.querySelector('.level-stats').innerHTML = `
        <div class="level-stat">
            <div class="level-name">1st lvl.</div>
            <div class="level-count">${appState.referrals.level1} people.</div>
        </div>
        <div class="level-stat">
            <div class="level-name">2nd lvl.</div>
            <div class="level-count">${appState.referrals.level2} people.</div>
        </div>
        <div class="level-stat">
            <div class="level-name">3rd lvl.</div>
            <div class="level-count">${appState.referrals.level3} people.</div>
        </div>
    `;
}

// Update tasks display
function updateTasksDisplay() {
    const friendsTasks = document.querySelector('.task-category:first-child .task-list');
    const betsTasks = document.querySelector('.task-category:last-child .task-list');
    
    // Update friends tasks
    if (friendsTasks) {
        friendsTasks.innerHTML = '';
        appState.tasks.referrals.forEach(task => {
            const taskElement = createTaskElement(task, 'referral');
            friendsTasks.appendChild(taskElement);
        });
    }
    
    // Update betting tasks
    if (betsTasks) {
        betsTasks.innerHTML = '';
        appState.tasks.bets.forEach(task => {
            const taskElement = createTaskElement(task, 'betting');
            betsTasks.appendChild(taskElement);
        });
    }
}

// Create task element
function createTaskElement(task, type) {
    const div = document.createElement('div');
    div.className = 'task-item';
    
    const icon = type === 'referral' ? '📢' : '🎯';
    const progress = `${task.current} / ${task.target}`;
    
    div.innerHTML = `
        <div class="task-icon">${icon}</div>
        <div class="task-details">
            <div class="task-name">${task.name}</div>
            <div class="task-reward">⚡ ${task.reward} AI</div>
        </div>
        <div class="task-progress">${progress}</div>
    `;
    
    return div;
}

// Add event listeners
function addEventListeners() {
    // Invite button
    elements.inviteBtn.addEventListener('click', () => {
        inviteFriends();
    });
    
    // Haptic feedback on buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }
        });
    });
    
    // Handle Telegram back button
    tg.onEvent('backButtonClicked', () => {
        if (appState.currentScreen !== 'game') {
            navigateToScreen('game');
        }
    });
}

// Invite friends
function inviteFriends() {
    const userId = appState.user?.id || 123456789;
    const inviteLink = `https://t.me/YourBotUsername?start=ref_${userId}`;
    const message = `🎮 Join me in Neon Roll Casino! 💎\n\nWin up to x45 multiplier and earn AI tokens!\n\n${inviteLink}`;
    
    if (tg.openTelegramLink) {
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`);
    } else {
        copyToClipboard(inviteLink);
        showNotification('Invite link copied to clipboard!');
    }
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

// Show notification
function showNotification(message) {
    const notification = elements.gameNotification;
    notification.querySelector('.notification-content').textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Load game data (demo)
function loadGameData() {
    // Set initial balance
    appState.balance = 100.0;
    updateBalance();
    
    // Update players list
    updatePlayersList();
}

// Save game data (demo)
function saveGameData() {
    // In a real app, this would save to a backend
    localStorage.setItem('neonRollData', JSON.stringify(appState));
}

// Load saved data
function loadSavedData() {
    const saved = localStorage.getItem('neonRollData');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            appState.balance = data.balance || 100.0;
            appState.tasks = data.tasks || appState.tasks;
            appState.referrals = data.referrals || appState.referrals;
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Handle window focus/blur for game loop
let gameLoopActive = false;

function startGameLoop() {
    if (gameLoopActive) return;
    gameLoopActive = true;
    
    // Update players list periodically
    const playersInterval = setInterval(() => {
        if (appState.currentScreen === 'game' && gameLoopActive) {
            updatePlayersList();
        } else if (!gameLoopActive) {
            clearInterval(playersInterval);
        }
    }, 10000); // Update every 10 seconds
}

function stopGameLoop() {
    gameLoopActive = false;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Load saved data on startup
loadSavedData();

// Save data periodically
setInterval(saveGameData, 30000); // Save every 30 seconds

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopGameLoop();
    } else if (appState.currentScreen === 'game') {
        startGameLoop();
    }
});

// Export for use in game.js
window.NeonRoll = {
    appState,
    updateBalance,
    showNotification,
    playSound: (soundName) => {
        // Sound will be implemented in game.js
        console.log(`Playing sound: ${soundName}`);
    }
};