"""
🎰 Casino Roll - Authentication Routes
"""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging

from backend.config import settings
from backend.database import UserModel

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    telegram_data: str
    
class LoginResponse(BaseModel):
    success: bool
    token: str
    user: Dict[str, Any]

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Авторизация пользователя через Telegram"""
    try:
        # В реальном приложении здесь должна быть проверка Telegram данных
        # Для демонстрации возвращаем успешный ответ
        
        # Создаем фиктивного пользователя для демонстрации
        user_data = {
            "id": 123456789,
            "first_name": "Demo",
            "last_name": "User",
            "username": "demo_user",
            "balance": 100.0
        }
        
        return LoginResponse(
            success=True,
            token="demo_token_123",
            user=user_data
        )
        
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=400, detail="Authentication failed")

@router.post("/verify")
async def verify_token():
    """Проверка токена авторизации"""
    return {"success": True, "valid": True}

@router.post("/logout")
async def logout():
    """Выход из системы"""
    return {"success": True, "message": "Logged out successfully"}