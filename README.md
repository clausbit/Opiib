# 🎰 Casino Roll - Telegram Mini App

Современное казино-приложение для Telegram с неоновым дизайном, плавными анимациями и интеграцией с криптовалютными платежами.

## ✨ Особенности

- 🎨 **Неоновый дизайн** - Современный UI с неоновыми эффектами и плавными анимациями
- 🎰 **Игра в рулетку** - Классическая цветная рулетка с множителями
- 💰 **Crypto платежи** - Поддержка TON, BTC, ETH, USDT и других криптовалют
- ⭐ **Telegram Stars** - Интеграция с внутриигровой валютой Telegram
- 👥 **Реферальная система** - Приглашайте друзей и получайте процент с их ставок
- 📱 **Mobile First** - Полностью адаптированный под мобильные устройства
- 🔄 **Real-time** - Обновления в реальном времени через WebSocket
- 🔒 **Безопасность** - JWT авторизация и защищенные API

## 🚀 Технологический стек

### Frontend
- **React 18** - Современная библиотека для UI
- **Styled Components** - CSS-in-JS стилизация
- **Framer Motion** - Плавные анимации
- **Telegram Web App SDK** - Интеграция с Telegram
- **Socket.io Client** - Связь в реальном времени

### Backend
- **Node.js + Express** - Серверная часть
- **MongoDB + Mongoose** - База данных
- **Socket.io** - WebSocket соединения
- **JWT** - Аутентификация
- **Rate Limiting** - Защита от спама

## 📦 Установка

### Предварительные требования

- Node.js 16+ 
- MongoDB 4.4+
- Telegram Bot Token
- Git

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/telegram-casino-miniapp.git
cd telegram-casino-miniapp
```

### 2. Установка зависимостей

```bash
# Установка зависимостей для всего проекта
npm run install:all

# Или установка по отдельности:
npm install
cd client && npm install
cd ../server && npm install
```

### 3. Настройка переменных окружения

```bash
# Копируем примеры конфигурации
cp server/.env.example server/.env
```

Заполните файл `server/.env` своими данными:

```env
# Обязательные настройки
MONGODB_URI=mongodb://localhost:27017/casino
JWT_SECRET=your-super-secret-jwt-key-32-chars
TELEGRAM_BOT_TOKEN=1234567890:AABBCCDDEEFFaabbccddeeff
TELEGRAM_BOT_USERNAME=your_casino_bot

# Опциональные настройки
NODE_ENV=development
PORT=3001
CLIENT_URL=http://localhost:3000
```

### 4. Создание Telegram бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Создайте нового бота командой `/newbot`
3. Получите токен бота и добавьте в `.env`
4. Настройте Web App командой `/newapp`

### 5. Запуск приложения

```bash
# Запуск в development режиме (фронтенд + бэкенд)
npm run dev

# Или запуск по отдельности:
npm run server:dev  # Запуск только сервера
npm run client:dev  # Запуск только клиента
```

## 🔧 Настройка Telegram Mini App

### 1. Настройка бота

После создания бота в BotFather, выполните следующие команды:

```
/setdescription - Установите описание бота
/setabouttext - Установите информацию о боте
/setuserpic - Загрузите аватар бота
/setcommands - Настройте команды:
start - Начать игру
help - Помощь
balance - Проверить баланс
```

### 2. Создание Web App

```
/newapp - Создать новое приложение
/editapp - Редактировать приложение
/deleteapp - Удалить приложение
```

Укажите следующие параметры:
- **URL**: `https://your-domain.com` (в production)
- **Short name**: `casino` (короткое имя для URL)

### 3. Настройка домена

Для production развертывания:

1. Получите SSL сертификат
2. Настройте reverse proxy (nginx/Apache)
3. Обновите переменные окружения:

```env
NODE_ENV=production
CLIENT_URL=https://your-domain.com
```

## 💳 Настройка платежей

### Telegram Stars

Для работы с Telegram Stars не требуется дополнительных настроек - используется встроенное API Telegram.

### Криптовалютные платежи

1. **TON Wallet Integration**
   ```env
   TON_WALLET_ADDRESS=your-ton-wallet-address
   TON_API_KEY=your-ton-api-key
   ```

2. **CryptoBot (рекомендуется)**
   - Создайте аккаунт в [CryptoBot](https://t.me/CryptoBot)
   - Получите API ключи
   - Настройте webhook для уведомлений

3. **Другие провайдеры**
   - CoinPayments
   - Coinbase Commerce
   - BitPay

## 📁 Структура проекта

```
telegram-casino-miniapp/
├── client/                 # React приложение
│   ├── public/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Утилиты
│   │   └── styles/        # Стили
│   └── package.json
├── server/                # Express сервер
│   ├── src/
│   │   ├── controllers/   # Контроллеры API
│   │   ├── models/        # MongoDB модели
│   │   ├── routes/        # API маршруты
│   │   ├── services/      # Бизнес логика
│   │   ├── middleware/    # Middleware функции
│   │   └── utils/         # Серверные утилиты
│   ├── .env.example       # Пример конфигурации
│   └── package.json
├── package.json           # Корневой package.json
└── README.md
```

## 🎮 Игровая логика

### Цвета и множители

- 🔴 **Красный**: x2.2 (45.45% шанс)
- 🔵 **Синий**: x2.2 (45.45% шанс)  
- 🟢 **Зеленый**: x5 (20% шанс)
- 🟡 **Желтый**: x45 (2.22% шанс)

### House Edge

Настраивается в переменных окружения:
```env
HOUSE_EDGE=0.05  # 5% комиссия казино
```

### Лимиты ставок

```env
MIN_BET=1        # Минимальная ставка
MAX_BET=1000     # Максимальная ставка
STARTING_BALANCE=100  # Стартовый баланс
```

## 👥 Реферальная система

### Структура комиссий

- **1-й уровень**: 5% с каждой ставки
- **2-й уровень**: 1% с каждой ставки  
- **3-й уровень**: 1% с каждой ставки

### Создание реферальных ссылок

```javascript
https://t.me/your_bot?start=ref_USER_ID
```

## 🛠️ Разработка

### Команды разработки

```bash
# Запуск в режиме разработки
npm run dev

# Сборка клиента
npm run build

# Тестирование
npm test

# Линтинг
npm run lint
```

### Добавление новых игр

1. Создайте компонент игры в `client/src/components/games/`
2. Добавьте API эндпоинты в `server/src/routes/`
3. Обновите игровую логику в `server/src/services/GameService.js`

### Добавление платежных провайдеров

1. Создайте сервис в `server/src/services/payments/`
2. Добавьте маршруты в `server/src/routes/payment.js`
3. Обновите frontend в `client/src/pages/DepositPage.js`

## 🚀 Развертывание

### Docker (рекомендуется)

```bash
# Создайте Dockerfile в корне проекта
docker build -t casino-app .
docker run -p 3001:3001 casino-app
```

### VPS/Dedicated сервер

1. **Установите зависимости**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mongodb nginx
   ```

2. **Настройте nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Настройте SSL с Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Heroku

```bash
# Добавьте переменные окружения
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb://...
heroku config:set TELEGRAM_BOT_TOKEN=...

# Деплой
git push heroku main
```

## 📊 Мониторинг

### Логирование

Логи сохраняются в:
- Development: консоль
- Production: файлы + Sentry (опционально)

### Метрики

- Количество игр
- Общий объем ставок
- Прибыль/убытки
- Активные пользователи

### Health Check

```bash
curl http://localhost:3001/health
```

## 🔒 Безопасность

### Основные меры

- JWT токены для аутентификации
- Rate limiting для API
- Валидация Telegram данных
- HTTPS обязателен в production
- Шифрование чувствительных данных

### Telegram валидация

```javascript
// Проверка подлинности данных от Telegram
const crypto = require('crypto');

function validateTelegramAuth(data, botToken) {
  const secret = crypto.createHash('sha256').update(botToken).digest();
  const hash = data.hash;
  delete data.hash;
  
  const dataString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('\n');
    
  const signature = crypto.createHmac('sha256', secret)
    .update(dataString)
    .digest('hex');
    
  return signature === hash;
}
```

## 🐛 Troubleshooting

### Частые проблемы

1. **Telegram Web App не загружается**
   - Проверьте HTTPS в production
   - Убедитесь что домен указан в настройках бота

2. **База данных не подключается**
   - Проверьте MongoDB URI
   - Убедитесь что MongoDB запущен

3. **Платежи не работают**
   - Проверьте API ключи
   - Настройте webhook URLs

4. **WebSocket ошибки**
   - Проверьте CORS настройки
   - Убедитесь что порты открыты

### Логи отладки

```bash
# Включить debug логи
DEBUG=* npm run dev

# Просмотр логов MongoDB
tail -f /var/log/mongodb/mongod.log

# Просмотр системных логов
journalctl -u casino-app -f
```

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE) файл.

## 🤝 Вклад в проект

1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📞 Поддержка

- **Email**: support@your-domain.com
- **Telegram**: [@your_support_bot](https://t.me/your_support_bot)
- **Issues**: [GitHub Issues](https://github.com/your-username/telegram-casino-miniapp/issues)

## 🙏 Благодарности

- [Telegram Web Apps](https://core.telegram.org/bots/webapps) - за API
- [React](https://reactjs.org/) - за отличную библиотеку
- [Framer Motion](https://www.framer.com/motion/) - за анимации
- [Styled Components](https://styled-components.com/) - за стилизацию

---

⭐ **Поставьте звезду если проект был полезен!**