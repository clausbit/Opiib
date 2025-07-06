#!/usr/bin/env python3.12
"""
🎰 Casino Roll - Main FastAPI Application
Domain: agrobmin.com.ua
Python: 3.12
"""

import asyncio
import logging
import ssl
import uvicorn
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from backend.config import settings
from backend.database import init_database, close_database
from backend.telegram_bot import init_telegram_bot, stop_telegram_bot
from backend.routes import auth, game, user, payment, admin
from backend.middleware import RateLimitMiddleware, SecurityMiddleware
from backend.utils.logger import setup_logger

# Настройка логирования
logger = setup_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    try:
        # Инициализация при запуске
        logger.info("🎰 Запуск Casino Roll...")
        
        # Инициализация базы данных
        await init_database()
        logger.info("✅ База данных подключена")
        
        # Инициализация Telegram бота
        await init_telegram_bot()
        logger.info("✅ Telegram бот инициализирован")
        
        logger.info("🚀 Сервер готов!")
        yield
        
    except Exception as e:
        logger.error(f"❌ Ошибка при запуске: {e}")
        raise
    finally:
        # Очистка при остановке
        logger.info("🔄 Остановка сервера...")
        await stop_telegram_bot()
        await close_database()
        logger.info("✅ Сервер остановлен")

# Создание FastAPI приложения
app = FastAPI(
    title="🎰 Casino Roll",
    description="Telegram Mini App Casino with neon design",
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
    redoc_url="/api/redoc" if settings.DEBUG else None,
    openapi_url="/api/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agrobmin.com.ua",
        "https://t.me",
        "https://web.telegram.org"
    ] + (["http://localhost:3000", "http://127.0.0.1:3000"] if settings.DEBUG else []),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(SecurityMiddleware)

# Статические файлы
app.mount("/static", StaticFiles(directory="static"), name="static")

# Шаблоны
templates = Jinja2Templates(directory="templates")

# API Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(game.router, prefix="/api/game", tags=["Game"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.get("/health")
async def health_check():
    """Проверка здоровья сервера"""
    return {
        "status": "healthy",
        "service": "Casino Roll",
        "domain": "agrobmin.com.ua",
        "version": "1.0.0",
        "python": "3.12"
    }

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Главная страница Telegram Mini App"""
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "domain": settings.DOMAIN,
            "webapp_url": settings.WEBAPP_URL,
            "bot_username": settings.TELEGRAM_BOT_USERNAME
        }
    )

@app.post("/webhook")
async def telegram_webhook(request: Request):
    """Webhook для Telegram бота"""
    try:
        from backend.telegram_bot import process_telegram_update
        
        json_data = await request.json()
        await process_telegram_update(json_data)
        
        return {"ok": True}
    except Exception as e:
        logger.error(f"Ошибка в webhook: {e}")
        raise HTTPException(status_code=500, detail="Webhook error")

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """Обработчик 404 ошибок"""
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "API endpoint not found"}
        )
    
    # Для Telegram Mini App перенаправляем на главную
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "domain": settings.DOMAIN,
            "webapp_url": settings.WEBAPP_URL,
            "bot_username": settings.TELEGRAM_BOT_USERNAME
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    """Обработчик внутренних ошибок"""
    logger.error(f"Internal server error: {exc}")
    
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": "Internal server error"}
        )
    
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "error": "Internal server error"},
        status_code=500
    )

def create_ssl_context():
    """Создание SSL контекста"""
    if not settings.SSL_CERT_PATH or not settings.SSL_KEY_PATH:
        return None
    
    cert_path = Path(settings.SSL_CERT_PATH)
    key_path = Path(settings.SSL_KEY_PATH)
    
    if not cert_path.exists() or not key_path.exists():
        logger.warning(f"SSL сертификаты не найдены: {cert_path}, {key_path}")
        return None
    
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(cert_path, key_path)
    
    return ssl_context

async def main():
    """Основная функция запуска"""
    ssl_context = create_ssl_context()
    
    config = uvicorn.Config(
        app=app,
        host=settings.HOST,
        port=settings.PORT,
        ssl_keyfile=settings.SSL_KEY_PATH if ssl_context else None,
        ssl_certfile=settings.SSL_CERT_PATH if ssl_context else None,
        log_level="info" if settings.DEBUG else "warning",
        access_log=settings.DEBUG,
        reload=settings.DEBUG,
        workers=1 if settings.DEBUG else 4
    )
    
    server = uvicorn.Server(config)
    
    logger.info(f"🎰 Casino Roll запускается на https://{settings.DOMAIN}")
    logger.info(f"🤖 Telegram Bot: {settings.TELEGRAM_BOT_USERNAME}")
    logger.info(f"🔗 Webhook: {settings.WEBHOOK_URL}")
    
    await server.serve()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("👋 Остановка по Ctrl+C")
    except Exception as e:
        logger.error(f"❌ Критическая ошибка: {e}")
        raise