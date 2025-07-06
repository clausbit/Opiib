"""
🎰 Casino Roll - Configuration Settings
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Настройки приложения"""
    
    # Environment
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DOMAIN: str = "agrobmin.com.ua"
    SSL_CERT_PATH: Optional[str] = "ssl/sertificat.pem"
    SSL_KEY_PATH: Optional[str] = "ssl/sertificat.key"
    
    # Telegram Bot
    TELEGRAM_BOT_TOKEN: str = "7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI"
    TELEGRAM_BOT_USERNAME: str = "@your_casino_bot"
    WEBHOOK_URL: str = "https://agrobmin.com.ua/webhook"
    WEBAPP_URL: str = "https://agrobmin.com.ua"
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017/casino_roll"
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    JWT_SECRET_KEY: str = "your-jwt-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 дней
    
    # Game Settings
    STARTING_BALANCE: float = 100.0
    MIN_BET: float = 1.0
    MAX_BET: float = 1000.0
    HOUSE_EDGE: float = 0.05
    
    # Colors and Multipliers
    RED_MULTIPLIER: float = 2.2
    BLUE_MULTIPLIER: float = 2.2
    GREEN_MULTIPLIER: float = 5.0
    YELLOW_MULTIPLIER: float = 45.0
    
    # Referral System
    LEVEL_1_COMMISSION: float = 0.05
    LEVEL_2_COMMISSION: float = 0.01
    LEVEL_3_COMMISSION: float = 0.01
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600
    
    # Payments
    ENABLE_TELEGRAM_STARS: bool = True
    ENABLE_CRYPTO_PAYMENTS: bool = True
    CRYPTO_API_KEY: Optional[str] = None
    TON_WALLET: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/casino.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Создаем экземпляр настроек
settings = Settings()

# Цвета игры с вероятностями
GAME_COLORS = {
    "red": {
        "name": "Красный",
        "color": "#ff073a",
        "multiplier": settings.RED_MULTIPLIER,
        "probability": 0.4545  # 45.45%
    },
    "blue": {
        "name": "Синий", 
        "color": "#00d4ff",
        "multiplier": settings.BLUE_MULTIPLIER,
        "probability": 0.4545  # 45.45%
    },
    "green": {
        "name": "Зеленый",
        "color": "#39ff14", 
        "multiplier": settings.GREEN_MULTIPLIER,
        "probability": 0.09  # 9%
    },
    "yellow": {
        "name": "Желтый",
        "color": "#ffff00",
        "multiplier": settings.YELLOW_MULTIPLIER,
        "probability": 0.0022  # 0.22%
    }
}

# Telegram Web App цвета
TELEGRAM_THEME = {
    "bg_color": "#0a0a0a",
    "text_color": "#ffffff", 
    "hint_color": "#b0b0b0",
    "link_color": "#00fff0",
    "button_color": "#00fff0",
    "button_text_color": "#ffffff",
    "secondary_bg_color": "#1a1a2e"
}