"""
🎰 Casino Roll - Security Middleware
Безопасность и защита приложения
"""

import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from backend.config import settings
from backend.utils.logger import setup_logger, log_security, log_performance

logger = setup_logger(__name__)

class SecurityMiddleware(BaseHTTPMiddleware):
    """Middleware для обеспечения безопасности"""
    
    def __init__(self, app):
        super().__init__(app)
        
    async def dispatch(self, request: Request, call_next):
        """Основная логика middleware"""
        
        start_time = time.time()
        
        # Проверки безопасности
        if not self._security_checks(request):
            return Response(
                content="Forbidden",
                status_code=403,
                headers=self._get_security_headers()
            )
        
        # Выполняем запрос
        response = await call_next(request)
        
        # Добавляем заголовки безопасности
        self._add_security_headers(response)
        
        # Логируем производительность
        duration = time.time() - start_time
        log_performance(request.url.path, duration, response.status_code)
        
        return response
    
    def _security_checks(self, request: Request) -> bool:
        """Выполняет проверки безопасности"""
        
        # Проверка User-Agent
        if not self._validate_user_agent(request):
            log_security("suspicious_user_agent", details=f"UA: {request.headers.get('user-agent', 'None')}")
            return False
        
        # Проверка размера запроса
        if not self._validate_request_size(request):
            log_security("large_request", details=f"Content-Length: {request.headers.get('content-length', 'Unknown')}")
            return False
        
        # Проверка подозрительных заголовков
        if not self._validate_headers(request):
            log_security("suspicious_headers", details=f"Headers: {dict(request.headers)}")
            return False
        
        # Проверка пути на инъекции
        if not self._validate_path(request):
            log_security("path_injection", details=f"Path: {request.url.path}")
            return False
        
        return True
    
    def _validate_user_agent(self, request: Request) -> bool:
        """Проверяет User-Agent"""
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Блокируем очевидных ботов
        blocked_agents = [
            "crawler", "spider", "bot", "scraper",
            "scanner", "curl", "wget", "python-requests"
        ]
        
        # Разрешаем только для API endpoints
        if request.url.path.startswith("/api/"):
            return True
        
        # Для веб-интерфейса требуем браузерный User-Agent
        if not user_agent:
            return False
        
        for blocked in blocked_agents:
            if blocked in user_agent:
                return False
        
        return True
    
    def _validate_request_size(self, request: Request) -> bool:
        """Проверяет размер запроса"""
        content_length = request.headers.get("content-length")
        
        if content_length:
            try:
                size = int(content_length)
                # Ограничиваем размер до 10MB
                if size > 10 * 1024 * 1024:
                    return False
            except ValueError:
                return False
        
        return True
    
    def _validate_headers(self, request: Request) -> bool:
        """Проверяет подозрительные заголовки"""
        
        # Проверяем на XSS в заголовках
        dangerous_patterns = [
            "<script", "javascript:", "vbscript:", "onload=",
            "onerror=", "onclick=", "<iframe", "eval("
        ]
        
        for header_name, header_value in request.headers.items():
            header_value_lower = header_value.lower()
            
            for pattern in dangerous_patterns:
                if pattern in header_value_lower:
                    return False
        
        return True
    
    def _validate_path(self, request: Request) -> bool:
        """Проверяет путь на инъекции"""
        path = request.url.path.lower()
        
        # SQL injection patterns
        sql_patterns = [
            "union select", "drop table", "insert into",
            "update set", "delete from", "create table",
            "alter table", "exec(", "execute(",
            "sp_", "xp_", "@@version"
        ]
        
        # Path traversal patterns
        traversal_patterns = [
            "../", "..\\", "..%2f", "..%5c",
            "%2e%2e%2f", "%2e%2e%5c"
        ]
        
        # Проверяем SQL инъекции
        for pattern in sql_patterns:
            if pattern in path:
                return False
        
        # Проверяем path traversal
        for pattern in traversal_patterns:
            if pattern in path:
                return False
        
        return True
    
    def _get_security_headers(self) -> dict:
        """Возвращает базовые заголовки безопасности"""
        return {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Content-Security-Policy": "default-src 'self'",
        }
    
    def _add_security_headers(self, response: Response):
        """Добавляет заголовки безопасности к ответу"""
        
        # Основные заголовки безопасности
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",  # Разрешаем для Telegram
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "X-Download-Options": "noopen",
            "X-Permitted-Cross-Domain-Policies": "none",
        }
        
        # Content Security Policy для Telegram Mini App
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://telegram.org",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://api.telegram.org",
            "frame-ancestors https://web.telegram.org",
            "media-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]
        
        security_headers["Content-Security-Policy"] = "; ".join(csp_directives)
        
        # HTTPS заголовки (только в production)
        if settings.ENVIRONMENT == "production":
            security_headers.update({
                "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
                "Expect-CT": 'max-age=86400, enforce, report-uri="https://agrobmin.com.ua/ct-report"'
            })
        
        # Применяем заголовки
        for header, value in security_headers.items():
            response.headers[header] = value
        
        # Убираем информацию о сервере
        if "server" in response.headers:
            del response.headers["server"]
        
        # Добавляем кастомный заголовок
        response.headers["X-Powered-By"] = "Casino Roll"