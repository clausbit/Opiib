"""
🎰 Casino Roll - Database Module
MongoDB connection and models
"""

import asyncio
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo import IndexModel, ASCENDING, DESCENDING
import logging

from backend.config import settings

logger = logging.getLogger(__name__)

# Глобальные переменные для подключения
client: Optional[AsyncIOMotorClient] = None
database: Optional[AsyncIOMotorDatabase] = None

async def init_database():
    """Инициализация подключения к MongoDB"""
    global client, database
    
    try:
        # Создаем подключение
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        
        # Проверяем подключение
        await client.admin.command('ping')
        
        # Получаем базу данных
        database = client.get_database()
        
        # Создаем индексы
        await create_indexes()
        
        logger.info("✅ MongoDB подключена успешно")
        
    except Exception as e:
        logger.error(f"❌ Ошибка подключения к MongoDB: {e}")
        raise

async def close_database():
    """Закрытие подключения к MongoDB"""
    global client
    
    if client:
        client.close()
        logger.info("✅ MongoDB подключение закрыто")

async def create_indexes():
    """Создание индексов для коллекций"""
    
    # Индексы для пользователей
    await database.users.create_indexes([
        IndexModel([("telegram_id", ASCENDING)], unique=True),
        IndexModel([("username", ASCENDING)]),
        IndexModel([("referral_code", ASCENDING)], unique=True),
        IndexModel([("referred_by", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)])
    ])
    
    # Индексы для игр
    await database.games.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
        IndexModel([("bet_amount", DESCENDING)]),
        IndexModel([("result_color", ASCENDING)]),
        IndexModel([("won", ASCENDING)])
    ])
    
    # Индексы для транзакций
    await database.transactions.create_indexes([
        IndexModel([("user_id", ASCENDING)]),
        IndexModel([("type", ASCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
        IndexModel([("transaction_id", ASCENDING)], unique=True)
    ])
    
    # Индексы для рефералов
    await database.referrals.create_indexes([
        IndexModel([("referrer_id", ASCENDING)]),
        IndexModel([("referred_id", ASCENDING)]),
        IndexModel([("level", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)])
    ])
    
    logger.info("✅ Индексы созданы")

class UserModel:
    """Модель пользователя"""
    
    @staticmethod
    async def create_user(telegram_data: Dict[str, Any]) -> Dict[str, Any]:
        """Создание нового пользователя"""
        import secrets
        
        user_data = {
            "telegram_id": telegram_data["id"],
            "username": telegram_data.get("username", ""),
            "first_name": telegram_data.get("first_name", ""),
            "last_name": telegram_data.get("last_name", ""),
            "photo_url": telegram_data.get("photo_url", ""),
            "language_code": telegram_data.get("language_code", "en"),
            "is_premium": telegram_data.get("is_premium", False),
            "balance": settings.STARTING_BALANCE,
            "total_wagered": 0.0,
            "total_won": 0.0,
            "games_played": 0,
            "wins": 0,
            "losses": 0,
            "referral_code": secrets.token_urlsafe(8),
            "referred_by": None,
            "referral_earnings": 0.0,
            "is_active": True,
            "is_admin": False,
            "created_at": datetime.utcnow(),
            "last_active": datetime.utcnow()
        }
        
        result = await database.users.insert_one(user_data)
        user_data["_id"] = result.inserted_id
        
        return user_data
    
    @staticmethod
    async def get_user_by_telegram_id(telegram_id: int) -> Optional[Dict[str, Any]]:
        """Получение пользователя по Telegram ID"""
        return await database.users.find_one({"telegram_id": telegram_id})
    
    @staticmethod
    async def update_user(telegram_id: int, update_data: Dict[str, Any]) -> bool:
        """Обновление данных пользователя"""
        update_data["last_active"] = datetime.utcnow()
        
        result = await database.users.update_one(
            {"telegram_id": telegram_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    async def update_balance(telegram_id: int, amount: float) -> bool:
        """Обновление баланса пользователя"""
        result = await database.users.update_one(
            {"telegram_id": telegram_id},
            {"$inc": {"balance": amount}}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    async def get_user_by_referral_code(referral_code: str) -> Optional[Dict[str, Any]]:
        """Получение пользователя по реферальному коду"""
        return await database.users.find_one({"referral_code": referral_code})

class GameModel:
    """Модель игры"""
    
    @staticmethod
    async def create_game(user_id: int, bet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Создание новой игры"""
        game_data = {
            "user_id": user_id,
            "bet_amount": bet_data["amount"],
            "selected_color": bet_data["color"],
            "result_color": bet_data["result"],
            "multiplier": bet_data["multiplier"],
            "win_amount": bet_data.get("win_amount", 0.0),
            "won": bet_data["won"],
            "house_edge": settings.HOUSE_EDGE,
            "created_at": datetime.utcnow()
        }
        
        result = await database.games.insert_one(game_data)
        game_data["_id"] = result.inserted_id
        
        return game_data
    
    @staticmethod
    async def get_user_games(user_id: int, limit: int = 20) -> List[Dict[str, Any]]:
        """Получение игр пользователя"""
        cursor = database.games.find(
            {"user_id": user_id}
        ).sort("created_at", DESCENDING).limit(limit)
        
        return await cursor.to_list(length=limit)
    
    @staticmethod
    async def get_game_stats(user_id: int) -> Dict[str, Any]:
        """Получение статистики игр пользователя"""
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$group": {
                "_id": None,
                "total_games": {"$sum": 1},
                "total_wagered": {"$sum": "$bet_amount"},
                "total_won": {"$sum": "$win_amount"},
                "wins": {"$sum": {"$cond": ["$won", 1, 0]}},
                "losses": {"$sum": {"$cond": ["$won", 0, 1]}}
            }}
        ]
        
        result = await database.games.aggregate(pipeline).to_list(length=1)
        
        if result:
            stats = result[0]
            stats["win_rate"] = stats["wins"] / stats["total_games"] if stats["total_games"] > 0 else 0
            stats["profit"] = stats["total_won"] - stats["total_wagered"]
            return stats
        
        return {
            "total_games": 0,
            "total_wagered": 0.0,
            "total_won": 0.0,
            "wins": 0,
            "losses": 0,
            "win_rate": 0.0,
            "profit": 0.0
        }

class TransactionModel:
    """Модель транзакций"""
    
    @staticmethod
    async def create_transaction(transaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Создание новой транзакции"""
        import uuid
        
        transaction_data.update({
            "transaction_id": str(uuid.uuid4()),
            "status": "pending",
            "created_at": datetime.utcnow()
        })
        
        result = await database.transactions.insert_one(transaction_data)
        transaction_data["_id"] = result.inserted_id
        
        return transaction_data
    
    @staticmethod
    async def update_transaction_status(transaction_id: str, status: str, **kwargs) -> bool:
        """Обновление статуса транзакции"""
        update_data = {"status": status, "updated_at": datetime.utcnow()}
        update_data.update(kwargs)
        
        result = await database.transactions.update_one(
            {"transaction_id": transaction_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    async def get_user_transactions(user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Получение транзакций пользователя"""
        cursor = database.transactions.find(
            {"user_id": user_id}
        ).sort("created_at", DESCENDING).limit(limit)
        
        return await cursor.to_list(length=limit)

class ReferralModel:
    """Модель рефералов"""
    
    @staticmethod
    async def create_referral(referrer_id: int, referred_id: int, level: int = 1) -> Dict[str, Any]:
        """Создание реферальной связи"""
        referral_data = {
            "referrer_id": referrer_id,
            "referred_id": referred_id,
            "level": level,
            "commission_earned": 0.0,
            "is_active": True,
            "created_at": datetime.utcnow()
        }
        
        result = await database.referrals.insert_one(referral_data)
        referral_data["_id"] = result.inserted_id
        
        return referral_data
    
    @staticmethod
    async def get_user_referrals(user_id: int) -> List[Dict[str, Any]]:
        """Получение рефералов пользователя"""
        cursor = database.referrals.find({"referrer_id": user_id})
        return await cursor.to_list(length=None)
    
    @staticmethod
    async def add_commission(referrer_id: int, amount: float) -> bool:
        """Добавление комиссии рефереру"""
        # Обновляем баланс пользователя
        await UserModel.update_balance(referrer_id, amount)
        
        # Обновляем реферальную статистику
        result = await database.users.update_one(
            {"telegram_id": referrer_id},
            {"$inc": {"referral_earnings": amount}}
        )
        
        return result.modified_count > 0

# Функции-хелперы для получения экземпляров моделей
def get_user_model() -> UserModel:
    return UserModel()

def get_game_model() -> GameModel:
    return GameModel()

def get_transaction_model() -> TransactionModel:
    return TransactionModel()

def get_referral_model() -> ReferralModel:
    return ReferralModel()