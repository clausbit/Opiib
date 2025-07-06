/**
 * 🎰 Casino Roll - Main Application
 * Domain: agrobmin.com.ua
 */

class CasinoApp {
    constructor() {
        this.isInitialized = false;
        this.loadingProgress = 0;
        this.currentTab = 'game';
        this.user = null;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('🎰 Инициализация Casino Roll...');
            
            // Показываем экран загрузки
            this.showLoadingScreen();
            
            // Инициализируем компоненты пошагово
            await this.initializeComponents();
            
            // Загружаем пользовательские данные
            await this.loadUserData();
            
            // Настраиваем UI
            this.setupUI();
            
            // Скрываем экран загрузки и показываем приложение
            await this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('🎉 Casino Roll инициализирован успешно!');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            this.showError('Ошибка загрузки приложения');
        }
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (app) app.style.display = 'none';
        
        // Анимация прогресса
        this.animateProgress();
    }
    
    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        // Завершаем прогресс
        this.updateProgress(100);
        
        // Ждем немного для завершения анимации
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Плавно скрываем загрузочный экран
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (app) {
                    app.style.display = 'block';
                    app.style.opacity = '0';
                    setTimeout(() => {
                        app.style.opacity = '1';
                    }, 50);
                }
            }, 300);
        }
    }
    
    animateProgress() {
        const progressSteps = [
            { progress: 10, text: 'Загрузка Telegram SDK...' },
            { progress: 25, text: 'Инициализация звуков...' },
            { progress: 40, text: 'Подключение к серверу...' },
            { progress: 60, text: 'Загрузка игровых данных...' },
            { progress: 80, text: 'Настройка интерфейса...' },
            { progress: 95, text: 'Финализация...' }
        ];
        
        let currentStep = 0;
        
        const updateStep = () => {
            if (currentStep < progressSteps.length) {
                const step = progressSteps[currentStep];
                this.updateProgress(step.progress, step.text);
                currentStep++;
                setTimeout(updateStep, 500 + Math.random() * 500);
            }
        };
        
        updateStep();
    }
    
    updateProgress(percent, text) {
        const progressFill = document.querySelector('.progress-fill');
        const loadingText = document.querySelector('.loading-text');
        
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        
        if (loadingText && text) {
            loadingText.textContent = text;
        }
        
        this.loadingProgress = percent;
    }
    
    async initializeComponents() {
        // Шаг 1: Telegram WebApp
        this.updateProgress(10, 'Инициализация Telegram...');
        await this.waitForTelegram();
        
        // Шаг 2: Звуки
        this.updateProgress(25, 'Настройка звуков...');
        await this.waitForSoundManager();
        
        // Шаг 3: Игровой движок
        this.updateProgress(40, 'Загрузка игры...');
        await this.waitForGameManager();
        
        // Шаг 4: API подключение
        this.updateProgress(60, 'Подключение к серверу...');
        await this.initializeAPI();
        
        // Шаг 5: UI компоненты
        this.updateProgress(80, 'Настройка интерфейса...');
        await this.initializeUI();
    }
    
    async waitForTelegram() {
        return new Promise(resolve => {
            const checkTelegram = () => {
                if (window.telegramManager && window.telegramManager.isReady) {
                    resolve();
                } else {
                    setTimeout(checkTelegram, 100);
                }
            };
            checkTelegram();
        });
    }
    
    async waitForSoundManager() {
        return new Promise(resolve => {
            const checkSoundManager = () => {
                if (window.soundManager && window.soundManager.initialized) {
                    resolve();
                } else {
                    setTimeout(checkSoundManager, 100);
                }
            };
            checkSoundManager();
        });
    }
    
    async waitForGameManager() {
        return new Promise(resolve => {
            const checkGameManager = () => {
                if (window.gameManager) {
                    resolve();
                } else {
                    setTimeout(checkGameManager, 100);
                }
            };
            checkGameManager();
        });
    }
    
    async initializeAPI() {
        try {
            // Проверяем подключение к серверу
            const response = await fetch('/health');
            if (response.ok) {
                console.log('✅ Сервер доступен');
            } else {
                console.warn('⚠️ Сервер недоступен, работаем в офлайн режиме');
            }
        } catch (error) {
            console.warn('⚠️ Не удалось подключиться к серверу:', error);
        }
    }
    
    async initializeUI() {
        // Инициализация UI компонентов
        this.setupNavigation();
        this.setupToastSystem();
        this.setupGlobalFunctions();
        
        // Добавляем обработчики событий
        this.addEventListeners();
    }
    
    async loadUserData() {
        try {
            // Получаем данные пользователя из Telegram
            this.user = window.telegramManager.getUser();
            
            if (this.user) {
                // Обновляем UI с данными пользователя
                this.updateUserUI();
                
                // Загружаем аватар пользователя
                await this.loadUserAvatar();
                
                // Аутентификация на сервере
                await this.authenticateUser();
            }
            
        } catch (error) {
            console.error('❌ Ошибка загрузки пользовательских данных:', error);
        }
    }
    
    updateUserUI() {
        if (!this.user) return;
        
        // Обновляем имя пользователя
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = window.telegramManager.getUserFullName();
        }
        
        // Обновляем ID пользователя
        const userIdElement = document.getElementById('user-id');
        if (userIdElement) {
            userIdElement.textContent = `ID: ${this.user.id}`;
        }
    }
    
    async loadUserAvatar() {
        if (!this.user) return;
        
        try {
            // Пытаемся получить аватар через Telegram API
            const photoUrl = await window.telegramManager.getUserPhoto();
            
            const userPhotoElement = document.getElementById('user-photo');
            if (userPhotoElement && photoUrl) {
                userPhotoElement.src = photoUrl;
                userPhotoElement.onerror = () => {
                    userPhotoElement.src = '/static/images/default-avatar.png';
                };
            }
            
        } catch (error) {
            console.warn('⚠️ Не удалось загрузить аватар пользователя:', error);
        }
    }
    
    async authenticateUser() {
        if (!this.user) return;
        
        try {
            const initData = window.telegramManager.getInitData();
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    initData: initData,
                    user: this.user
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.success) {
                    // Сохраняем токен
                    localStorage.setItem('auth_token', data.token);
                    
                    // Обновляем баланс пользователя
                    if (data.user && data.user.balance !== undefined) {
                        window.gameManager.setBalance(data.user.balance);
                    }
                    
                    console.log('✅ Пользователь аутентифицирован');
                } else {
                    console.warn('⚠️ Ошибка аутентификации:', data.message);
                }
            }
            
        } catch (error) {
            console.warn('⚠️ Не удалось аутентифицироваться:', error);
        }
    }
    
    setupUI() {
        // Настраиваем начальное состояние UI
        this.openTab('game');
        
        // Добавляем обработчики для кнопок депозита/вывода
        this.setupDepositWithdrawButtons();
        
        // Настраиваем адаптивность
        this.setupResponsiveLayout();
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.getAttribute('onclick')?.match(/openTab\('(.+?)'\)/)?.[1];
                if (tab) {
                    this.openTab(tab);
                }
            });
        });
    }
    
    setupToastSystem() {
        // Создаем функцию для показа уведомлений
        window.showToast = (message, type = 'info', duration = 3000) => {
            this.showToast(message, type, duration);
        };
    }
    
    setupGlobalFunctions() {
        // Функции для навигации
        window.openTab = (tab) => this.openTab(tab);
        window.openDeposit = () => this.openDeposit();
        window.openWithdraw = () => this.openWithdraw();
        
        // Текущая вкладка
        window.currentTab = this.currentTab;
    }
    
    addEventListeners() {
        // Обработчик для предотвращения случайного закрытия
        window.addEventListener('beforeunload', (e) => {
            if (window.gameManager && window.gameManager.isSpinning) {
                e.preventDefault();
                e.returnValue = 'Игра еще не завершена. Вы уверены что хотите уйти?';
                return e.returnValue;
            }
        });
        
        // Обработчик изменения ориентации
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupResponsiveLayout();
            }, 100);
        });
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            this.setupResponsiveLayout();
        });
    }
    
    setupDepositWithdrawButtons() {
        // Временные заглушки для кнопок
        window.openDeposit = () => {
            this.showToast('Функция пополнения скоро будет доступна', 'info');
            window.haptic('light');
        };
        
        window.openWithdraw = () => {
            this.showToast('Функция вывода скоро будет доступна', 'info');
            window.haptic('light');
        };
    }
    
    setupResponsiveLayout() {
        // Настройка адаптивного макета
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Обновляем высоту Telegram WebApp
        if (window.telegramManager && window.telegramManager.tg) {
            window.telegramManager.updateViewportHeight();
        }
    }
    
    openTab(tabName) {
        // Звуковой эффект
        window.soundManager.playClick();
        window.haptic('light');
        
        // Обновляем активную вкладку навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Находим и активируем нужную вкладку
        const targetNavItem = Array.from(document.querySelectorAll('.nav-item')).find(item => {
            const onclick = item.getAttribute('onclick');
            return onclick && onclick.includes(`'${tabName}'`);
        });
        
        if (targetNavItem) {
            targetNavItem.classList.add('active');
        }
        
        // Сохраняем текущую вкладку
        this.currentTab = tabName;
        window.currentTab = tabName;
        
        // Показываем/скрываем кнопку "Назад" в Telegram
        if (tabName === 'game') {
            window.telegramManager.hideBackButton();
        } else {
            window.telegramManager.showBackButton();
        }
        
        // Здесь можно добавить логику для переключения контента вкладок
        this.handleTabChange(tabName);
        
        console.log(`📱 Переключено на вкладку: ${tabName}`);
    }
    
    handleTabChange(tabName) {
        // Логика переключения контента (пока заглушка)
        switch (tabName) {
            case 'game':
                // Основная игра уже загружена
                break;
                
            case 'stats':
                this.showStatsTab();
                break;
                
            case 'friends':
                this.showFriendsTab();
                break;
                
            case 'tasks':
                this.showTasksTab();
                break;
                
            case 'profile':
                this.showProfileTab();
                break;
                
            default:
                console.warn(`Неизвестная вкладка: ${tabName}`);
        }
    }
    
    showStatsTab() {
        // Заглушка для статистики
        this.showToast('Статистика скоро будет доступна', 'info');
    }
    
    showFriendsTab() {
        // Заглушка для друзей
        this.showToast('Реферальная система скоро будет доступна', 'info');
    }
    
    showTasksTab() {
        // Заглушка для заданий
        this.showToast('Задания скоро будут доступны', 'info');
    }
    
    showProfileTab() {
        // Заглушка для профиля
        this.showToast('Профиль скоро будет доступен', 'info');
    }
    
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        // Создаем элемент уведомления
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        // Добавляем в контейнер
        container.appendChild(toast);
        
        // Показываем с анимацией
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Звуковое уведомление
        window.soundManager.playNotification(type);
        
        // Убираем через заданное время
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    showError(message) {
        console.error('🚨 Критическая ошибка:', message);
        
        // Показываем ошибку пользователю
        const errorHtml = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 7, 58, 0.1);
                border: 2px solid #ff073a;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                color: #ffffff;
                z-index: 10000;
                max-width: 300px;
            ">
                <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">Ошибка</div>
                <div style="font-size: 14px; opacity: 0.8;">${message}</div>
                <button onclick="location.reload()" style="
                    margin-top: 16px;
                    padding: 8px 16px;
                    background: #ff073a;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Перезагрузить</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHtml);
    }
    
    // Методы для внешнего использования
    getUser() {
        return this.user;
    }
    
    getCurrentTab() {
        return this.currentTab;
    }
    
    isReady() {
        return this.isInitialized;
    }
}

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.casinoApp = new CasinoApp();
});

// Глобальная функция для проверки готовности приложения
window.waitForApp = () => {
    return new Promise(resolve => {
        const checkApp = () => {
            if (window.casinoApp && window.casinoApp.isReady()) {
                resolve(window.casinoApp);
            } else {
                setTimeout(checkApp, 100);
            }
        };
        checkApp();
    });
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CasinoApp;
}