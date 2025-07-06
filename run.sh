#!/bin/bash

# 🎰 Casino Roll - Run Script
# Domain: agrobmin.com.ua

set -e

echo "🎰 ========================================"
echo "🎰       Casino Roll - Запуск сервера    "
echo "🎰 ========================================"
echo ""

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${CYAN}[SUCCESS]${NC} $1"
}

# Проверка виртуального окружения
if [ ! -d "venv" ]; then
    error "Виртуальное окружение не найдено!"
    echo "Запустите сначала: ./start.sh"
    exit 1
fi

# Активация виртуального окружения
log "Активация виртуального окружения..."
source venv/bin/activate

# Проверка .env файла
if [ ! -f ".env" ]; then
    warn ".env файл не найден. Создание базового..."
    cat > .env << EOF
# 🎰 Casino Roll Configuration
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=$(python3.12 -c "import secrets; print(secrets.token_urlsafe(32))")
HOST=0.0.0.0
PORT=8000
DOMAIN=agrobmin.com.ua
SSL_CERT_PATH=ssl/sertificat.pem
SSL_KEY_PATH=ssl/sertificat.key
TELEGRAM_BOT_TOKEN=7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI
WEBHOOK_URL=https://agrobmin.com.ua/webhook
WEBAPP_URL=https://agrobmin.com.ua
MONGODB_URL=mongodb://localhost:27017/casino_roll
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=$(python3.12 -c "import secrets; print(secrets.token_urlsafe(32))")
STARTING_BALANCE=100.0
MIN_BET=1.0
MAX_BET=1000.0
EOF
fi

# Проверка SSL сертификатов
if [ ! -f "ssl/sertificat.pem" ] || [ ! -f "ssl/sertificat.key" ]; then
    warn "SSL сертификаты не найдены в папке ssl/"
    warn "Убедитесь что sertificat.key и sertificat.pem находятся в папке ssl/"
fi

# Проверка портов
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Проверка MongoDB
log "Проверка MongoDB..."
if ! pgrep mongod >/dev/null 2>&1 && ! pgrep mongodb >/dev/null 2>&1; then
    warn "MongoDB не запущен. Попытка запуска..."
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb 2>/dev/null || true
    fi
fi

# Проверка Redis
log "Проверка Redis..."
if ! pgrep redis-server >/dev/null 2>&1; then
    warn "Redis не запущен. Попытка запуска..."
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start redis-server 2>/dev/null || sudo systemctl start redis 2>/dev/null || true
    fi
fi

# Проверка зависимостей
log "Проверка Python зависимостей..."
if [ -f "requirements.txt" ]; then
    pip install -q -r requirements.txt
fi

# Проверка структуры проекта
log "Проверка структуры проекта..."

# Создание недостающих директорий
mkdir -p {backend,static/{css,js,images,sounds},templates,logs,ssl}

# Установка прав доступа
chmod +x run.sh
chmod -R 755 static/
chmod -R 755 templates/

# Проверка основных файлов
if [ ! -f "backend/main.py" ]; then
    error "Основной файл backend/main.py не найден!"
    exit 1
fi

if [ ! -f "templates/index.html" ]; then
    error "Шаблон index.html не найден!"
    exit 1
fi

# Создание default изображения если не существует
if [ ! -f "static/images/default-avatar.png" ]; then
    log "Создание default аватара..."
    # Создаем простой SVG аватар
    cat > static/images/default-avatar.svg << 'EOF'
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="24" fill="#00fff0"/>
  <circle cx="24" cy="18" r="8" fill="#0a0a0a"/>
  <path d="M8 38c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#0a0a0a"/>
</svg>
EOF
fi

# Очистка логов если они слишком большие
if [ -f "logs/casino.log" ] && [ $(stat -c%s "logs/casino.log" 2>/dev/null || echo 0) -gt 10485760 ]; then
    log "Очистка больших лог файлов..."
    echo "" > logs/casino.log
fi

# Проверка доступности портов
log "Проверка портов..."

if check_port 8000; then
    warn "Порт 8000 уже используется. Останавливаем процесс..."
    kill -9 $(lsof -Pi :8000 -sTCP:LISTEN -t) 2>/dev/null || true
    sleep 2
fi

# Установка webhook
log "Настройка Telegram webhook..."
python3.12 -c "
import asyncio
import aiohttp
import os
from dotenv import load_dotenv

async def set_webhook():
    load_dotenv()
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    webhook_url = os.getenv('WEBHOOK_URL')
    
    if token and webhook_url:
        url = f'https://api.telegram.org/bot{token}/setWebhook'
        data = {'url': webhook_url}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, data=data) as resp:
                    result = await resp.json()
                    if result.get('ok'):
                        print('✅ Webhook установлен успешно')
                    else:
                        print(f'❌ Ошибка webhook: {result.get(\"description\")}')
        except Exception as e:
            print(f'❌ Ошибка подключения к Telegram API: {e}')
    else:
        print('⚠️ Токен бота или URL webhook не найдены')

asyncio.run(set_webhook())
" 2>/dev/null || warn "Не удалось установить webhook автоматически"

# Запуск сервера
echo ""
log "🚀 Запуск Casino Roll..."
echo ""
echo -e "${CYAN}📱 Домен:${NC} https://agrobmin.com.ua"
echo -e "${CYAN}🤖 Бот:${NC} https://t.me/your_casino_bot"
echo -e "${CYAN}🔗 API:${NC} https://agrobmin.com.ua/api"
echo -e "${CYAN}📊 Здоровье:${NC} https://agrobmin.com.ua/health"
echo ""
echo -e "${YELLOW}📋 Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск основного приложения
exec python3.12 -m backend.main