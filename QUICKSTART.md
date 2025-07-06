# 🚀 Быстрый старт - Casino Roll

Этот гайд поможет вам запустить Telegram Mini App казино за 10 минут.

## ⚡ Экспресс-запуск

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd telegram-casino-miniapp
npm run install:all
```

### 2. Создание Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather)
2. Выполните команды:
   ```
   /newbot
   # Введите имя бота: Casino Roll Bot
   # Введите username: your_casino_roll_bot
   
   /newapp
   # Выберите вашего бота
   # Введите короткое имя: casino
   # Введите описание: Neon casino game
   # Укажите URL: https://your-domain.com (пока оставьте пустым для dev)
   ```

3. Сохраните полученный токен

### 3. Настройка окружения

```bash
cp server/.env.example server/.env
```

Заполните ТОЛЬКО обязательные поля в `server/.env`:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdef...  # Ваш токен от BotFather
TELEGRAM_BOT_USERNAME=your_casino_roll_bot
JWT_SECRET=your-super-secret-32-character-key-here
MONGODB_URI=mongodb://localhost:27017/casino
```

### 4. Запуск MongoDB (если не установлен)

**Ubuntu/Debian:**
```bash
sudo apt install mongodb
sudo systemctl start mongodb
```

**macOS:**
```bash
brew install mongodb/brew/mongodb-community
brew services start mongodb-community
```

**Windows:**
Скачайте с [mongodb.com](https://www.mongodb.com/try/download/community)

**Docker (альтернатива):**
```bash
docker run -d -p 27017:27017 --name casino-mongo mongo:6.0
```

### 5. Запуск приложения

```bash
npm run dev
```

Откроется:
- 🎰 **Frontend**: http://localhost:3000
- 🔧 **API**: http://localhost:3001
- 💻 **Health Check**: http://localhost:3001/health

## 📱 Тестирование в Telegram

### Локальная разработка (через туннель)

1. **Установите ngrok:**
   ```bash
   npm install -g ngrok
   # или скачайте с ngrok.com
   ```

2. **Создайте туннель:**
   ```bash
   ngrok http 3000
   ```

3. **Обновите настройки бота:**
   - Скопируйте HTTPS URL из ngrok (например: `https://abc123.ngrok.io`)
   - Отправьте в BotFather: `/editapp` → выберите бота → вставьте URL

4. **Откройте в Telegram:**
   - Найдите вашего бота
   - Нажмите `/start`
   - Откройте Web App

## 🎮 Первая игра

1. **Получите стартовые монеты:**
   - Каждый новый пользователь получает 100 AI
   - Для тестирования можете добавить в базе больше

2. **Сделайте ставку:**
   - Выберите цвет (красный, синий, зеленый, желтый)
   - Установите сумму ставки
   - Нажмите "Place Bet"

3. **Множители:**
   - 🔴🔵 Красный/Синий: x2.2
   - 🟢 Зеленый: x5  
   - 🟡 Желтый: x45

## 🔧 Базовая настройка

### Изменение стартового баланса

В `server/.env` добавьте:
```env
STARTING_BALANCE=1000  # Изменить на нужную сумму
```

### Настройка лимитов ставок

```env
MIN_BET=1
MAX_BET=500
```

### Изменение комиссии казино

```env
HOUSE_EDGE=0.03  # 3% комиссия
```

## 🐛 Решение проблем

### Ошибка подключения к MongoDB
```bash
# Проверьте статус
sudo systemctl status mongodb

# Перезапустите
sudo systemctl restart mongodb
```

### Токен бота не работает
- Убедитесь что токен скопирован полностью
- Проверьте что бот не заблокирован
- Создайте нового бота в BotFather

### Web App не открывается
- Проверьте HTTPS (обязательно для Telegram)
- Используйте ngrok для локальной разработки
- Убедитесь что URL указан в настройках бота

### Порты заняты
```bash
# Освободите порты
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9
```

## 📚 Что дальше?

1. **[Настройка платежей](README.md#-настройка-платежей)** - добавьте Telegram Stars и крипто
2. **[Кастомизация дизайна](client/src/styles/)** - измените цвета и анимации  
3. **[Добавление игр](README.md#добавление-новых-игр)** - создайте новые игровые режимы
4. **[Деплой в production](README.md#-развертывание)** - выложите на сервер

## 💡 Полезные команды

```bash
# Просмотр логов
npm run dev | grep "ERROR"

# Сброс базы данных  
mongo casino --eval "db.dropDatabase()"

# Создание админ пользователя
mongo casino --eval "db.users.updateOne(
  {telegramId: 'YOUR_TELEGRAM_ID'}, 
  {$set: {role: 'admin', balance: 10000}},
  {upsert: true}
)"

# Проверка здоровья API
curl http://localhost:3001/health
```

## 📞 Поддержка

- 📖 **Полная документация**: [README.md](README.md)
- 🐛 **Проблемы**: [GitHub Issues](issues)
- 💬 **Telegram**: [@support_bot](https://t.me/support_bot)

---

🎉 **Готово! Теперь у вас есть работающее казино в Telegram!**