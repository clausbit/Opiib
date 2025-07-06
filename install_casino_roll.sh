#!/bin/bash

# 🎰 Casino Roll - Fixed Installation Script for Ubuntu 24.04
# Domain: agrobmin.com.ua

set -e

echo "🎰 ========================================"
echo "🎰  Casino Roll - Ubuntu 24.04 Install  "
echo "🎰 ========================================"
echo ""

# Colors
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

# Check if running as root for some operations
check_sudo() {
    if ! sudo -n true 2>/dev/null; then
        warn "Some operations require sudo privileges"
    fi
}

# Check Python 3.12
log "Checking Python 3.12..."
if ! command -v python3.12 &> /dev/null; then
    error "Python 3.12 not found! Installing..."
    sudo apt update
    sudo apt install -y python3.12 python3.12-venv python3.12-dev
fi

PYTHON_VERSION=$(python3.12 --version)
success "Found: $PYTHON_VERSION"

# Update system packages
log "Updating system packages..."
sudo apt update -qq

# Install basic dependencies
log "Installing system dependencies..."
sudo apt install -y \
    python3.12-venv \
    python3.12-dev \
    python3-pip \
    curl \
    wget \
    git \
    build-essential \
    libssl-dev \
    libffi-dev \
    pkg-config \
    redis-server \
    nginx \
    supervisor

# Install MongoDB for Ubuntu 24.04
log "Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    log "Adding MongoDB repository..."
    
    # Import MongoDB public GPG key
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
        sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    
    # Add MongoDB repository
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
        sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    
    # Update package list and install
    sudo apt update
    sudo apt install -y mongodb-org
    
    # Start and enable MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    success "MongoDB installed and started"
else
    success "MongoDB already installed"
fi

# Start Redis
log "Starting Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Create project structure
log "Creating project structure..."
mkdir -p {backend/{middleware,utils,routes},static/{css,js,images,sounds},templates,logs,ssl}

# Create virtual environment
log "Creating Python virtual environment..."
if [ -d "venv" ]; then
    warn "Virtual environment exists, removing old one..."
    rm -rf venv
fi

python3.12 -m venv venv
source venv/bin/activate

# Upgrade pip
log "Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Create requirements.txt
log "Creating requirements.txt..."
cat > requirements.txt << 'EOF'
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
gunicorn==21.2.0
psutil==5.9.6
schedule==1.2.0
pytz==2023.3
python-dateutil==2.8.2
EOF

# Install Python dependencies
log "Installing Python dependencies..."
pip install -r requirements.txt

# SSL certificates setup
log "Setting up SSL certificates..."
if [ -f "sertificat.key" ] && [ -f "sertificat.pem" ]; then
    cp sertificat.key ssl/
    cp sertificat.pem ssl/
    chmod 600 ssl/sertificat.key
    chmod 644 ssl/sertificat.pem
    success "SSL certificates copied"
else
    warn "SSL certificates not found (sertificat.key and sertificat.pem)"
    warn "Please place them in the current directory"
fi

# Create .env file
log "Creating configuration file..."
cat > .env << 'EOF'
# 🎰 Casino Roll Configuration
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=your-secret-key-change-in-production

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
JWT_SECRET_KEY=your-jwt-secret-key
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

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/casino.log
EOF

# Create log files
mkdir -p logs
touch logs/casino.log logs/access.log logs/error.log

# Set permissions
chmod +x *.sh
chmod -R 755 static/ templates/

# Test MongoDB connection
log "Testing MongoDB connection..."
python3.12 -c "
import pymongo
try:
    client = pymongo.MongoClient('mongodb://localhost:27017/')
    client.admin.command('ping')
    print('✅ MongoDB connection successful')
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
    exit(1)
"

# Test Redis connection
log "Testing Redis connection..."
python3.12 -c "
import redis
try:
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.ping()
    print('✅ Redis connection successful')
except Exception as e:
    print(f'❌ Redis connection failed: {e}')
    exit(1)
"

success "🎉 Installation completed successfully!"
echo ""
echo -e "${CYAN}🎰 ========================================"
echo -e "🎰         INSTALLATION COMPLETE!        "
echo -e "🎰 ========================================${NC}"
echo ""
echo -e "${CYAN}📱 Domain:${NC} https://agrobmin.com.ua"
echo -e "${CYAN}🤖 Bot:${NC} https://t.me/your_casino_bot"
echo -e "${CYAN}⚙️  API:${NC} https://agrobmin.com.ua/api"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo -e "1. Copy all project files to this directory"
echo -e "2. Place SSL certificates (sertificat.key, sertificat.pem) here"
echo -e "3. Run: ${GREEN}source venv/bin/activate${NC}"
echo -e "4. Run: ${GREEN}./run.sh${NC}"
echo ""
echo -e "${YELLOW}🔧 Services Status:${NC}"
echo -e "MongoDB: $(systemctl is-active mongod)"
echo -e "Redis: $(systemctl is-active redis-server)"
echo -e "Nginx: $(systemctl is-active nginx)"
echo ""