/**
 * 🎰 Casino Roll - Telegram Integration
 * Domain: agrobmin.com.ua
 */

class TelegramManager {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.user = null;
        this.isReady = false;
        
        this.init();
    }
    
    init() {
        if (!this.tg) {
            console.warn('⚠️ Telegram WebApp API недоступен');
            this.mockTelegramData();
            return;
        }
        
        try {
            // Инициализация Telegram WebApp
            this.tg.ready();
            this.tg.expand();
            
            // Получение данных пользователя
            this.user = this.tg.initDataUnsafe?.user || null;
            
            // Настройка темы
            this.setupTheme();
            
            // Настройка главной кнопки
            this.setupMainButton();
            
            // Настройка обратной кнопки
            this.setupBackButton();
            
            // Настройка haptic feedback
            this.setupHapticFeedback();
            
            // Обработчики событий
            this.setupEventHandlers();
            
            this.isReady = true;
            console.log('📱 Telegram WebApp инициализирован', this.user);
            
        } catch (error) {
            console.error('❌ Ошибка инициализации Telegram WebApp:', error);
            this.mockTelegramData();
        }
    }
    
    setupTheme() {
        if (!this.tg) return;
        
        // Применяем цветовую схему Telegram
        const themeParams = this.tg.themeParams;
        
        if (themeParams) {
            const root = document.documentElement;
            
            // Обновляем CSS переменные под тему Telegram
            if (themeParams.bg_color) {
                root.style.setProperty('--tg-bg-color', themeParams.bg_color);
            }
            
            if (themeParams.text_color) {
                root.style.setProperty('--tg-text-color', themeParams.text_color);
            }
            
            if (themeParams.hint_color) {
                root.style.setProperty('--tg-hint-color', themeParams.hint_color);
            }
            
            if (themeParams.button_color) {
                root.style.setProperty('--tg-button-color', themeParams.button_color);
            }
            
            if (themeParams.button_text_color) {
                root.style.setProperty('--tg-button-text-color', themeParams.button_text_color);
            }
        }
        
        // Устанавливаем viewport высоту
        this.tg.setHeaderColor('#0a0a0a');
        
        console.log('🎨 Тема Telegram применена');
    }
    
    setupMainButton() {
        if (!this.tg) return;
        
        // Скрываем главную кнопку по умолчанию
        this.tg.MainButton.hide();
        
        // Настраиваем стиль
        this.tg.MainButton.setParams({
            color: '#00fff0',
            text_color: '#000000'
        });
    }
    
    setupBackButton() {
        if (!this.tg) return;
        
        // Обработчик кнопки "Назад"
        this.tg.BackButton.onClick(() => {
            this.hapticFeedback('light');
            
            // Логика возврата назад
            if (window.currentTab && window.currentTab !== 'game') {
                window.openTab('game');
            } else {
                this.tg.close();
            }
        });
    }
    
    setupHapticFeedback() {
        // Создаем обертки для haptic feedback
        window.hapticLight = () => this.hapticFeedback('light');
        window.hapticMedium = () => this.hapticFeedback('medium');
        window.hapticHeavy = () => this.hapticFeedback('heavy');
        window.hapticSelection = () => this.hapticFeedback('selection_change');
        window.hapticSuccess = () => this.hapticFeedback('notification_success');
        window.hapticWarning = () => this.hapticFeedback('notification_warning');
        window.hapticError = () => this.hapticFeedback('notification_error');
    }
    
    setupEventHandlers() {
        if (!this.tg) return;
        
        // Обработчик события изменения viewport
        this.tg.onEvent('viewportChanged', () => {
            console.log('📱 Viewport изменен:', this.tg.viewportHeight);
            this.updateViewportHeight();
        });
        
        // Обработчик изменения темы
        this.tg.onEvent('themeChanged', () => {
            console.log('🎨 Тема изменена');
            this.setupTheme();
        });
    }
    
    updateViewportHeight() {
        if (this.tg) {
            const vh = this.tg.viewportHeight / 100;
            document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`);
        }
    }
    
    hapticFeedback(type = 'light') {
        if (!this.tg?.HapticFeedback) return;
        
        try {
            switch (type) {
                case 'light':
                case 'medium':
                case 'heavy':
                    this.tg.HapticFeedback.impactOccurred(type);
                    break;
                    
                case 'selection_change':
                    this.tg.HapticFeedback.selectionChanged();
                    break;
                    
                case 'notification_success':
                case 'notification_warning':
                case 'notification_error':
                    this.tg.HapticFeedback.notificationOccurred(type.replace('notification_', ''));
                    break;
                    
                default:
                    this.tg.HapticFeedback.impactOccurred('light');
            }
        } catch (error) {
            console.error('❌ Ошибка haptic feedback:', error);
        }
    }
    
    showMainButton(text, callback) {
        if (!this.tg) return;
        
        this.tg.MainButton.setParams({
            text: text,
            is_visible: true
        });
        
        this.tg.MainButton.show();
        this.tg.MainButton.onClick(callback);
    }
    
    hideMainButton() {
        if (!this.tg) return;
        
        this.tg.MainButton.hide();
        this.tg.MainButton.offClick();
    }
    
    showBackButton() {
        if (!this.tg) return;
        
        this.tg.BackButton.show();
    }
    
    hideBackButton() {
        if (!this.tg) return;
        
        this.tg.BackButton.hide();
    }
    
    close() {
        if (!this.tg) {
            window.close();
            return;
        }
        
        this.tg.close();
    }
    
    sendData(data) {
        if (!this.tg) {
            console.log('📤 Отправка данных (mock):', data);
            return;
        }
        
        this.tg.sendData(JSON.stringify(data));
    }
    
    openLink(url, options = {}) {
        if (!this.tg) {
            window.open(url, '_blank');
            return;
        }
        
        if (options.tryInstantView) {
            this.tg.openLink(url, { try_instant_view: true });
        } else {
            this.tg.openLink(url);
        }
    }
    
    openTelegramLink(url) {
        if (!this.tg) {
            window.open(url, '_blank');
            return;
        }
        
        this.tg.openTelegramLink(url);
    }
    
    shareUrl(url, text) {
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        this.openTelegramLink(shareUrl);
    }
    
    getUser() {
        return this.user;
    }
    
    getUserId() {
        return this.user?.id || null;
    }
    
    getUserName() {
        return this.user?.first_name || 'Игрок';
    }
    
    getUserFullName() {
        if (!this.user) return 'Игрок';
        
        const firstName = this.user.first_name || '';
        const lastName = this.user.last_name || '';
        
        return `${firstName} ${lastName}`.trim() || 'Игрок';
    }
    
    getUserUsername() {
        return this.user?.username || null;
    }
    
    getUserPhoto() {
        return this.user?.photo_url || '/static/images/default-avatar.png';
    }
    
    getInitData() {
        return this.tg?.initData || '';
    }
    
    getInitDataUnsafe() {
        return this.tg?.initDataUnsafe || {};
    }
    
    isSupported() {
        return !!this.tg;
    }
    
    getVersion() {
        return this.tg?.version || '0.0';
    }
    
    getPlatform() {
        return this.tg?.platform || 'unknown';
    }
    
    isVerticalSwipesEnabled() {
        return this.tg?.isVerticalSwipesEnabled || false;
    }
    
    enableVerticalSwipes() {
        if (this.tg?.enableVerticalSwipes) {
            this.tg.enableVerticalSwipes();
        }
    }
    
    disableVerticalSwipes() {
        if (this.tg?.disableVerticalSwipes) {
            this.tg.disableVerticalSwipes();
        }
    }
    
    mockTelegramData() {
        // Мок данные для разработки вне Telegram
        this.user = {
            id: 123456789,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser',
            language_code: 'ru',
            is_premium: false,
            photo_url: '/static/images/default-avatar.png'
        };
        
        this.isReady = true;
        
        console.log('🧪 Используются мок данные Telegram');
    }
    
    // Утилиты для работы с цветами и темой
    isDarkTheme() {
        if (!this.tg?.colorScheme) return true;
        return this.tg.colorScheme === 'dark';
    }
    
    getColorScheme() {
        return this.tg?.colorScheme || 'dark';
    }
    
    // Проверки совместимости
    supportsHapticFeedback() {
        return !!this.tg?.HapticFeedback;
    }
    
    supportsMainButton() {
        return !!this.tg?.MainButton;
    }
    
    supportsBackButton() {
        return !!this.tg?.BackButton;
    }
    
    // Биометрия (если поддерживается)
    supportsBiometrics() {
        return !!this.tg?.BiometricManager;
    }
    
    initBiometrics() {
        if (!this.supportsBiometrics()) return false;
        
        try {
            this.tg.BiometricManager.init();
            return true;
        } catch (error) {
            console.error('❌ Ошибка инициализации биометрии:', error);
            return false;
        }
    }
}

// Глобальный экземпляр
window.telegramManager = new TelegramManager();

// Вспомогательные функции для быстрого доступа
window.getTelegramUser = () => window.telegramManager.getUser();
window.haptic = (type) => window.telegramManager.hapticFeedback(type);
window.telegramClose = () => window.telegramManager.close();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelegramManager;
}