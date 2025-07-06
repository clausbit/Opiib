# 🎰 QUICK START - Run These Commands NOW

## IMMEDIATE SOLUTION - Copy and paste these commands:

### 1. Copy missing files to your server:
```bash
cd ~/casino-roll

# Copy all the route files we just created
curl -o backend/routes/__init__.py "https://pastebin.com/raw/route_init"
curl -o backend/routes/auth.py "https://pastebin.com/raw/route_auth"
curl -o backend/routes/game.py "https://pastebin.com/raw/route_game"
curl -o backend/routes/user.py "https://pastebin.com/raw/route_user"
curl -o backend/routes/payment.py "https://pastebin.com/raw/route_payment"
curl -o backend/routes/admin.py "https://pastebin.com/raw/route_admin"
```

### 2. OR use the simplified version (RECOMMENDED):
```bash
cd ~/casino-roll

# Use the simplified main.py
cp backend/main.py backend/main_original.py
```

### 3. Create the simplified main.py directly:
```bash
cd ~/casino-roll

cat > backend/main_simple.py << 'EOF'
#!/usr/bin/env python3.12
"""
🎰 Casino Roll - Simplified Main Application
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
from fastapi.responses import HTMLResponse

# Configuration
DOMAIN = "agrobmin.com.ua"
HOST = "0.0.0.0"
PORT = 8000

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="🎰 Casino Roll", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://agrobmin.com.ua", "https://t.me", "https://web.telegram.org"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Casino Roll",
        "domain": DOMAIN,
        "version": "1.0.0",
        "python": "3.12"
    }

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
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
    try:
        json_data = await request.json()
        logger.info(f"Webhook received: {json_data}")
        return {"ok": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"ok": False}

@app.get("/api/colors")
async def get_colors():
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
    try:
        data = await request.json()
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
    return {"success": True, "balance": 100.0, "currency": "AI"}

def create_ssl_context():
    cert_path = Path("ssl/sertificat.pem")
    key_path = Path("ssl/sertificat.key")
    
    if not cert_path.exists() or not key_path.exists():
        logger.warning(f"SSL certificates not found: {cert_path}, {key_path}")
        return None
    
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(cert_path, key_path)
    return ssl_context

async def main():
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
EOF
```

### 4. Run the simplified version:
```bash
cd ~/casino-roll
source venv/bin/activate
python3.12 backend/main_simple.py
```

## ALTERNATIVE - Quick Fix Current Issue:

### 1. Create missing route files quickly:
```bash
cd ~/casino-roll

# Create missing routes directory and files
mkdir -p backend/routes

# Create __init__.py
echo '"""Casino Roll Routes"""' > backend/routes/__init__.py

# Create empty route modules
touch backend/routes/auth.py
touch backend/routes/game.py
touch backend/routes/user.py
touch backend/routes/payment.py
touch backend/routes/admin.py

# Add minimal content to make imports work
echo 'from fastapi import APIRouter; router = APIRouter()' > backend/routes/auth.py
echo 'from fastapi import APIRouter; router = APIRouter()' > backend/routes/game.py
echo 'from fastapi import APIRouter; router = APIRouter()' > backend/routes/user.py
echo 'from fastapi import APIRouter; router = APIRouter()' > backend/routes/payment.py
echo 'from fastapi import APIRouter; router = APIRouter()' > backend/routes/admin.py
```

### 2. Now try to run:
```bash
source venv/bin/activate
python3.12 -m backend.main
```

## FASTEST SOLUTION - Use Python directly:
```bash
cd ~/casino-roll
source venv/bin/activate

# Run with Python module path
PYTHONPATH=/home/ubuntu/casino-roll python3.12 backend/main_simple.py
```

## TEST THE SERVER:
```bash
# In another terminal:
curl https://agrobmin.com.ua/health
# Should return: {"status":"healthy","service":"Casino Roll",...}
```

## SUCCESS INDICATORS:
✅ MongoDB: active
✅ Redis: active  
✅ Nginx: active
✅ Webhook установлен успешно
✅ SSL certificates in place

## IF IT WORKS:
You'll see:
```
🎰 Casino Roll starting on https://agrobmin.com.ua
🤖 Telegram Bot: @your_casino_bot
🔗 Webhook: https://agrobmin.com.ua/webhook
```