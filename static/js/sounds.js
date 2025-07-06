/**
 * 🎰 Casino Roll - Sound Manager
 * Domain: agrobmin.com.ua
 */

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.7;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        try {
            // Инициализация звуков
            this.sounds = {
                spin: document.getElementById('sound-spin'),
                win: document.getElementById('sound-win'),
                lose: document.getElementById('sound-lose'),
                click: document.getElementById('sound-click')
            };
            
            // Настройка громкости
            Object.values(this.sounds).forEach(sound => {
                if (sound) {
                    sound.volume = this.volume;
                    sound.preload = 'auto';
                }
            });
            
            // Получение настроек из localStorage
            const savedEnabled = localStorage.getItem('casino_sounds_enabled');
            const savedVolume = localStorage.getItem('casino_sounds_volume');
            
            if (savedEnabled !== null) {
                this.enabled = JSON.parse(savedEnabled);
            }
            
            if (savedVolume !== null) {
                this.volume = parseFloat(savedVolume);
                this.setVolume(this.volume);
            }
            
            this.initialized = true;
            console.log('🔊 Sound Manager инициализирован');
            
        } catch (error) {
            console.error('❌ Ошибка инициализации звуков:', error);
        }
    }
    
    async play(soundName, options = {}) {
        if (!this.enabled || !this.initialized) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`⚠️ Звук "${soundName}" не найден`);
            return;
        }
        
        try {
            // Останавливаем текущее воспроизведение
            sound.currentTime = 0;
            
            // Применяем опции
            if (options.volume !== undefined) {
                sound.volume = Math.min(1, Math.max(0, options.volume * this.volume));
            }
            
            if (options.loop !== undefined) {
                sound.loop = options.loop;
            }
            
            // Воспроизводим
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                await playPromise;
            }
            
        } catch (error) {
            // Автовоспроизведение заблокировано браузером
            if (error.name === 'NotAllowedError') {
                console.log('🔇 Автовоспроизведение заблокировано браузером');
                this.waitForUserInteraction();
            } else {
                console.error(`❌ Ошибка воспроизведения звука "${soundName}":`, error);
            }
        }
    }
    
    stop(soundName) {
        const sound = this.sounds[soundName];
        if (sound && !sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
    
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && !sound.paused) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }
    
    setVolume(volume) {
        this.volume = Math.min(1, Math.max(0, volume));
        
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
            }
        });
        
        localStorage.setItem('casino_sounds_volume', this.volume.toString());
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('casino_sounds_enabled', JSON.stringify(this.enabled));
        
        if (!this.enabled) {
            this.stopAll();
        }
        
        return this.enabled;
    }
    
    enable() {
        this.enabled = true;
        localStorage.setItem('casino_sounds_enabled', 'true');
    }
    
    disable() {
        this.enabled = false;
        this.stopAll();
        localStorage.setItem('casino_sounds_enabled', 'false');
    }
    
    isEnabled() {
        return this.enabled;
    }
    
    waitForUserInteraction() {
        // Ждем первого взаимодействия пользователя для разблокировки звуков
        const enableAudio = () => {
            // Пробуем воспроизвести тихий звук
            Object.values(this.sounds).forEach(sound => {
                if (sound) {
                    const originalVolume = sound.volume;
                    sound.volume = 0.01;
                    sound.play().then(() => {
                        sound.pause();
                        sound.currentTime = 0;
                        sound.volume = originalVolume;
                    }).catch(() => {});
                }
            });
            
            // Убираем обработчики
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
            
            console.log('🔊 Звуки разблокированы');
        };
        
        document.addEventListener('touchstart', enableAudio, { once: true });
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
    }
    
    // Специальные методы для игровых событий
    playClick() {
        this.play('click', { volume: 0.3 });
    }
    
    playRouletteSpinStart() {
        this.play('spin', { volume: 0.8, loop: false });
    }
    
    playWin(amount = 0) {
        // Разная громкость в зависимости от суммы выигрыша
        let volume = 0.7;
        if (amount > 100) volume = 0.9;
        if (amount > 500) volume = 1.0;
        
        this.play('win', { volume });
    }
    
    playLose() {
        this.play('lose', { volume: 0.5 });
    }
    
    // Создание динамических звуковых эффектов
    createBeep(frequency = 800, duration = 200) {
        if (!this.enabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
            
        } catch (error) {
            console.error('❌ Ошибка создания beep:', error);
        }
    }
    
    // Эффект для выбора цвета
    playColorSelect(color) {
        const frequencies = {
            red: 440,
            blue: 523,
            green: 659,
            yellow: 784
        };
        
        const frequency = frequencies[color] || 440;
        this.createBeep(frequency, 150);
    }
    
    // Звуковой эффект для изменения ставки
    playBetChange() {
        this.createBeep(1000, 100);
    }
    
    // Эффект для уведомлений
    playNotification(type = 'info') {
        const frequencies = {
            success: [523, 659, 784],
            error: [330, 277, 220],
            warning: [440, 440, 440],
            info: [523, 659]
        };
        
        const notes = frequencies[type] || frequencies.info;
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 150);
            }, index * 100);
        });
    }
}

// Глобальный экземпляр
window.soundManager = new SoundManager();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}