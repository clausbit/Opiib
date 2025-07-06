"""
🎰 Casino Roll - Rate Limiting Middleware
Защита от спама и DDoS атак
"""

import time
from collections import defaultdict
from typing import Dict, Tuple
from fastapi import Request, Response, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware

from backend.config import settings
from backend.utils.logger import setup_logger, log_security

logger = setup_logger(__name__)

class RateLimiter:
    """Класс для ограничения частоты запросов"""
    
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> Tuple[bool, int]:
        """
        Проверяет, разрешен ли запрос
        
        Returns:
            Tuple[bool, int]: (разрешен ли запрос, оставшееся время до сброса)
        """
        now = time.time()
        
        # Очищаем старые запросы
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window_seconds
        ]
        
        # Проверяем лимит
        if len(self.requests[identifier]) >= self.max_requests:
            # Вычисляем время до сброса
            oldest_request = min(self.requests[identifier])
            reset_time = int(oldest_request + self.window_seconds - now)
            return False, max(0, reset_time)
        
        # Добавляем текущий запрос
        self.requests[identifier].append(now)
        return True, 0
    
    def get_stats(self, identifier: str) -> Dict[str, int]:
        """Получить статистику для идентификатора"""
        now = time.time()
        
        # Очищаем старые запросы
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window_seconds
        ]
        
        return {
            "requests_count": len(self.requests[identifier]),
            "requests_limit": self.max_requests,
            "window_seconds": self.window_seconds
        }

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware для ограничения частоты запросов"""
    
    def __init__(self, app):
        super().__init__(app)
        
        # Различные лимиты для разных типов запросов
        self.limiters = {
            "general": RateLimiter(
                max_requests=settings.RATE_LIMIT_REQUESTS,
                window_seconds=settings.RATE_LIMIT_WINDOW
            ),
            "auth": RateLimiter(
                max_requests=10,   # 10 попыток авторизации в час
                window_seconds=3600
            ),
            "game": RateLimiter(
                max_requests=100,  # 100 игр в час
                window_seconds=3600
            ),
            "payment": RateLimiter(
                max_requests=20,   # 20 транзакций в час
                window_seconds=3600
            )
        }
    
    async def dispatch(self, request: Request, call_next):
        """Основная логика middleware"""
        
        # Пропускаем статические файлы и health check
        if self._should_skip_rate_limit(request):
            return await call_next(request)
        
        # Получаем идентификатор клиента
        client_id = self._get_client_identifier(request)
        
        # Определяем тип запроса и соответствующий лимитер
        limiter_type = self._get_limiter_type(request)
        limiter = self.limiters[limiter_type]
        
        # Проверяем лимит
        is_allowed, reset_time = limiter.is_allowed(client_id)
        
        if not is_allowed:
            # Логируем превышение лимита
            log_security(
                "rate_limit_exceeded",
                details=f"type={limiter_type} client={client_id} path={request.url.path}"
            )
            
            logger.warning(f"🚫 Rate limit exceeded: {client_id} ({limiter_type})")
            
            # Возвращаем ошибку 429
            headers = {
                "Retry-After": str(reset_time),
                "X-RateLimit-Limit": str(limiter.max_requests),
                "X-RateLimit-Remaining": "0",
                "X-RateLimit-Reset": str(int(time.time()) + reset_time)
            }
            
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Try again in {reset_time} seconds.",
                    "retry_after": reset_time
                },
                headers=headers
            )
        
        # Выполняем запрос
        response = await call_next(request)
        
        # Добавляем заголовки с информацией о лимитах
        stats = limiter.get_stats(client_id)
        response.headers["X-RateLimit-Limit"] = str(stats["requests_limit"])
        response.headers["X-RateLimit-Remaining"] = str(
            stats["requests_limit"] - stats["requests_count"]
        )
        response.headers["X-RateLimit-Reset"] = str(
            int(time.time()) + stats["window_seconds"]
        )
        
        return response
    
    def _should_skip_rate_limit(self, request: Request) -> bool:
        """Определяет, нужно ли пропустить rate limiting"""
        path = request.url.path
        
        # Пропускаем статические файлы
        if path.startswith(("/static/", "/favicon.ico", "/robots.txt")):
            return True
        
        # Пропускаем health check
        if path in ("/health", "/ping"):
            return True
        
        # Пропускаем OPTIONS запросы
        if request.method == "OPTIONS":
            return True
        
        return False
    
    def _get_client_identifier(self, request: Request) -> str:
        """Получает идентификатор клиента для rate limiting"""
        
        # Приоритет: User ID > IP адрес
        
        # Пытаемся получить User ID из заголовков (если авторизован)
        user_id = None
        if "authorization" in request.headers:
            try:
                # Здесь можно добавить декодирование JWT токена
                # для получения user_id, пока используем IP
                pass
            except:
                pass
        
        if user_id:
            return f"user:{user_id}"
        
        # Используем IP адрес
        client_ip = self._get_client_ip(request)
        return f"ip:{client_ip}"
    
    def _get_client_ip(self, request: Request) -> str:
        """Получает реальный IP адрес клиента"""
        
        # Проверяем заголовки прокси
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Берем первый IP (реальный клиент)
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback на прямое подключение
        if request.client and request.client.host:
            return request.client.host
        
        return "unknown"
    
    def _get_limiter_type(self, request: Request) -> str:
        """Определяет тип лимитера на основе пути запроса"""
        path = request.url.path
        
        if path.startswith("/api/auth/"):
            return "auth"
        elif path.startswith("/api/game/"):
            return "game"
        elif path.startswith("/api/payment/"):
            return "payment"
        else:
            return "general"
    
    def get_rate_limit_stats(self) -> Dict[str, Dict]:
        """Получить статистику по всем лимитерам (для админки)"""
        stats = {}
        
        for limiter_type, limiter in self.limiters.items():
            total_clients = len(limiter.requests)
            active_clients = len([
                client for client, requests in limiter.requests.items()
                if len(requests) > 0
            ])
            
            stats[limiter_type] = {
                "max_requests": limiter.max_requests,
                "window_seconds": limiter.window_seconds,
                "total_clients": total_clients,
                "active_clients": active_clients
            }
        
        return stats