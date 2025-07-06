"""
🎰 Casino Roll - User Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class UserProfile(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    balance: float
    total_wagered: float
    total_won: float
    games_played: int
    wins: int
    losses: int

class BalanceUpdate(BaseModel):
    user_id: int
    amount: float

@router.get("/profile/{user_id}", response_model=UserProfile)
async def get_user_profile(user_id: int):
    """Получить профиль пользователя"""
    try:
        # Симуляция профиля пользователя
        profile = UserProfile(
            id=user_id,
            first_name="Demo",
            last_name="User",
            username="demo_user",
            balance=100.0,
            total_wagered=500.0,
            total_won=450.0,
            games_played=50,
            wins=25,
            losses=25
        )
        
        return profile
        
    except Exception as e:
        logger.error(f"Profile error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get profile")

@router.get("/balance/{user_id}")
async def get_user_balance(user_id: int):
    """Получить баланс пользователя"""
    try:
        # Симуляция баланса
        balance = 100.0
        
        return {
            "success": True,
            "balance": balance,
            "currency": "AI"
        }
        
    except Exception as e:
        logger.error(f"Balance error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get balance")

@router.post("/balance/update")
async def update_balance(update: BalanceUpdate):
    """Обновить баланс пользователя"""
    try:
        # В реальном приложении здесь обновление БД
        new_balance = 100.0 + update.amount
        
        return {
            "success": True,
            "new_balance": new_balance,
            "message": "Balance updated successfully"
        }
        
    except Exception as e:
        logger.error(f"Balance update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update balance")

@router.get("/referral/{user_id}")
async def get_referral_info(user_id: int):
    """Получить реферальную информацию"""
    try:
        referral_info = {
            "referral_code": "ABC123",
            "referrals_count": 5,
            "referral_earnings": 25.0,
            "referral_link": f"https://t.me/your_casino_bot?start=ref_ABC123",
            "commission_rates": {
                "level_1": 0.05,
                "level_2": 0.01,
                "level_3": 0.01
            }
        }
        
        return {
            "success": True,
            "referral": referral_info
        }
        
    except Exception as e:
        logger.error(f"Referral error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get referral info")

@router.get("/achievements/{user_id}")
async def get_user_achievements(user_id: int):
    """Получить достижения пользователя"""
    try:
        achievements = [
            {
                "id": "first_win",
                "name": "Первая победа",
                "description": "Выиграйте свою первую игру",
                "unlocked": True,
                "reward": 10.0
            },
            {
                "id": "big_winner",
                "name": "Крупный выигрыш",
                "description": "Выиграйте более 100 AI за одну игру",
                "unlocked": False,
                "reward": 50.0
            }
        ]
        
        return {
            "success": True,
            "achievements": achievements
        }
        
    except Exception as e:
        logger.error(f"Achievements error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get achievements")

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10):
    """Получить таблицу лидеров"""
    try:
        leaderboard = []
        for i in range(1, limit + 1):
            leader = {
                "rank": i,
                "user_id": f"user_{i}",
                "name": f"Player {i}",
                "total_won": 1000 - (i * 50),
                "games_played": 100 - (i * 5)
            }
            leaderboard.append(leader)
        
        return {
            "success": True,
            "leaderboard": leaderboard
        }
        
    except Exception as e:
        logger.error(f"Leaderboard error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get leaderboard")