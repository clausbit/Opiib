"""
🎰 Casino Roll - Game Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import random
import logging

from backend.config import settings, GAME_COLORS

logger = logging.getLogger(__name__)
router = APIRouter()

class BetRequest(BaseModel):
    color: str
    amount: float
    user_id: int

class GameResult(BaseModel):
    success: bool
    result_color: str
    multiplier: float
    win_amount: float
    won: bool
    new_balance: float

class GameHistory(BaseModel):
    games: List[Dict[str, Any]]
    total: int

@router.post("/bet", response_model=GameResult)
async def place_bet(bet: BetRequest):
    """Сделать ставку в рулетке"""
    try:
        # Проверка валидности ставки
        if bet.color not in GAME_COLORS:
            raise HTTPException(status_code=400, detail="Invalid color")
        
        if bet.amount < settings.MIN_BET or bet.amount > settings.MAX_BET:
            raise HTTPException(status_code=400, detail="Invalid bet amount")
        
        # Генерация результата на основе вероятностей
        color_data = GAME_COLORS[bet.color]
        
        # Создаем weighted random для реалистичной рулетки
        colors = list(GAME_COLORS.keys())
        weights = [GAME_COLORS[color]["probability"] for color in colors]
        
        result_color = random.choices(colors, weights=weights)[0]
        
        # Определяем выигрыш
        won = result_color == bet.color
        win_amount = 0.0
        multiplier = color_data["multiplier"]
        
        if won:
            win_amount = bet.amount * multiplier
        
        # Симуляция нового баланса (в реальном приложении обновляем БД)
        new_balance = 100.0 + win_amount - bet.amount
        
        return GameResult(
            success=True,
            result_color=result_color,
            multiplier=multiplier,
            win_amount=win_amount,
            won=won,
            new_balance=new_balance
        )
        
    except Exception as e:
        logger.error(f"Bet error: {e}")
        raise HTTPException(status_code=500, detail="Game error")

@router.get("/history/{user_id}", response_model=GameHistory)
async def get_game_history(user_id: int, limit: int = 20):
    """Получить историю игр пользователя"""
    try:
        # Симуляция истории игр
        games = []
        for i in range(min(limit, 10)):
            colors = list(GAME_COLORS.keys())
            selected_color = random.choice(colors)
            result_color = random.choice(colors)
            won = selected_color == result_color
            
            game = {
                "id": f"game_{i}",
                "selected_color": selected_color,
                "result_color": result_color,
                "bet_amount": random.uniform(1, 50),
                "win_amount": random.uniform(0, 100) if won else 0,
                "won": won,
                "created_at": "2024-01-01T12:00:00Z"
            }
            games.append(game)
        
        return GameHistory(games=games, total=len(games))
        
    except Exception as e:
        logger.error(f"History error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get history")

@router.get("/stats/{user_id}")
async def get_game_stats(user_id: int):
    """Получить статистику игр пользователя"""
    try:
        # Симуляция статистики
        stats = {
            "total_games": 50,
            "total_wagered": 500.0,
            "total_won": 450.0,
            "wins": 25,
            "losses": 25,
            "win_rate": 0.5,
            "profit": -50.0,
            "biggest_win": 225.0,
            "favorite_color": "red"
        }
        
        return {"success": True, "stats": stats}
        
    except Exception as e:
        logger.error(f"Stats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get stats")

@router.get("/colors")
async def get_game_colors():
    """Получить информацию о цветах и множителях"""
    return {
        "success": True,
        "colors": GAME_COLORS
    }

@router.get("/last-results")
async def get_last_results(limit: int = 10):
    """Получить последние результаты игр"""
    try:
        colors = list(GAME_COLORS.keys())
        results = [random.choice(colors) for _ in range(limit)]
        
        return {
            "success": True,
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Last results error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get results")