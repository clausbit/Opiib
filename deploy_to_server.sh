#!/bin/bash

# 🎰 Casino Roll - Server Deployment Script
# This script copies all necessary files to your server

echo "🎰 ========================================"
echo "🎰     Casino Roll - File Deployment     "
echo "🎰 ========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

success() {
    echo -e "${CYAN}[SUCCESS]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/main.py" ]; then
    echo "❌ Error: Please run this script from the casino-roll project root"
    exit 1
fi

# Get target directory from user or use current
TARGET_DIR=${1:-"."}

log "Deploying Casino Roll files to: $TARGET_DIR"

# Create directory structure
log "Creating directory structure..."
mkdir -p "$TARGET_DIR"/{backend/{middleware,utils,routes},static/{css,js,images,sounds},templates,logs,ssl}

# Copy backend files
log "Copying backend files..."
cp -r backend/* "$TARGET_DIR/backend/"

# Copy static files
log "Copying static files..."
cp -r static/* "$TARGET_DIR/static/"

# Copy templates
log "Copying templates..."
cp -r templates/* "$TARGET_DIR/templates/"

# Copy main project files
log "Copying main project files..."
cp start.sh "$TARGET_DIR/"
cp run.sh "$TARGET_DIR/"
cp README.md "$TARGET_DIR/"
cp QUICKSTART.md "$TARGET_DIR/"
cp docker-compose.yml "$TARGET_DIR/"
cp Dockerfile "$TARGET_DIR/"

# Copy the improved installation script
cp install_casino_roll.sh "$TARGET_DIR/"

# Make scripts executable
chmod +x "$TARGET_DIR"/*.sh

# Create a quick README for server deployment
cat > "$TARGET_DIR/SERVER_SETUP.md" << 'EOF'
# 🎰 Casino Roll - Server Setup Guide

## Quick Start on Ubuntu 24.04

1. **Run the fixed installation script:**
   ```bash
   chmod +x install_casino_roll.sh
   ./install_casino_roll.sh
   ```

2. **Place your SSL certificates:**
   ```bash
   # Copy your certificates to the project directory
   cp /path/to/your/sertificat.key .
   cp /path/to/your/sertificat.pem .
   ```

3. **Activate virtual environment:**
   ```bash
   source venv/bin/activate
   ```

4. **Start the application:**
   ```bash
   ./run.sh
   ```

## Troubleshooting

### MongoDB Issues
If MongoDB installation fails:
```bash
# Manual MongoDB installation for Ubuntu 24.04
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Service Status Check
```bash
sudo systemctl status mongod
sudo systemctl status redis-server
sudo systemctl status nginx
```

### Ports and Processes
```bash
# Check if ports are free
sudo netstat -tlnp | grep :8000
sudo netstat -tlnp | grep :27017
sudo netstat -tlnp | grep :6379

# Kill process if needed
sudo pkill -f "python.*casino"
```

## Files Structure
```
casino-roll/
├── backend/           # Python FastAPI application
├── static/           # CSS, JS, images, sounds
├── templates/        # HTML templates
├── ssl/             # SSL certificates
├── logs/            # Application logs
├── install_casino_roll.sh  # Fixed installation script
├── run.sh           # Application launcher
└── .env             # Configuration file
```

## Configuration
Edit `.env` file to customize:
- Domain settings
- Bot token
- Database URLs
- Game parameters

## Support
- Check logs: `tail -f logs/casino.log`
- Health check: `curl https://agrobmin.com.ua/health`
- API docs: `https://agrobmin.com.ua/api/docs`
EOF

success "✅ All files copied successfully!"
echo ""
echo -e "${CYAN}📋 Next Steps:${NC}"
echo -e "1. Upload the '$TARGET_DIR' directory to your server"
echo -e "2. On server, run: ${GREEN}chmod +x install_casino_roll.sh && ./install_casino_roll.sh${NC}"
echo -e "3. Place SSL certificates in the project directory"
echo -e "4. Run: ${GREEN}source venv/bin/activate && ./run.sh${NC}"
echo ""
echo -e "${YELLOW}📁 Files ready for deployment in: $TARGET_DIR${NC}"