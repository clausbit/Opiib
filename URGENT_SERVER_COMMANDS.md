# 🎰 URGENT: Server Setup Commands

## Current Issue: MongoDB Installation Failed

You're getting this error because Ubuntu 24.04 doesn't have MongoDB in default repos.

## IMMEDIATE FIX - Run these commands on your server:

### 1. Stop and go to your casino-roll directory:
```bash
cd ~/casino-roll
```

### 2. Install MongoDB manually (Ubuntu 24.04):
```bash
# Add MongoDB repository key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository (Ubuntu 22.04 compatibility)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 3. Continue with other dependencies:
```bash
# Install remaining system packages
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
    nginx

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 4. Create the Python environment:
```bash
# Remove any existing venv
rm -rf venv

# Create new Python 3.12 virtual environment
python3.12 -m venv venv

# Activate it
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel
```

### 5. Create requirements.txt and install packages:
```bash
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

# Install Python packages
pip install -r requirements.txt
```

### 6. Test database connections:
```bash
# Test MongoDB
python3.12 -c "
import pymongo
try:
    client = pymongo.MongoClient('mongodb://localhost:27017/')
    client.admin.command('ping')
    print('✅ MongoDB connection successful')
except Exception as e:
    print(f'❌ MongoDB connection failed: {e}')
"

# Test Redis
python3.12 -c "
import redis
try:
    r = redis.Redis(host='localhost', port=6379, db=0)
    r.ping()
    print('✅ Redis connection successful')
except Exception as e:
    print(f'❌ Redis connection failed: {e}')
"
```

### 7. Create project structure and copy files:
```bash
# Create directories
mkdir -p {backend/{middleware,utils,routes},static/{css,js,images,sounds},templates,logs,ssl}

# You need to copy the project files here
# Option 1: Clone from repository (if available)
# Option 2: Copy files manually
# Option 3: Use the deployment script from workspace
```

## QUICK COPY COMMANDS (if you have files in another location):

```bash
# If you have project files elsewhere, copy them:
# cp -r /path/to/casino-roll/* ~/casino-roll/

# Or if files are in workspace, you might need to copy them manually
```

## VERIFY SERVICES:
```bash
# Check all services are running
sudo systemctl status mongod
sudo systemctl status redis-server
sudo systemctl status nginx

# Check ports
sudo netstat -tlnp | grep :27017  # MongoDB
sudo netstat -tlnp | grep :6379   # Redis
sudo netstat -tlnp | grep :80     # Nginx HTTP
sudo netstat -tlnp | grep :443    # Nginx HTTPS
```

## NEXT STEPS:
1. ✅ Fix MongoDB installation (commands above)
2. 📁 Copy all Casino Roll project files to ~/casino-roll/
3. 🔐 Place SSL certificates (sertificat.key, sertificat.pem) in project root
4. 🚀 Run the application: `source venv/bin/activate && ./run.sh`

## EMERGENCY CONTACTS:
- MongoDB status: `sudo systemctl status mongod`
- Redis status: `sudo systemctl status redis-server`
- Application logs: `tail -f logs/casino.log`
- Server logs: `sudo journalctl -u mongod -f`