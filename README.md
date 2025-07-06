# 🎰 Casino Roll - Telegram Mini App

[![Domain](https://img.shields.io/badge/Domain-agrobmin.com.ua-blue)](https://agrobmin.com.ua)
[![Python](https://img.shields.io/badge/Python-3.12-green)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-red)](https://fastapi.tiangolo.com)
[![Telegram](https://img.shields.io/badge/Telegram-WebApp-blue)](https://core.telegram.org/bots/webapps)

> Современное казино на базе Telegram Mini App с неоновым дизайном и плавными анимациями

## 📱 Демо и Ссылки

- **🌐 Домен:** https://agrobmin.com.ua
- **🤖 Telegram Бот:** https://t.me/your_casino_bot
- **🔗 API Документация:** https://agrobmin.com.ua/api/docs
- **📊 Статус Сервера:** https://agrobmin.com.ua/health

## ✨ Особенности

### 🎨 Дизайн и UI
- **Неоновый дизайн** с эффектами свечения
- **Плавные анимации** всех элементов
- **Адаптивная верстка** для всех устройств
- **Частицы и эффекты** для атмосферы
- **Темная тема** оптимизированная для Telegram

### 🎰 Игровая Механика
- **Цветная рулетка** с 4 цветами
- **Честная игра** с прозрачными шансами
- **Множители:**
  - 🔴 Красный: x2.2 (45.45% шанс)
  - 🔵 Синий: x2.2 (45.45% шанс) 
  - 🟢 Зеленый: x5 (9% шанс)
  - 🟡 Желтый: x45 (0.22% шанс)

### 🔊 Звуки и Эффекты
- **Звуковые эффекты** для всех действий
- **Haptic Feedback** на iOS устройствах
- **Конфетти анимации** при выигрыше
- **Звуки рулетки** с реалистичным вращением

### 💰 Платежи
- **⭐ Telegram Stars** - нативные платежи
- **₿ Криптовалюты** (TON, BTC, ETH, USDT, BNB)
- **🔗 Wallet Connect** интеграция
- **💸 Быстрые выплаты**

### 👥 Социальные Функции
- **Реферальная программа** (5% + 1% + 1%)
- **История игр** с детальной статистикой
- **Рейтинги игроков**
- **Достижения и награды**

### 🔐 Безопасность
- **JWT аутентификация**
- **Rate Limiting защита**
- **Валидация Telegram данных**
- **HTTPS обязательно**
- **Защита от ботов**

## 🚀 Быстрый Старт

### Автоматическая Установка

```bash
# 1. Клонируем репозиторий
git clone https://github.com/yourusername/casino-roll.git
cd casino-roll

# 2. Копируем SSL сертификаты
cp /path/to/sertificat.key .
cp /path/to/sertificat.pem .

# 3. Запускаем автоматическую установку
chmod +x start.sh
./start.sh
```

### Ручная Установка

```bash
# 1. Создаем виртуальное окружение Python 3.12
python3.12 -m venv venv
source venv/bin/activate

# 2. Устанавливаем зависимости
pip install -r requirements.txt

# 3. Настраиваем переменные окружения
cp .env.example .env
nano .env  # Редактируем настройки

# 4. Запускаем сервер
python3.12 -m backend.main
```

## ⚙️ Конфигурация

### Основные Настройки (.env)

```env
# Сервер
DOMAIN=agrobmin.com.ua
SSL_CERT_PATH=ssl/sertificat.pem
SSL_KEY_PATH=ssl/sertificat.key

# Telegram
TELEGRAM_BOT_TOKEN=7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI
WEBHOOK_URL=https://agrobmin.com.ua/webhook
WEBAPP_URL=https://agrobmin.com.ua

# База данных
MONGODB_URL=mongodb://localhost:27017/casino_roll
REDIS_URL=redis://localhost:6379

# Игра
STARTING_BALANCE=100.0
MIN_BET=1.0
MAX_BET=1000.0
```

### Создание Telegram Бота

1. **Создайте бота** через [@BotFather](https://t.me/botfather)
2. **Получите токен** и добавьте в `.env`
3. **Настройте Menu Button:**
   ```
   /setmenubutton
   @your_bot_name
   🎰 Играть
   https://agrobmin.com.ua
   ```
4. **Настройте Web App:**
   ```
   /newapp
   @your_bot_name
   Casino Roll
   https://agrobmin.com.ua
   ```

## 🏗️ Архитектура Проекта

```
casino-roll/
├── 🐍 backend/                 # Python FastAPI Backend
│   ├── main.py                # Главный файл сервера
│   ├── config.py              # Настройки приложения
│   ├── database.py            # MongoDB модели
│   ├── telegram_bot.py        # Telegram бот
│   ├── routes/                # API маршруты
│   │   ├── auth.py           # Аутентификация
│   │   ├── game.py           # Игровая логика
│   │   ├── user.py           # Пользователи
│   │   ├── payment.py        # Платежи
│   │   └── admin.py          # Админ панель
│   ├── middleware/           # Промежуточное ПО
│   └── utils/               # Утилиты
├── 🎨 frontend/              # Frontend Files
├── 📄 templates/            # HTML шаблоны
│   └── index.html          # Главная страница
├── 🎭 static/              # Статические файлы
│   ├── css/               # Стили
│   │   └── main.css      # Основные стили
│   ├── js/               # JavaScript
│   │   ├── app.js       # Главное приложение
│   │   ├── game.js      # Игровая логика
│   │   ├── telegram.js  # Telegram интеграция
│   │   ├── sounds.js    # Звуковые эффекты
│   │   ├── ui.js        # UI компоненты
│   │   └── api.js       # API клиент
│   ├── images/          # Изображения
│   └── sounds/          # Звуковые файлы
├── 🔒 ssl/               # SSL сертификаты
├── 📁 logs/              # Лог файлы
├── 🔧 start.sh           # Скрипт установки
├── 🚀 run.sh             # Скрипт запуска
└── 📋 requirements.txt   # Python зависимости
```

## 🎮 Игровая Механика

### Цвета и Вероятности

| Цвет | Множитель | Вероятность | Дом. Преимущество |
|------|-----------|-------------|------------------|
| 🔴 Красный | x2.2 | 45.45% | 5% |
| 🔵 Синий | x2.2 | 45.45% | 5% |
| 🟢 Зеленый | x5.0 | 9% | 5% |
| 🟡 Желтый | x45.0 | 0.22% | 5% |

### Формула Расчета

```python
# Пример расчета выигрыша
def calculate_win(bet_amount, color, result_color):
    if color == result_color:
        multiplier = GAME_COLORS[color]['multiplier']
        return bet_amount * multiplier
    return 0

# Пример генерации результата
def generate_result():
    random_value = random.random()
    cumulative = 0
    
    for color, data in GAME_COLORS.items():
        cumulative += data['probability']
        if random_value <= cumulative:
            return color
```

## 💳 Интеграция Платежей

### Telegram Stars

```python
# Создание инвойса для Telegram Stars
async def create_stars_invoice(amount):
    return await bot.create_invoice_link(
        title="Пополнение баланса",
        description=f"Пополнение на {amount} AI",
        payload=f"deposit_{user_id}_{amount}",
        provider_token="",  # Пустой для Stars
        currency="XTR",
        prices=[LabeledPrice(label="AI", amount=amount)]
    )
```

### Криптовалюты

```python
# Интеграция с криптовалютными API
SUPPORTED_CURRENCIES = {
    'TON': {'network': 'TON', 'decimals': 9},
    'BTC': {'network': 'Bitcoin', 'decimals': 8},
    'ETH': {'network': 'Ethereum', 'decimals': 18},
    'USDT': {'network': 'Ethereum', 'decimals': 6},
    'BNB': {'network': 'BSC', 'decimals': 18}
}
```

## 🔊 Звуковая Система

### Поддерживаемые Звуки

- **🎰 Рулетка:** `roulette-spin.mp3`
- **🎉 Выигрыш:** `win.mp3`
- **❌ Проигрыш:** `lose.mp3`
- **🖱️ Клик:** `click.mp3`

### Добавление Звуков

```bash
# Добавьте звуковые файлы в static/sounds/
cp your-sound.mp3 static/sounds/
cp your-sound.ogg static/sounds/  # Для совместимости
```

```javascript
// Использование в коде
soundManager.play('your-sound', { volume: 0.7 });
```

## 🎨 Кастомизация Дизайна

### CSS Переменные

```css
:root {
    /* Неоновые цвета */
    --neon-cyan: #00fff0;
    --neon-purple: #b300ff;
    --neon-pink: #ff0080;
    --neon-green: #39ff14;
    
    /* Фоны */
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a2e;
    
    /* Анимации */
    --transition-fast: 0.2s ease;
    --transition-smooth: 0.3s ease;
}
```

### Добавление Анимаций

```css
@keyframes customAnimation {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.custom-element {
    animation: customAnimation 1s ease-in-out infinite;
}
```

## 📊 Мониторинг и Аналитика

### Health Check

```bash
curl https://agrobmin.com.ua/health
```

```json
{
    "status": "healthy",
    "service": "Casino Roll",
    "domain": "agrobmin.com.ua",
    "version": "1.0.0",
    "python": "3.12"
}
```

### Логирование

```python
# Настройка логирования
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/casino.log'),
        logging.StreamHandler()
    ]
)
```

## 🚀 Развертывание

### Docker

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python3.12", "-m", "backend.main"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  casino-roll:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/casino_roll
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
  
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
  
  redis:
    image: redis:7-alpine

volumes:
  mongo_data:
```

### VPS Развертывание

```bash
# 1. Настройка сервера
sudo apt update && sudo apt upgrade -y
sudo apt install python3.12 python3.12-venv nginx mongodb redis-server

# 2. Настройка Nginx
sudo nano /etc/nginx/sites-available/casino-roll

server {
    listen 443 ssl http2;
    server_name agrobmin.com.ua;
    
    ssl_certificate /path/to/sertificat.pem;
    ssl_certificate_key /path/to/sertificat.key;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# 3. Включение сайта
sudo ln -s /etc/nginx/sites-available/casino-roll /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# 4. Автозапуск
sudo nano /etc/systemd/system/casino-roll.service

[Unit]
Description=Casino Roll Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/casino-roll
Environment=PATH=/var/www/casino-roll/venv/bin
ExecStart=/var/www/casino-roll/venv/bin/python -m backend.main
Restart=always

[Install]
WantedBy=multi-user.target

sudo systemctl enable casino-roll
sudo systemctl start casino-roll
```

### Heroku

```bash
# 1. Установка Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# 2. Логин и создание приложения
heroku login
heroku create casino-roll-app

# 3. Настройка переменных
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set MONGODB_URL=mongodb+srv://...
heroku config:set DOMAIN=casino-roll-app.herokuapp.com

# 4. Деплой
git push heroku main
```

## 🔧 API Документация

### Аутентификация

```http
POST /api/auth/login
Content-Type: application/json

{
    "initData": "telegram_init_data",
    "user": {
        "id": 123456789,
        "first_name": "John",
        "username": "johndoe"
    }
}
```

### Игра

```http
POST /api/game/play
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "color": "red",
    "amount": 10.0
}
```

### Получение Баланса

```http
GET /api/user/balance
Authorization: Bearer your_jwt_token
```

### Пополнение

```http
POST /api/payment/deposit
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
    "method": "telegram_stars",
    "amount": 100.0
}
```

## 🛡️ Безопасность

### Проверка Telegram Данных

```python
import hmac
import hashlib
from urllib.parse import unquote

def validate_telegram_data(init_data: str, bot_token: str) -> bool:
    try:
        parsed_data = dict(x.split('=') for x in init_data.split('&'))
        hash_value = parsed_data.pop('hash')
        
        data_check_string = '\n'.join(f"{k}={unquote(v)}" 
                                     for k, v in sorted(parsed_data.items()))
        
        secret_key = hashlib.sha256(bot_token.encode()).digest()
        expected_hash = hmac.new(secret_key, data_check_string.encode(), 
                               hashlib.sha256).hexdigest()
        
        return hmac.compare_digest(hash_value, expected_hash)
    except:
        return False
```

### Rate Limiting

```python
from fastapi import Request, HTTPException
import time

class RateLimiter:
    def __init__(self, max_requests: int = 100, window: int = 3600):
        self.max_requests = max_requests
        self.window = window
        self.requests = {}
    
    def is_allowed(self, identifier: str) -> bool:
        now = time.time()
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Очищаем старые запросы
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window
        ]
        
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        self.requests[identifier].append(now)
        return True
```

## 🧪 Тестирование

### Юнит Тесты

```python
import pytest
from backend.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_game_logic():
    from backend.game import calculate_win
    
    # Тест выигрыша
    assert calculate_win(10, "red", "red") == 22.0
    
    # Тест проигрыша
    assert calculate_win(10, "red", "blue") == 0.0
```

### Нагрузочное Тестирование

```python
import asyncio
import aiohttp

async def load_test():
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(1000):
            task = session.get("https://agrobmin.com.ua/health")
            tasks.append(task)
        
        responses = await asyncio.gather(*tasks)
        print(f"Completed {len(responses)} requests")

asyncio.run(load_test())
```

## 🐛 Отладка и Решение Проблем

### Частые Проблемы

#### 1. SSL Сертификаты

```bash
# Проверка сертификатов
openssl x509 -in ssl/sertificat.pem -text -noout
openssl rsa -in ssl/sertificat.key -check

# Права доступа
chmod 600 ssl/sertificat.key
chmod 644 ssl/sertificat.pem
```

#### 2. MongoDB Подключение

```bash
# Проверка статуса
sudo systemctl status mongod

# Проверка подключения
mongo --eval "db.adminCommand('ismaster')"

# Логи
sudo journalctl -u mongod -f
```

#### 3. Telegram Webhook

```bash
# Проверка webhook
curl -X GET "https://api.telegram.org/bot$BOT_TOKEN/getWebhookInfo"

# Установка webhook
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/setWebhook" \
     -d "url=https://agrobmin.com.ua/webhook"
```

#### 4. Python Зависимости

```bash
# Переустановка зависимостей
pip install --upgrade --force-reinstall -r requirements.txt

# Проверка конфликтов
pip check
```

### Логи

```bash
# Просмотр логов приложения
tail -f logs/casino.log

# Логи Nginx
sudo tail -f /var/log/nginx/error.log

# Системные логи
sudo journalctl -f -u casino-roll
```

## 📈 Производительность

### Оптимизация

1. **Кэширование Redis**
2. **Сжатие Gzip**
3. **Минификация CSS/JS**
4. **CDN для статики**
5. **Индексы MongoDB**

### Метрики

```python
import time
import psutil

def get_system_metrics():
    return {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_usage": psutil.disk_usage('/').percent,
        "uptime": time.time() - psutil.boot_time()
    }
```

## 🤝 Участие в Разработке

### Внесение Вклада

1. **Fork** репозитория
2. Создайте **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** изменения (`git commit -m 'Add amazing feature'`)
4. **Push** в branch (`git push origin feature/amazing-feature`)
5. Создайте **Pull Request**

### Кодстиль

```python
# Используйте Black для форматирования
pip install black
black .

# Проверка типов с mypy
pip install mypy
mypy backend/

# Линтер
pip install flake8
flake8 backend/
```

## 📞 Поддержка

### Контакты

- **💬 Telegram:** [@support](https://t.me/support)
- **📧 Email:** support@agrobmin.com.ua
- **🌐 Сайт:** https://agrobmin.com.ua
- **📋 Issues:** [GitHub Issues](https://github.com/yourusername/casino-roll/issues)

### FAQ

**Q: Как изменить множители цветов?**
A: Отредактируйте переменные в `.env` файле:
```env
RED_MULTIPLIER=2.2
BLUE_MULTIPLIER=2.2
GREEN_MULTIPLIER=5.0
YELLOW_MULTIPLIER=45.0
```

**Q: Как добавить новые звуки?**
A: Поместите файлы в `static/sounds/` и обновите `sounds.js`

**Q: Как настроить свой домен?**
A: Обновите `DOMAIN` в `.env` и настройте DNS записи

## 📄 Лицензия

```
MIT License

Copyright (c) 2024 Casino Roll

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**🎰 Casino Roll** - Сделано с ❤️ для Telegram

[⭐ Star](https://github.com/yourusername/casino-roll) • [🐛 Report Bug](https://github.com/yourusername/casino-roll/issues) • [✨ Request Feature](https://github.com/yourusername/casino-roll/issues)

</div>