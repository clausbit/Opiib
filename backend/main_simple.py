#!/usr/bin/env python3.12
"""
🎰 Casino Roll - Simplified Main Application
Domain: agrobmin.com.ua
Python: 3.12
"""

import asyncio
import logging
import ssl
import uvicorn
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

# Simple configuration
DOMAIN = "agrobmin.com.ua"
BOT_TOKEN = "7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI"
HOST = "0.0.0.0"
PORT = 8000

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="🎰 Casino Roll",
    description="Telegram Mini App Casino",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://agrobmin.com.ua",
        "https://t.me",
        "https://web.telegram.org"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Casino Roll",
        "domain": DOMAIN,
        "version": "1.0.0",
        "python": "3.12"
    }

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    """Main page"""
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "domain": DOMAIN,
            "webapp_url": f"https://{DOMAIN}",
            "bot_username": "@your_casino_bot"
        }
    )

@app.post("/webhook")
async def telegram_webhook(request: Request):
    """Telegram webhook"""
    try:
        json_data = await request.json()
        logger.info(f"Webhook received: {json_data}")
        return {"ok": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"ok": False}

# Simple API routes
@app.get("/api/colors")
async def get_colors():
    """Get game colors"""
    return {
        "success": True,
        "colors": {
            "red": {"name": "Красный", "multiplier": 2.2, "color": "#ff073a"},
            "blue": {"name": "Синий", "multiplier": 2.2, "color": "#00d4ff"},
            "green": {"name": "Зеленый", "multiplier": 5.0, "color": "#39ff14"},
            "yellow": {"name": "Желтый", "multiplier": 45.0, "color": "#ffff00"}
        }
    }

@app.post("/api/game/bet")
async def place_bet(request: Request):
    """Place a bet"""
    try:
        data = await request.json()
        # Simple game logic
        import random
        colors = ["red", "blue", "green", "yellow"]
        result_color = random.choice(colors)
        
        won = result_color == data.get("color", "red")
        multiplier = {"red": 2.2, "blue": 2.2, "green": 5.0, "yellow": 45.0}[data.get("color", "red")]
        bet_amount = data.get("amount", 5.0)
        win_amount = bet_amount * multiplier if won else 0.0
        
        return {
            "success": True,
            "result_color": result_color,
            "multiplier": multiplier,
            "win_amount": win_amount,
            "won": won,
            "new_balance": 100.0 + win_amount - bet_amount
        }
    except Exception as e:
        logger.error(f"Bet error: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/user/balance/{user_id}")
async def get_balance(user_id: int):
    """Get user balance"""
    return {
        "success": True,
        "balance": 100.0,
        "currency": "AI"
    }

def create_ssl_context():
    """Create SSL context"""
    cert_path = Path("ssl/sertificat.pem")
    key_path = Path("ssl/sertificat.key")
    
    if not cert_path.exists() or not key_path.exists():
        logger.warning(f"SSL certificates not found: {cert_path}, {key_path}")
        return None
    
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(cert_path, key_path)
    return ssl_context

async def main():
    """Main function"""
    ssl_context = create_ssl_context()
    
    config = uvicorn.Config(
        app=app,
        host=HOST,
        port=PORT,
        ssl_keyfile="ssl/sertificat.key" if ssl_context else None,
        ssl_certfile="ssl/sertificat.pem" if ssl_context else None,
        log_level="info",
        access_log=True
    )
    
    server = uvicorn.Server(config)
    
    logger.info(f"🎰 Casino Roll starting on https://{DOMAIN}")
    logger.info(f"🤖 Telegram Bot: @your_casino_bot")
    logger.info(f"🔗 Webhook: https://{DOMAIN}/webhook")
    
    await server.serve()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("👋 Stopping server")
    except Exception as e:
        logger.error(f"❌ Critical error: {e}")
        raise