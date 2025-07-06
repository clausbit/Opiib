"""
🎰 Casino Roll - Admin Routes
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()

class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_games: int
    total_revenue: float
    total_payouts: float

class UserManagement(BaseModel):
    user_id: int
    action: str  # ban, unban, adjust_balance
    value: Optional[float] = None

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats():
    """Получить административную статистику"""
    try:
        # Симуляция статистики
        stats = AdminStats(
            total_users=1000,
            active_users=150,
            total_games=5000,
            total_revenue=50000.0,
            total_payouts=45000.0
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Admin stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

@router.get("/users")
async def get_users_list(page: int = 1, limit: int = 50):
    """Получить список пользователей"""
    try:
        # Симуляция списка пользователей
        users = []
        for i in range(1, min(limit + 1, 11)):
            user = {
                "id": i,
                "telegram_id": 123456789 + i,
                "first_name": f"User{i}",
                "username": f"user{i}",
                "balance": 100.0 + (i * 10),
                "games_played": i * 5,
                "is_active": True,
                "created_at": "2024-01-01T12:00:00Z"
            }
            users.append(user)
        
        return {
            "success": True,
            "users": users,
            "total": 1000,
            "page": page,
            "pages": 20
        }
        
    except Exception as e:
        logger.error(f"Users list error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get users")

@router.post("/user/manage")
async def manage_user(request: UserManagement):
    """Управление пользователем"""
    try:
        if request.action == "ban":
            # Заблокировать пользователя
            return {
                "success": True,
                "message": f"User {request.user_id} has been banned"
            }
        elif request.action == "unban":
            # Разблокировать пользователя
            return {
                "success": True,
                "message": f"User {request.user_id} has been unbanned"
            }
        elif request.action == "adjust_balance":
            # Изменить баланс
            return {
                "success": True,
                "message": f"Balance adjusted by {request.value} for user {request.user_id}"
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
            
    except Exception as e:
        logger.error(f"User management error: {e}")
        raise HTTPException(status_code=500, detail="Failed to manage user")

@router.get("/games")
async def get_games_list(page: int = 1, limit: int = 50):
    """Получить список игр"""
    try:
        # Симуляция списка игр
        games = []
        colors = ["red", "blue", "green", "yellow"]
        
        for i in range(1, min(limit + 1, 11)):
            game = {
                "id": f"game_{i}",
                "user_id": 123456789 + (i % 10),
                "bet_amount": 10.0 + (i * 5),
                "selected_color": colors[i % 4],
                "result_color": colors[(i + 1) % 4],
                "won": i % 3 == 0,
                "win_amount": (10.0 + (i * 5)) * 2.2 if i % 3 == 0 else 0,
                "created_at": "2024-01-01T12:00:00Z"
            }
            games.append(game)
        
        return {
            "success": True,
            "games": games,
            "total": 5000,
            "page": page,
            "pages": 100
        }
        
    except Exception as e:
        logger.error(f"Games list error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get games")

@router.get("/transactions")
async def get_transactions_list(page: int = 1, limit: int = 50):
    """Получить список транзакций"""
    try:
        # Симуляция списка транзакций
        transactions = []
        
        for i in range(1, min(limit + 1, 11)):
            transaction = {
                "id": f"tx_{i}",
                "user_id": 123456789 + (i % 10),
                "type": "deposit" if i % 2 == 0 else "withdrawal",
                "amount": 50.0 + (i * 10),
                "method": "telegram_stars" if i % 2 == 0 else "crypto",
                "status": "completed" if i % 3 != 0 else "pending",
                "created_at": "2024-01-01T12:00:00Z"
            }
            transactions.append(transaction)
        
        return {
            "success": True,
            "transactions": transactions,
            "total": 2000,
            "page": page,
            "pages": 40
        }
        
    except Exception as e:
        logger.error(f"Transactions list error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get transactions")

@router.get("/analytics")
async def get_analytics():
    """Получить аналитику"""
    try:
        analytics = {
            "revenue_by_day": [
                {"date": "2024-01-01", "revenue": 1000.0},
                {"date": "2024-01-02", "revenue": 1200.0},
                {"date": "2024-01-03", "revenue": 800.0},
                {"date": "2024-01-04", "revenue": 1500.0},
                {"date": "2024-01-05", "revenue": 1100.0}
            ],
            "games_by_color": [
                {"color": "red", "count": 2000, "revenue": 20000.0},
                {"color": "blue", "count": 1800, "revenue": 18000.0},
                {"color": "green", "count": 800, "revenue": 12000.0},
                {"color": "yellow", "count": 100, "revenue": 5000.0}
            ],
            "user_activity": [
                {"hour": 0, "active_users": 10},
                {"hour": 6, "active_users": 5},
                {"hour": 12, "active_users": 50},
                {"hour": 18, "active_users": 80},
                {"hour": 21, "active_users": 100}
            ]
        }
        
        return {
            "success": True,
            "analytics": analytics
        }
        
    except Exception as e:
        logger.error(f"Analytics error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

@router.post("/config/update")
async def update_config(config: Dict[str, Any]):
    """Обновить конфигурацию"""
    try:
        # Обновление конфигурации
        return {
            "success": True,
            "message": "Configuration updated successfully",
            "updated_keys": list(config.keys())
        }
        
    except Exception as e:
        logger.error(f"Config update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update config")

@router.get("/logs")
async def get_system_logs(level: str = "INFO", limit: int = 100):
    """Получить системные логи"""
    try:
        # Симуляция логов
        logs = []
        levels = ["INFO", "WARNING", "ERROR"]
        
        for i in range(min(limit, 10)):
            log = {
                "timestamp": "2024-01-01T12:00:00Z",
                "level": levels[i % 3],
                "message": f"Log message {i}",
                "module": "backend.main"
            }
            logs.append(log)
        
        return {
            "success": True,
            "logs": logs,
            "total": 1000
        }
        
    except Exception as e:
        logger.error(f"Logs error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get logs")