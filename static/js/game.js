/**
 * 🎰 Casino Roll - Game Logic
 * Domain: agrobmin.com.ua
 */

class GameManager {
    constructor() {
        this.selectedColor = null;
        this.betAmount = 5;
        this.isSpinning = false;
        this.userBalance = 100;
        this.gameHistory = [];
        this.lastResults = [];
        
        this.colors = {
            red: { multiplier: 2.2, probability: 0.4545 },
            blue: { multiplier: 2.2, probability: 0.4545 },
            green: { multiplier: 5.0, probability: 0.09 },
            yellow: { multiplier: 45.0, probability: 0.0022 }
        };
        
        this.init();
    }
    
    init() {
        this.loadGameData();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('🎮 Game Manager инициализирован');
    }
    
    loadGameData() {
        // Загружаем данные из localStorage
        const savedBalance = localStorage.getItem('casino_balance');
        const savedHistory = localStorage.getItem('casino_history');
        const savedResults = localStorage.getItem('casino_last_results');
        
        if (savedBalance) {
            this.userBalance = parseFloat(savedBalance);
        }
        
        if (savedHistory) {
            try {
                this.gameHistory = JSON.parse(savedHistory);
            } catch (e) {
                this.gameHistory = [];
            }
        }
        
        if (savedResults) {
            try {
                this.lastResults = JSON.parse(savedResults);
            } catch (e) {
                this.lastResults = [];
            }
        }
    }
    
    saveGameData() {
        localStorage.setItem('casino_balance', this.userBalance.toString());
        localStorage.setItem('casino_history', JSON.stringify(this.gameHistory));
        localStorage.setItem('casino_last_results', JSON.stringify(this.lastResults));
    }
    
    setupEventListeners() {
        // Обработчики для управления ставкой
        const betInput = document.getElementById('bet-amount');
        if (betInput) {
            betInput.addEventListener('input', (e) => {
                this.setBetAmount(parseFloat(e.target.value) || 1);
            });
        }
        
        // Обработчики для кнопок быстрых ставок
        document.querySelectorAll('.quick-bet').forEach(btn => {
            btn.addEventListener('click', () => {
                soundManager.playClick();
                haptic('light');
            });
        });
        
        // Обработчики для выбора цвета
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', () => {
                const color = option.dataset.color;
                this.selectColor(color);
            });
        });
        
        // Обработчик кнопки размещения ставки
        const placeBetBtn = document.getElementById('place-bet-btn');
        if (placeBetBtn) {
            placeBetBtn.addEventListener('click', () => {
                this.placeBet();
            });
        }
    }
    
    selectColor(color) {
        if (this.isSpinning) return;
        
        // Звуковой эффект
        soundManager.playColorSelect(color);
        haptic('selection_change');
        
        // Убираем выделение с предыдущего цвета
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Выделяем выбранный цвет
        const selectedOption = document.querySelector(`[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        this.selectedColor = color;
        this.updateUI();
        
        console.log(`🎨 Выбран цвет: ${color}`);
    }
    
    setBetAmount(amount) {
        if (this.isSpinning) return;
        
        // Ограничиваем ставку в пределах баланса и лимитов
        const minBet = 1;
        const maxBet = Math.min(1000, this.userBalance);
        
        this.betAmount = Math.max(minBet, Math.min(maxBet, amount));
        
        // Обновляем поле ввода
        const betInput = document.getElementById('bet-amount');
        if (betInput) {
            betInput.value = this.betAmount;
        }
        
        // Звуковой эффект
        soundManager.playBetChange();
        
        this.updateUI();
    }
    
    increaseBet() {
        if (this.isSpinning) return;
        
        const newAmount = this.betAmount + 1;
        this.setBetAmount(newAmount);
        
        haptic('light');
    }
    
    decreaseBet() {
        if (this.isSpinning) return;
        
        const newAmount = this.betAmount - 1;
        this.setBetAmount(newAmount);
        
        haptic('light');
    }
    
    async placeBet() {
        if (this.isSpinning) {
            showToast('Подождите окончания текущей игры', 'warning');
            return;
        }
        
        if (!this.selectedColor) {
            showToast('Выберите цвет для ставки', 'warning');
            haptic('warning');
            return;
        }
        
        if (this.betAmount > this.userBalance) {
            showToast('Недостаточно средств', 'error');
            haptic('error');
            return;
        }
        
        if (this.betAmount < 1) {
            showToast('Минимальная ставка: 1 AI', 'warning');
            haptic('warning');
            return;
        }
        
        try {
            // Начинаем игру
            this.isSpinning = true;
            this.updateUI();
            
            // Списываем ставку
            this.userBalance -= this.betAmount;
            
            // Звук вращения
            soundManager.playRouletteSpinStart();
            haptic('medium');
            
            // Анимация рулетки
            await this.animateRoulette();
            
            // Определяем результат
            const result = this.generateGameResult();
            
            // Обрабатываем результат
            await this.processGameResult(result);
            
        } catch (error) {
            console.error('❌ Ошибка при размещении ставки:', error);
            showToast('Произошла ошибка игры', 'error');
            haptic('error');
            
            // Возвращаем ставку
            this.userBalance += this.betAmount;
        } finally {
            this.isSpinning = false;
            this.updateUI();
        }
    }
    
    generateGameResult() {
        // Генерируем результат на основе вероятностей
        const random = Math.random();
        let cumulative = 0;
        
        for (const [color, data] of Object.entries(this.colors)) {
            cumulative += data.probability;
            if (random <= cumulative) {
                return {
                    color: color,
                    selectedColor: this.selectedColor,
                    betAmount: this.betAmount,
                    multiplier: data.multiplier,
                    won: color === this.selectedColor,
                    winAmount: color === this.selectedColor ? this.betAmount * data.multiplier : 0,
                    timestamp: Date.now()
                };
            }
        }
        
        // Fallback на красный
        return {
            color: 'red',
            selectedColor: this.selectedColor,
            betAmount: this.betAmount,
            multiplier: this.colors.red.multiplier,
            won: 'red' === this.selectedColor,
            winAmount: 'red' === this.selectedColor ? this.betAmount * this.colors.red.multiplier : 0,
            timestamp: Date.now()
        };
    }
    
    async animateRoulette() {
        const wheel = document.querySelector('.wheel-segments');
        const status = document.getElementById('game-status');
        
        if (!wheel) return;
        
        // Обновляем статус
        if (status) {
            status.textContent = 'Крутим рулетку...';
        }
        
        // Добавляем класс анимации
        wheel.style.animation = 'wheelSpin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Ждем завершения анимации
        await new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
        
        // Убираем анимацию
        wheel.style.animation = 'wheelIdle 4s ease-in-out infinite';
    }
    
    async processGameResult(result) {
        const status = document.getElementById('game-status');
        
        // Обновляем статус
        if (status) {
            status.textContent = `Результат: ${this.getColorName(result.color)}`;
        }
        
        // Добавляем результат в историю
        this.addToHistory(result);
        this.addToLastResults(result.color);
        
        if (result.won) {
            // Выигрыш
            this.userBalance += result.winAmount;
            
            // Звук выигрыша
            soundManager.playWin(result.winAmount);
            haptic('success');
            
            // Показываем уведомление о выигрыше
            this.showWinNotification(result.winAmount);
            
            showToast(`Выигрыш: +${result.winAmount.toFixed(2)} AI`, 'success');
            
        } else {
            // Проигрыш
            soundManager.playLose();
            haptic('error');
            
            showToast(`Проигрыш: -${result.betAmount.toFixed(2)} AI`, 'error');
        }
        
        // Сохраняем данные
        this.saveGameData();
        
        // Отправляем результат на сервер (если доступен)
        try {
            await this.sendGameResult(result);
        } catch (error) {
            console.warn('⚠️ Не удалось отправить результат на сервер:', error);
        }
        
        // Обновляем UI
        this.updateUI();
        
        console.log('🎲 Результат игры:', result);
    }
    
    async sendGameResult(result) {
        // Отправляем результат на сервер для синхронизации
        const response = await fetch('/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
            },
            body: JSON.stringify({
                color: result.selectedColor,
                amount: result.betAmount,
                result: result.color,
                won: result.won,
                winAmount: result.winAmount,
                timestamp: result.timestamp
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // Синхронизируем баланс с сервером
                this.userBalance = data.user.balance;
                this.updateUI();
            }
        }
    }
    
    addToHistory(result) {
        // Добавляем игру в историю (максимум 50 записей)
        this.gameHistory.unshift(result);
        this.gameHistory = this.gameHistory.slice(0, 50);
        
        this.updateHistoryUI();
    }
    
    addToLastResults(color) {
        // Добавляем результат в последние (максимум 10)
        this.lastResults.unshift(color);
        this.lastResults = this.lastResults.slice(0, 10);
        
        this.updateLastResultsUI();
    }
    
    updateUI() {
        this.updateBalance();
        this.updatePotentialWin();
        this.updatePlaceBetButton();
        this.updateGameStatus();
    }
    
    updateBalance() {
        const balanceElement = document.getElementById('balance-amount');
        if (balanceElement) {
            balanceElement.textContent = `${this.userBalance.toFixed(2)} AI`;
        }
    }
    
    updatePotentialWin() {
        const potentialWinElement = document.getElementById('potential-win');
        if (potentialWinElement && this.selectedColor) {
            const multiplier = this.colors[this.selectedColor].multiplier;
            const potentialWin = this.betAmount * multiplier;
            
            const span = potentialWinElement.querySelector('span');
            if (span) {
                span.textContent = `${potentialWin.toFixed(2)} AI`;
            }
        }
    }
    
    updatePlaceBetButton() {
        const placeBetBtn = document.getElementById('place-bet-btn');
        if (!placeBetBtn) return;
        
        const btnText = placeBetBtn.querySelector('.btn-text');
        
        if (this.isSpinning) {
            placeBetBtn.disabled = true;
            if (btnText) btnText.textContent = 'Вращение...';
        } else if (!this.selectedColor) {
            placeBetBtn.disabled = true;
            if (btnText) btnText.textContent = 'Выберите цвет';
        } else if (this.betAmount > this.userBalance) {
            placeBetBtn.disabled = true;
            if (btnText) btnText.textContent = 'Недостаточно средств';
        } else {
            placeBetBtn.disabled = false;
            if (btnText) btnText.textContent = `Ставка ${this.betAmount} AI`;
        }
    }
    
    updateGameStatus() {
        const statusElement = document.getElementById('game-status');
        if (!statusElement) return;
        
        if (this.isSpinning) {
            statusElement.textContent = 'Крутим рулетку...';
        } else if (!this.selectedColor) {
            statusElement.textContent = 'Выберите цвет!';
        } else {
            statusElement.textContent = 'Сделайте ставку!';
        }
    }
    
    updateHistoryUI() {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        if (this.gameHistory.length === 0) {
            historyList.innerHTML = '<div class="no-history">История пуста</div>';
            return;
        }
        
        historyList.innerHTML = this.gameHistory.slice(0, 10).map(game => {
            const time = new Date(game.timestamp).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="history-item">
                    <div class="history-bet">
                        <div class="history-color ${game.color}"></div>
                        <span class="history-amount">${game.betAmount} AI</span>
                        <span class="history-time">${time}</span>
                    </div>
                    <div class="history-result ${game.won ? 'win' : 'lose'}">
                        ${game.won ? `+${game.winAmount.toFixed(1)}` : `-${game.betAmount}`} AI
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateLastResultsUI() {
        const resultsContainer = document.getElementById('last-results');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = this.lastResults.map(color => 
            `<div class="result-circle ${color}"></div>`
        ).join('');
    }
    
    showWinNotification(amount) {
        const notification = document.getElementById('win-notification');
        const winAmountElement = document.getElementById('win-amount');
        
        if (notification && winAmountElement) {
            winAmountElement.textContent = `+${amount.toFixed(2)} AI`;
            
            notification.classList.add('show');
            
            // Создаем конфетти
            this.createConfetti();
            
            // Скрываем через 3 секунды
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    createConfetti() {
        const colors = ['#00fff0', '#b300ff', '#ff0080', '#39ff14', '#00d4ff', '#ff073a'];
        const confettiContainer = document.querySelector('.confetti');
        
        if (!confettiContainer) return;
        
        // Очищаем предыдущие конфетти
        confettiContainer.innerHTML = '';
        
        // Создаем частицы конфетти
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.opacity = '0.8';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s ease-out forwards`;
            
            confettiContainer.appendChild(confetti);
            
            // Удаляем после анимации
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }
    }
    
    getColorName(color) {
        const names = {
            red: 'Красный',
            blue: 'Синий',
            green: 'Зеленый',
            yellow: 'Желтый'
        };
        return names[color] || color;
    }
    
    refreshHistory() {
        haptic('light');
        soundManager.playClick();
        
        // Обновляем отображение истории
        this.updateHistoryUI();
        this.updateLastResultsUI();
        
        // Показываем уведомление
        showToast('История обновлена', 'success');
    }
    
    // Методы для внешнего управления игрой
    getBalance() {
        return this.userBalance;
    }
    
    setBalance(amount) {
        this.userBalance = amount;
        this.updateBalance();
        this.saveGameData();
    }
    
    addBalance(amount) {
        this.userBalance += amount;
        this.updateBalance();
        this.saveGameData();
    }
    
    getGameStats() {
        const totalGames = this.gameHistory.length;
        const wins = this.gameHistory.filter(game => game.won).length;
        const totalWagered = this.gameHistory.reduce((sum, game) => sum + game.betAmount, 0);
        const totalWon = this.gameHistory.reduce((sum, game) => sum + game.winAmount, 0);
        
        return {
            totalGames,
            wins,
            losses: totalGames - wins,
            winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
            totalWagered,
            totalWon,
            profit: totalWon - totalWagered
        };
    }
    
    clearHistory() {
        this.gameHistory = [];
        this.lastResults = [];
        this.saveGameData();
        this.updateHistoryUI();
        this.updateLastResultsUI();
    }
}

// Глобальные функции для использования в HTML
window.selectColor = (color) => window.gameManager.selectColor(color);
window.setBetAmount = (amount) => window.gameManager.setBetAmount(amount);
window.increaseBet = () => window.gameManager.increaseBet();
window.decreaseBet = () => window.gameManager.decreaseBet();
window.placeBet = () => window.gameManager.placeBet();
window.refreshHistory = () => window.gameManager.refreshHistory();

// Создаем глобальный экземпляр
window.gameManager = new GameManager();

// Добавляем анимацию конфетти в CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
@keyframes confettiFall {
    0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(400px) rotate(720deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(confettiStyle);

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}