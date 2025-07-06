// Game logic for Neon Roll Casino
let gameEngine = {
    isRolling: false,
    rollTimer: null,
    currentBet: null,
    gameHistory: [],
    lastRollTime: 0,
    rollInterval: 15000, // 15 seconds between rolls
    audioContext: null,
    sounds: {},
    rollStartTime: 0
};

// Sound frequencies for different colors
const soundFrequencies = {
    red: 220,    // A3
    blue: 261.63, // C4  
    green: 329.63, // E4
    yellow: 440,  // A4
    win: 523.25,  // C5
    lose: 146.83, // D3
    spin: 349.23  // F4
};

// Initialize game engine
function initGameEngine() {
    setupAudioContext();
    setupGameTimer();
    generateInitialHistory();
    console.log('Game engine initialized');
}

// Setup Web Audio Context for sound effects
function setupAudioContext() {
    try {
        gameEngine.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        preloadSounds();
    } catch (e) {
        console.warn('Web Audio API not supported:', e);
    }
}

// Preload sound effects
function preloadSounds() {
    Object.keys(soundFrequencies).forEach(soundName => {
        gameEngine.sounds[soundName] = createOscillatorSound(soundFrequencies[soundName]);
    });
}

// Create oscillator sound
function createOscillatorSound(frequency) {
    return {
        frequency: frequency,
        duration: 0.2,
        type: 'sine'
    };
}

// Play sound effect
function playSound(soundName, duration = 0.2) {
    if (!gameEngine.audioContext || !window.NeonRoll.appState.soundEnabled) return;
    
    try {
        const oscillator = gameEngine.audioContext.createOscillator();
        const gainNode = gameEngine.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(gameEngine.audioContext.destination);
        
        const sound = gameEngine.sounds[soundName];
        if (sound) {
            oscillator.frequency.setValueAtTime(sound.frequency, gameEngine.audioContext.currentTime);
            oscillator.type = sound.type || 'sine';
        }
        
        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, gameEngine.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, gameEngine.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, gameEngine.audioContext.currentTime + duration);
        
        oscillator.start(gameEngine.audioContext.currentTime);
        oscillator.stop(gameEngine.audioContext.currentTime + duration);
        
    } catch (e) {
        console.warn('Error playing sound:', e);
    }
}

// Setup game timer
function setupGameTimer() {
    updateRollTimer();
    setInterval(() => {
        if (!gameEngine.isRolling) {
            updateRollTimer();
        }
    }, 100); // Update every 100ms for smooth countdown
}

// Update rolling timer
function updateRollTimer() {
    const now = Date.now();
    const timeSinceLastRoll = now - gameEngine.lastRollTime;
    const timeUntilNextRoll = gameEngine.rollInterval - timeSinceLastRoll;
    
    if (timeUntilNextRoll <= 0 && !gameEngine.isRolling) {
        startRoll();
    } else if (timeUntilNextRoll > 0) {
        const seconds = (timeUntilNextRoll / 1000).toFixed(2);
        const rollingIndicator = document.getElementById('rollingIndicator');
        const rollingTimer = document.getElementById('rollingTimer');
        
        if (rollingIndicator && rollingTimer) {
            rollingIndicator.style.display = 'block';
            rollingTimer.textContent = seconds;
        }
    }
}

// Generate initial game history
function generateInitialHistory() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    for (let i = 0; i < 5; i++) {
        gameEngine.gameHistory.push({
            color: colors[Math.floor(Math.random() * colors.length)],
            timestamp: Date.now() - (i + 1) * 15000
        });
    }
    updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
    const gameHistory = document.getElementById('gameHistory');
    if (!gameHistory) return;
    
    gameHistory.innerHTML = '';
    
    // Show last 5 games in reverse order (most recent first)
    const recentGames = gameEngine.gameHistory.slice(-5).reverse();
    recentGames.forEach(game => {
        const dot = document.createElement('div');
        dot.className = `history-dot ${game.color}`;
        gameHistory.appendChild(dot);
    });
}

// Place a bet
function placeBet(color, multiplier, amount) {
    // Validate bet
    if (gameEngine.isRolling) {
        window.NeonRoll.showNotification('Please wait for the current round to finish!');
        return;
    }
    
    if (amount > window.NeonRoll.appState.balance) {
        window.NeonRoll.showNotification('Insufficient balance!');
        return;
    }
    
    if (amount < 1) {
        window.NeonRoll.showNotification('Minimum bet is 1 AI!');
        return;
    }
    
    // Deduct bet amount from balance
    window.NeonRoll.appState.balance -= amount;
    window.NeonRoll.updateBalance();
    
    // Store bet
    gameEngine.currentBet = {
        color: color,
        multiplier: multiplier,
        amount: amount,
        timestamp: Date.now()
    };
    
    // Update tasks (betting progress)
    updateBettingTasks();
    
    // Play bet sound
    playSound(color, 0.3);
    
    // Show game started notification
    window.NeonRoll.showNotification('The game has started');
    
    // Add visual feedback to the bet button
    const betButton = document.querySelector(`.win-btn[data-color="${color}"]`);
    if (betButton) {
        betButton.style.transform = 'scale(0.95)';
        betButton.style.boxShadow = '0 0 40px currentColor';
        setTimeout(() => {
            betButton.style.transform = 'scale(1)';
            betButton.style.boxShadow = '';
        }, 200);
    }
    
    console.log('Bet placed:', gameEngine.currentBet);
}

// Start rolling
function startRoll() {
    if (gameEngine.isRolling) return;
    
    gameEngine.isRolling = true;
    gameEngine.rollStartTime = Date.now();
    
    // Hide rolling indicator
    const rollingIndicator = document.getElementById('rollingIndicator');
    if (rollingIndicator) {
        rollingIndicator.style.display = 'none';
    }
    
    // Play spinning sound
    playSound('spin', 2.0);
    
    // Start grid animation
    animateGrid();
    
    // Determine result after animation
    setTimeout(() => {
        const result = determineResult();
        finishRoll(result);
    }, 2000); // 2 second animation
}

// Animate the game grid
function animateGrid() {
    const gridCells = document.querySelectorAll('.grid-cell');
    
    // Add spinning animation to all cells
    gridCells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add('spinning');
            
            // Remove animation after completion
            setTimeout(() => {
                cell.classList.remove('spinning');
            }, 500);
        }, index * 50); // Stagger the animations
    });
    
    // Create visual rolling effect
    let rollCount = 0;
    const rollAnimation = setInterval(() => {
        if (rollCount >= 10) {
            clearInterval(rollAnimation);
            return;
        }
        
        // Randomly highlight cells
        gridCells.forEach(cell => {
            if (Math.random() > 0.7) {
                cell.style.transform = 'scale(1.1)';
                cell.style.filter = 'brightness(1.5)';
                setTimeout(() => {
                    cell.style.transform = '';
                    cell.style.filter = '';
                }, 100);
            }
        });
        
        rollCount++;
    }, 200);
}

// Determine roll result
function determineResult() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const weights = {
        red: 40,    // 40% chance, x2.2 multiplier
        blue: 40,   // 40% chance, x2.2 multiplier  
        green: 18,  // 18% chance, x5 multiplier
        yellow: 2   // 2% chance, x45 multiplier
    };
    
    // Create weighted array
    let weightedArray = [];
    Object.entries(weights).forEach(([color, weight]) => {
        for (let i = 0; i < weight; i++) {
            weightedArray.push(color);
        }
    });
    
    // Random selection
    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    const winningColor = weightedArray[randomIndex];
    
    return {
        color: winningColor,
        multiplier: getMultiplierForColor(winningColor),
        timestamp: Date.now()
    };
}

// Get multiplier for color
function getMultiplierForColor(color) {
    const multipliers = {
        red: 2.2,
        blue: 2.2,
        green: 5.0,
        yellow: 45.0
    };
    return multipliers[color] || 2.2;
}

// Finish the roll
function finishRoll(result) {
    gameEngine.isRolling = false;
    gameEngine.lastRollTime = Date.now();
    
    // Add to history
    gameEngine.gameHistory.push(result);
    updateHistoryDisplay();
    
    // Highlight winning cell
    highlightWinningCell(result.color);
    
    // Check if player won
    let isWin = false;
    let winAmount = 0;
    
    if (gameEngine.currentBet && gameEngine.currentBet.color === result.color) {
        isWin = true;
        winAmount = gameEngine.currentBet.amount * result.multiplier;
        window.NeonRoll.appState.balance += winAmount;
        window.NeonRoll.updateBalance();
        
        // Play win sound
        playSound('win', 1.0);
        
        // Show win notification
        window.NeonRoll.showNotification(`🎉 You won ${winAmount.toFixed(2)} AI! (${result.multiplier}x)`);
        
        // Win animation
        createWinAnimation();
        
    } else if (gameEngine.currentBet) {
        // Play lose sound
        playSound('lose', 0.5);
        
        // Show lose notification
        window.NeonRoll.showNotification(`😔 You lost! Winning color was ${result.color}`);
    }
    
    // Reset current bet
    gameEngine.currentBet = null;
    
    // Play result sound
    setTimeout(() => {
        playSound(result.color, 0.8);
    }, 500);
    
    console.log('Roll finished:', result, 'Win:', isWin, 'Amount:', winAmount);
}

// Highlight winning cell
function highlightWinningCell(color) {
    const gridCells = document.querySelectorAll('.grid-cell');
    
    // Find cells with the winning color
    const winningCells = Array.from(gridCells).filter(cell => 
        cell.classList.contains(color)
    );
    
    // Highlight winning cells
    winningCells.forEach(cell => {
        cell.style.animation = 'pulse 0.5s ease-in-out 3';
        cell.style.transform = 'scale(1.2)';
        cell.style.filter = 'brightness(1.5) drop-shadow(0 0 20px currentColor)';
        
        // Reset after animation
        setTimeout(() => {
            cell.style.animation = '';
            cell.style.transform = '';
            cell.style.filter = '';
        }, 1500);
    });
}

// Create win animation
function createWinAnimation() {
    // Create floating win particles
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createWinParticle();
        }, i * 100);
    }
}

// Create win particle
function createWinParticle() {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #00ff88, #00f5ff);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.8);
        animation: winParticle 2s ease-out forwards;
    `;
    
    // Random direction
    const angle = Math.random() * 360;
    const distance = 100 + Math.random() * 100;
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    
    particle.style.setProperty('--x', `${x}px`);
    particle.style.setProperty('--y', `${y}px`);
    
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 2000);
}

// Add CSS for win particle animation
const winParticleCSS = `
@keyframes winParticle {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    50% {
        transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0);
        opacity: 0;
    }
}
`;

// Add CSS to document
const styleSheet = document.createElement('style');
styleSheet.textContent = winParticleCSS;
document.head.appendChild(styleSheet);

// Update betting tasks progress
function updateBettingTasks() {
    window.NeonRoll.appState.tasks.bets.forEach(task => {
        task.current = Math.min(task.current + 1, task.target);
        
        // Check if task is completed
        if (task.current === task.target && !task.completed) {
            task.completed = true;
            window.NeonRoll.appState.balance += task.reward;
            window.NeonRoll.updateBalance();
            window.NeonRoll.showNotification(`🎉 Task completed! You earned ${task.reward} AI`);
            playSound('win', 0.5);
        }
    });
}

// Get game statistics
function getGameStats() {
    const totalGames = gameEngine.gameHistory.length;
    const colorCounts = {};
    
    gameEngine.gameHistory.forEach(game => {
        colorCounts[game.color] = (colorCounts[game.color] || 0) + 1;
    });
    
    return {
        totalGames,
        colorCounts,
        lastRoll: gameEngine.gameHistory[gameEngine.gameHistory.length - 1],
        isRolling: gameEngine.isRolling,
        timeUntilNextRoll: Math.max(0, gameEngine.rollInterval - (Date.now() - gameEngine.lastRollTime))
    };
}

// Reset game (for testing)
function resetGame() {
    gameEngine.isRolling = false;
    gameEngine.currentBet = null;
    gameEngine.gameHistory = [];
    gameEngine.lastRollTime = 0;
    
    generateInitialHistory();
    window.NeonRoll.showNotification('Game reset');
}

// Handle tab visibility for audio context
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && gameEngine.audioContext && gameEngine.audioContext.state === 'suspended') {
        gameEngine.audioContext.resume();
    }
});

// Initialize game engine when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameEngine);
} else {
    initGameEngine();
}

// Export functions for global access
window.placeBet = placeBet;
window.gameEngine = gameEngine;
window.getGameStats = getGameStats;
window.resetGame = resetGame;

// Update NeonRoll object with game functions
if (window.NeonRoll) {
    window.NeonRoll.playSound = playSound;
    window.NeonRoll.gameEngine = gameEngine;
    window.NeonRoll.getGameStats = getGameStats;
}

console.log('Game logic loaded successfully');