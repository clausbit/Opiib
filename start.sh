#!/bin/bash

# 🎰 Casino Roll - Автоматическая установка
# Домен: agrobmin.com.ua

set -e  # Остановить при ошибке

echo "🎰 ========================================"
echo "🎰    Casino Roll - Auto Installation    "
echo "🎰 ========================================"
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функция для логирования
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

# Проверка Python 3.12
log "Проверка Python 3.12..."
if ! command -v python3.12 &> /dev/null; then
    error "Python 3.12 не найден! Установите Python 3.12"
    exit 1
fi

PYTHON_VERSION=$(python3.12 --version)
log "Найден: $PYTHON_VERSION"

# Проверка и установка системных пакетов
log "Проверка системных зависимостей..."
if command -v apt-get &> /dev/null; then
    log "Обновление пакетов Ubuntu/Debian..."
    sudo apt-get update -qq
    
    log "Установка необходимых пакетов..."
    sudo apt-get install -y \
        python3.12-venv \
        python3.12-dev \
        python3-pip \
        nginx \
        redis-server \
        mongodb \
        curl \
        wget \
        git \
        build-essential \
        libssl-dev \
        libffi-dev \
        pkg-config
        
elif command -v yum &> /dev/null; then
    log "Установка пакетов CentOS/RHEL..."
    sudo yum update -y
    sudo yum install -y \
        python3.12 \
        python3.12-devel \
        python3-pip \
        nginx \
        redis \
        mongodb-server \
        curl \
        wget \
        git \
        gcc \
        openssl-devel \
        libffi-devel
else
    warn "Автоматическая установка пакетов недоступна. Установите вручную:"
    warn "- Python 3.12, pip, nginx, redis, mongodb"
fi

# Создание виртуального окружения
log "Создание виртуального окружения..."
if [ -d "venv" ]; then
    warn "Виртуальное окружение уже существует. Удаляем старое..."
    rm -rf venv
fi

python3.12 -m venv venv
source venv/bin/activate

log "Обновление pip..."
pip install --upgrade pip setuptools wheel

# Установка Python зависимостей
log "Установка Python зависимостей..."
cat > requirements.txt << EOF
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
jinja2==3.1.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.0
aiofiles==23.2.1
aioredis==2.0.1
motor==3.3.2
pymongo==4.6.0
httpx==0.25.2
websockets==12.0
pydantic==2.5.0
pydantic-settings==2.1.0
cryptography==41.0.8
requests==2.31.0
aiogram==3.2.0
celery==5.3.4
redis==5.0.1
pillow==10.1.0
qrcode==7.4.2
stripe==7.8.0
certifi==2023.11.17
urllib3==2.1.0
charset-normalizer==3.3.2
idna==3.6
bcrypt==4.1.2
email-validator==2.1.0
orjson==3.9.10
python-telegram-bot==20.7
aiohttp==3.9.1
asyncio==3.4.3
asyncpg==0.29.0
sqlalchemy==2.0.23
alembic==1.13.0
gunicorn==21.2.0
psutil==5.9.6
schedule==1.2.0
matplotlib==3.8.2
numpy==1.26.2
pandas==2.1.4
pytz==2023.3
python-dateutil==2.8.2
six==1.16.0
EOF

pip install -r requirements.txt

# Создание структуры проекта
log "Создание структуры проекта..."
mkdir -p {backend,frontend,static/{css,js,images,sounds},templates,logs,ssl}

# Копирование SSL сертификатов
log "Настройка SSL сертификатов..."
if [ -f "sertificat.key" ] && [ -f "sertificat.pem" ]; then
    cp sertificat.key ssl/
    cp sertificat.pem ssl/
    chmod 600 ssl/sertificat.key
    chmod 644 ssl/sertificat.pem
    success "SSL сертификаты скопированы"
else
    warn "SSL сертификаты не найдены в корневой папке"
    warn "Убедитесь что sertificat.key и sertificat.pem находятся в корне проекта"
fi

# Создание .env файла
log "Создание конфигурационного файла..."
cat > .env << EOF
# 🎰 Casino Roll Configuration
# Domain: agrobmin.com.ua

# Environment
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=$(python3.12 -c "import secrets; print(secrets.token_urlsafe(32))")

# Server
HOST=0.0.0.0
PORT=8000
DOMAIN=agrobmin.com.ua
SSL_CERT_PATH=ssl/sertificat.pem
SSL_KEY_PATH=ssl/sertificat.key

# Telegram Bot
TELEGRAM_BOT_TOKEN=7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI
TELEGRAM_BOT_USERNAME=@your_casino_bot
WEBHOOK_URL=https://agrobmin.com.ua/webhook
WEBAPP_URL=https://agrobmin.com.ua

# Database
MONGODB_URL=mongodb://localhost:27017/casino_roll
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=$(python3.12 -c "import secrets; print(secrets.token_urlsafe(32))")
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Game Settings
STARTING_BALANCE=100.0
MIN_BET=1.0
MAX_BET=1000.0
HOUSE_EDGE=0.05

# Colors and Multipliers
RED_MULTIPLIER=2.2
BLUE_MULTIPLIER=2.2
GREEN_MULTIPLIER=5.0
YELLOW_MULTIPLIER=45.0

# Referral System
LEVEL_1_COMMISSION=0.05
LEVEL_2_COMMISSION=0.01
LEVEL_3_COMMISSION=0.01

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Payments
ENABLE_TELEGRAM_STARS=True
ENABLE_CRYPTO_PAYMENTS=True
CRYPTO_API_KEY=your_crypto_api_key
TON_WALLET=your_ton_wallet_address

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/casino.log
EOF

success "Конфигурационный файл создан"

# Запуск сервисов
log "Запуск необходимых сервисов..."

# MongoDB
if command -v systemctl &> /dev/null; then
    sudo systemctl start mongod || sudo systemctl start mongodb
    sudo systemctl enable mongod || sudo systemctl enable mongodb
    success "MongoDB запущен"
fi

# Redis
if command -v systemctl &> /dev/null; then
    sudo systemctl start redis-server || sudo systemctl start redis
    sudo systemctl enable redis-server || sudo systemctl enable redis
    success "Redis запущен"
fi

# Проверка портов
log "Проверка доступности портов..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null; then
    warn "Порт 8000 занят. Останавливаем процесс..."
    sudo kill -9 $(lsof -Pi :8000 -sTCP:LISTEN -t) 2>/dev/null || true
fi

if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null; then
    warn "Порт 80 занят (это нормально если nginx запущен)"
fi

if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null; then
    warn "Порт 443 занят (это нормально если nginx запущен)"
fi

# Создание директорий для логов
mkdir -p logs
touch logs/casino.log
touch logs/access.log
touch logs/error.log

# Установка прав доступа
chmod +x start.sh
chmod -R 755 static/
chmod -R 755 templates/

log "Создание файлов приложения..."

success "🎉 Установка завершена успешно!"
echo ""
echo -e "${PURPLE}🎰 ========================================"
echo -e "🎰           ГОТОВО К ЗАПУСКУ!           "
echo -e "🎰 ========================================${NC}"
echo ""
echo -e "${CYAN}📱 Домен:${NC} https://agrobmin.com.ua"
echo -e "${CYAN}🤖 Бот:${NC} https://t.me/your_casino_bot"
echo -e "${CYAN}⚙️  API:${NC} https://agrobmin.com.ua/api"
echo -e "${CYAN}📊 Админ:${NC} https://agrobmin.com.ua/admin"
echo ""
echo -e "${YELLOW}🚀 Для запуска выполните:${NC}"
echo -e "   ${GREEN}source venv/bin/activate${NC}"
echo -e "   ${GREEN}python3.12 -m backend.main${NC}"
echo ""
echo -e "${YELLOW}🔧 Или запустите автоматически:${NC}"
echo -e "   ${GREEN}./run.sh${NC}"
echo ""
echo -e "${BLUE}📖 Логи доступны в: logs/${NC}"
echo -e "${BLUE}⚙️  Конфигурация: .env${NC}"
echo ""