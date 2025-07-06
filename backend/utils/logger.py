"""
🎰 Casino Roll - Logging Module
Advanced logging setup for FastAPI application
"""

import logging
import logging.handlers
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, Any

from backend.config import settings

class ColoredFormatter(logging.Formatter):
    """Цветной форматтер для консольного вывода"""
    
    # Цветовые коды ANSI
    COLORS = {
        'DEBUG': '\033[0;36m',    # Cyan
        'INFO': '\033[0;32m',     # Green
        'WARNING': '\033[0;33m',  # Yellow
        'ERROR': '\033[0;31m',    # Red
        'CRITICAL': '\033[0;35m', # Magenta
        'RESET': '\033[0m'        # Reset
    }
    
    def format(self, record):
        # Добавляем цвет к уровню логирования
        level_color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        record.levelname = f"{level_color}{record.levelname}{self.COLORS['RESET']}"
        
        # Добавляем эмодзи для разных уровней
        emoji_map = {
            'DEBUG': '🔍',
            'INFO': '📘',
            'WARNING': '⚠️',
            'ERROR': '❌',
            'CRITICAL': '🚨'
        }
        
        emoji = emoji_map.get(record.levelname.strip('\033[0;36m\033[0;32m\033[0;33m\033[0;31m\033[0;35m\033[0m'), '📝')
        record.emoji = emoji
        
        return super().format(record)

class CasinoLogger:
    """Основной класс для логирования Casino Roll"""
    
    def __init__(self):
        self.loggers: Dict[str, logging.Logger] = {}
        self.setup_main_logger()
    
    def setup_main_logger(self):
        """Настройка основного логгера"""
        
        # Создаем директорию для логов
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        # Основной логгер
        logger = logging.getLogger("casino_roll")
        logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
        
        # Убираем существующие хендлеры
        logger.handlers.clear()
        
        # Консольный хендлер с цветами
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        
        console_format = ColoredFormatter(
            '%(emoji)s %(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%H:%M:%S'
        )
        console_handler.setFormatter(console_format)
        
        # Файловый хендлер
        file_handler = logging.handlers.RotatingFileHandler(
            settings.LOG_FILE,
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        file_handler.setLevel(logging.DEBUG)
        
        file_format = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(file_format)
        
        # Добавляем хендлеры
        logger.addHandler(console_handler)
        logger.addHandler(file_handler)
        
        # Отдельный хендлер для ошибок
        error_handler = logging.handlers.RotatingFileHandler(
            "logs/errors.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=3,
            encoding='utf-8'
        )
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(file_format)
        logger.addHandler(error_handler)
        
        # Хендлер для игровых событий
        game_handler = logging.handlers.RotatingFileHandler(
            "logs/games.log",
            maxBytes=10 * 1024 * 1024,
            backupCount=10,
            encoding='utf-8'
        )
        game_handler.setLevel(logging.INFO)
        
        game_format = logging.Formatter(
            '%(asctime)s - GAME - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        game_handler.setFormatter(game_format)
        
        # Создаем отдельный логгер для игр
        game_logger = logging.getLogger("casino_roll.game")
        game_logger.setLevel(logging.INFO)
        game_logger.addHandler(game_handler)
        game_logger.propagate = False  # Не передавать в основной логгер
        
        self.loggers["main"] = logger
        self.loggers["game"] = game_logger
        
        # Устанавливаем уровень для сторонних библиотек
        logging.getLogger("uvicorn").setLevel(logging.WARNING)
        logging.getLogger("fastapi").setLevel(logging.WARNING)
        logging.getLogger("httpx").setLevel(logging.WARNING)
        
        logger.info("🚀 Система логирования инициализирована")
    
    def get_logger(self, name: str = "main") -> logging.Logger:
        """Получение логгера по имени"""
        return self.loggers.get(name, self.loggers["main"])
    
    def log_game_event(self, user_id: int, event: str, data: Dict[str, Any]):
        """Логирование игровых событий"""
        game_logger = self.get_logger("game")
        
        log_data = {
            "user_id": user_id,
            "event": event,
            "timestamp": datetime.utcnow().isoformat(),
            **data
        }
        
        # Форматируем данные для чтения
        formatted_data = " | ".join([f"{k}={v}" for k, v in log_data.items()])
        game_logger.info(formatted_data)
    
    def log_payment_event(self, user_id: int, transaction_type: str, amount: float, method: str, status: str):
        """Логирование платежных событий"""
        logger = self.get_logger("main")
        
        logger.info(
            f"💳 PAYMENT: user_id={user_id} | type={transaction_type} | "
            f"amount={amount} | method={method} | status={status}"
        )
    
    def log_security_event(self, event_type: str, user_id: int = None, details: str = ""):
        """Логирование событий безопасности"""
        logger = self.get_logger("main")
        
        user_info = f"user_id={user_id}" if user_id else "anonymous"
        logger.warning(f"🔐 SECURITY: {event_type} | {user_info} | {details}")
    
    def log_performance_metrics(self, endpoint: str, duration: float, status_code: int):
        """Логирование метрик производительности"""
        logger = self.get_logger("main")
        
        if duration > 1.0:  # Логируем только медленные запросы
            logger.warning(
                f"⏱️ SLOW_REQUEST: endpoint={endpoint} | "
                f"duration={duration:.2f}s | status={status_code}"
            )

# Глобальный экземпляр логгера
casino_logger = CasinoLogger()

def setup_logger(name: str = __name__) -> logging.Logger:
    """Функция для получения логгера в модулях"""
    return logging.getLogger(f"casino_roll.{name}")

# Функции для быстрого доступа к специальным логам
def log_game(user_id: int, event: str, **data):
    """Быстрое логирование игровых событий"""
    casino_logger.log_game_event(user_id, event, data)

def log_payment(user_id: int, transaction_type: str, amount: float, method: str, status: str):
    """Быстрое логирование платежей"""
    casino_logger.log_payment_event(user_id, transaction_type, amount, method, status)

def log_security(event_type: str, user_id: int = None, details: str = ""):
    """Быстрое логирование безопасности"""
    casino_logger.log_security_event(event_type, user_id, details)

def log_performance(endpoint: str, duration: float, status_code: int):
    """Быстрое логирование производительности"""
    casino_logger.log_performance_metrics(endpoint, duration, status_code)