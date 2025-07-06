"""
🎰 Casino Roll - Telegram Bot
Integration with Telegram Web App
"""

import json
import asyncio
import logging
from typing import Dict, Any, Optional
from datetime import datetime

import httpx
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import (
    Message, CallbackQuery, InlineKeyboardMarkup, 
    InlineKeyboardButton, WebAppInfo, MenuButtonWebApp
)
from aiogram.utils.keyboard import InlineKeyboardBuilder

from backend.config import settings, GAME_COLORS
from backend.database import UserModel, ReferralModel

logger = logging.getLogger(__name__)

# Глобальные переменные
bot: Optional[Bot] = None
dp: Optional[Dispatcher] = None

async def init_telegram_bot():
    """Инициализация Telegram бота"""
    global bot, dp
    
    try:
        # Создаем бота
        bot = Bot(token=settings.TELEGRAM_BOT_TOKEN)
        dp = Dispatcher()
        
        # Регистрируем обработчики
        register_handlers()
        
        # Настраиваем веб-приложение
        await setup_webapp()
        
        # Устанавливаем webhook
        await set_webhook()
        
        logger.info("✅ Telegram бот инициализирован")
        
    except Exception as e:
        logger.error(f"❌ Ошибка инициализации Telegram бота: {e}")
        raise

async def stop_telegram_bot():
    """Остановка Telegram бота"""
    global bot
    
    if bot:
        await bot.session.close()
        logger.info("✅ Telegram бот остановлен")

async def setup_webapp():
    """Настройка веб-приложения"""
    try:
        # Устанавливаем меню с веб-приложением
        webapp = WebAppInfo(url=settings.WEBAPP_URL)
        menu_button = MenuButtonWebApp(text="🎰 Играть", web_app=webapp)
        
        await bot.set_chat_menu_button(menu_button=menu_button)
        
        # Устанавливаем команды бота
        commands = [
            types.BotCommand(command="/start", description="🎰 Начать игру"),
            types.BotCommand(command="/play", description="🎮 Открыть казино"),
            types.BotCommand(command="/balance", description="💰 Проверить баланс"),
            types.BotCommand(command="/referral", description="👥 Реферальная программа"),
            types.BotCommand(command="/stats", description="📊 Моя статистика"),
            types.BotCommand(command="/help", description="ℹ️ Помощь"),
        ]
        
        await bot.set_my_commands(commands)
        
        logger.info("✅ Веб-приложение настроено")
        
    except Exception as e:
        logger.error(f"❌ Ошибка настройки веб-приложения: {e}")

async def set_webhook():
    """Установка webhook"""
    try:
        await bot.set_webhook(
            url=settings.WEBHOOK_URL,
            drop_pending_updates=True,
            allowed_updates=["message", "callback_query", "web_app_data"]
        )
        
        logger.info(f"✅ Webhook установлен: {settings.WEBHOOK_URL}")
        
    except Exception as e:
        logger.error(f"❌ Ошибка установки webhook: {e}")

def register_handlers():
    """Регистрация обработчиков сообщений"""
    
    @dp.message(CommandStart())
    async def start_handler(message: Message):
        """Обработчик команды /start"""
        try:
            user_data = extract_user_data(message.from_user)
            
            # Проверяем реферальный код
            referral_code = None
            if message.text and len(message.text.split()) > 1:
                start_param = message.text.split()[1]
                if start_param.startswith("ref_"):
                    referral_code = start_param[4:]
            
            # Получаем или создаем пользователя
            user = await UserModel.get_user_by_telegram_id(user_data["id"])
            
            if not user:
                # Создаем нового пользователя
                user = await UserModel.create_user(user_data)
                
                # Обрабатываем реферал
                if referral_code:
                    await process_referral(user["telegram_id"], referral_code)
                
                welcome_text = f"""
🎰 <b>Добро пожаловать в Casino Roll!</b>

Привет, <b>{user['first_name']}</b>! 👋

🎁 Вы получили <b>{settings.STARTING_BALANCE} AI</b> для начала игры!

🌟 <b>Особенности нашего казино:</b>
• 🎨 Неоновый дизайн с плавными анимациями
• 🎰 Классическая рулетка с 4 цветами
• 💰 Высокие множители до x45
• 👥 Реферальная программа 
• ⭐ Пополнение через Telegram Stars
• 🔐 Полная безопасность

🎮 <b>Нажмите кнопку ниже, чтобы начать играть!</b>
                """
            else:
                # Обновляем информацию пользователя
                await UserModel.update_user(user_data["id"], {
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                    "username": user_data.get("username", ""),
                    "photo_url": user_data.get("photo_url", "")
                })
                
                welcome_text = f"""
🎰 <b>С возвращением, {user['first_name']}!</b>

💰 Ваш баланс: <b>{user['balance']} AI</b>
🎮 Игр сыграно: <b>{user['games_played']}</b>
🏆 Выигрышей: <b>{user['wins']}</b>

🎲 <b>Готовы испытать удачу?</b>
                """
            
            # Создаем клавиатуру
            keyboard = create_main_keyboard()
            
            await message.answer(
                welcome_text,
                reply_markup=keyboard,
                parse_mode="HTML"
            )
            
        except Exception as e:
            logger.error(f"Ошибка в start_handler: {e}")
            await message.answer("❌ Произошла ошибка. Попробуйте позже.")
    
    @dp.message(Command("play"))
    async def play_handler(message: Message):
        """Обработчик команды /play"""
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="🎰 Играть в казино", 
                web_app=WebAppInfo(url=settings.WEBAPP_URL)
            )]
        ])
        
        await message.answer(
            "🎰 <b>Откройте веб-приложение для игры!</b>",
            reply_markup=keyboard,
            parse_mode="HTML"
        )
    
    @dp.message(Command("balance"))
    async def balance_handler(message: Message):
        """Обработчик команды /balance"""
        try:
            user = await UserModel.get_user_by_telegram_id(message.from_user.id)
            
            if not user:
                await message.answer("❌ Пользователь не найден. Используйте /start")
                return
            
            balance_text = f"""
💰 <b>Ваш баланс</b>

💎 Текущий баланс: <b>{user['balance']} AI</b>
📊 Всего поставлено: <b>{user['total_wagered']} AI</b>
🏆 Всего выиграно: <b>{user['total_won']} AI</b>
📈 Прибыль: <b>{user['total_won'] - user['total_wagered']} AI</b>

🎮 Игр сыграно: <b>{user['games_played']}</b>
✅ Выигрышей: <b>{user['wins']}</b>
❌ Проигрышей: <b>{user['losses']}</b>
            """
            
            keyboard = InlineKeyboardMarkup(inline_keyboard=[
                [
                    InlineKeyboardButton(text="💳 Пополнить", callback_data="deposit"),
                    InlineKeyboardButton(text="💸 Вывести", callback_data="withdraw")
                ],
                [InlineKeyboardButton(
                    text="🎰 Играть", 
                    web_app=WebAppInfo(url=settings.WEBAPP_URL)
                )]
            ])
            
            await message.answer(
                balance_text,
                reply_markup=keyboard,
                parse_mode="HTML"
            )
            
        except Exception as e:
            logger.error(f"Ошибка в balance_handler: {e}")
            await message.answer("❌ Произошла ошибка при получении баланса.")
    
    @dp.message(Command("referral"))
    async def referral_handler(message: Message):
        """Обработчик команды /referral"""
        try:
            user = await UserModel.get_user_by_telegram_id(message.from_user.id)
            
            if not user:
                await message.answer("❌ Пользователь не найден. Используйте /start")
                return
            
            # Получаем реферальную статистику
            referrals = await ReferralModel.get_user_referrals(user["telegram_id"])
            
            referral_link = f"https://t.me/{settings.TELEGRAM_BOT_USERNAME.replace('@', '')}?start=ref_{user['referral_code']}"
            
            referral_text = f"""
👥 <b>Реферальная программа</b>

🔗 Ваша реферальная ссылка:
<code>{referral_link}</code>

💰 <b>Комиссии:</b>
• 1-й уровень: <b>5%</b> с каждой ставки
• 2-й уровень: <b>1%</b> с каждой ставки  
• 3-й уровень: <b>1%</b> с каждой ставки

📊 <b>Ваша статистика:</b>
👥 Приглашено друзей: <b>{len(referrals)}</b>
💎 Заработано: <b>{user['referral_earnings']} AI</b>

🎁 <b>Приглашайте друзей и получайте пассивный доход!</b>
            """
            
            keyboard = InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(
                    text="📤 Поделиться ссылкой",
                    url=f"https://t.me/share/url?url={referral_link}&text=🎰 Играй в Casino Roll и зарабатывай!"
                )],
                [InlineKeyboardButton(
                    text="🎰 Играть", 
                    web_app=WebAppInfo(url=settings.WEBAPP_URL)
                )]
            ])
            
            await message.answer(
                referral_text,
                reply_markup=keyboard,
                parse_mode="HTML"
            )
            
        except Exception as e:
            logger.error(f"Ошибка в referral_handler: {e}")
            await message.answer("❌ Произошла ошибка при получении реферальной информации.")
    
    @dp.message(Command("help"))
    async def help_handler(message: Message):
        """Обработчик команды /help"""
        help_text = f"""
ℹ️ <b>Помощь - Casino Roll</b>

🎰 <b>Как играть:</b>
1. Выберите цвет (красный, синий, зеленый, желтый)
2. Поставьте сумму ставки
3. Нажмите "Сделать ставку"
4. Ждите результат!

🎨 <b>Цвета и множители:</b>
🔴 Красный: x2.2 (45.45% шанс)
🔵 Синий: x2.2 (45.45% шанс)
🟢 Зеленый: x5 (9% шанс)
🟡 Желтый: x45 (0.22% шанс)

💰 <b>Команды:</b>
/start - Начать игру
/play - Открыть казино
/balance - Проверить баланс
/referral - Реферальная программа
/stats - Статистика игр

🔗 <b>Домен:</b> {settings.DOMAIN}
🤖 <b>Поддержка:</b> @support

🎲 <b>Удачи в игре!</b>
        """
        
        keyboard = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(
                text="🎰 Играть", 
                web_app=WebAppInfo(url=settings.WEBAPP_URL)
            )]
        ])
        
        await message.answer(
            help_text,
            reply_markup=keyboard,
            parse_mode="HTML"
        )
    
    @dp.callback_query()
    async def callback_handler(callback: CallbackQuery):
        """Обработчик callback кнопок"""
        try:
            if callback.data == "deposit":
                keyboard = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(
                        text="💳 Пополнить баланс", 
                        web_app=WebAppInfo(url=f"{settings.WEBAPP_URL}/deposit")
                    )]
                ])
                
                await callback.message.edit_text(
                    "💳 <b>Пополнение баланса</b>\n\n"
                    "Откройте веб-приложение для пополнения баланса через:\n"
                    "⭐ Telegram Stars\n"
                    "₿ Криптовалюты (TON, BTC, ETH, USDT)\n"
                    "🔗 Крипто-кошельки",
                    reply_markup=keyboard,
                    parse_mode="HTML"
                )
                
            elif callback.data == "withdraw":
                keyboard = InlineKeyboardMarkup(inline_keyboard=[
                    [InlineKeyboardButton(
                        text="💸 Вывод средств", 
                        web_app=WebAppInfo(url=f"{settings.WEBAPP_URL}/withdraw")
                    )]
                ])
                
                await callback.message.edit_text(
                    "💸 <b>Вывод средств</b>\n\n"
                    "Откройте веб-приложение для вывода средств.",
                    reply_markup=keyboard,
                    parse_mode="HTML"
                )
            
            await callback.answer()
            
        except Exception as e:
            logger.error(f"Ошибка в callback_handler: {e}")
            await callback.answer("❌ Произошла ошибка")

def create_main_keyboard() -> InlineKeyboardMarkup:
    """Создание основной клавиатуры"""
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(
            text="🎰 Играть в Casino Roll", 
            web_app=WebAppInfo(url=settings.WEBAPP_URL)
        )],
        [
            InlineKeyboardButton(text="💰 Баланс", callback_data="balance"),
            InlineKeyboardButton(text="👥 Друзья", callback_data="referral")
        ],
        [
            InlineKeyboardButton(text="💳 Пополнить", callback_data="deposit"),
            InlineKeyboardButton(text="💸 Вывести", callback_data="withdraw")
        ]
    ])
    
    return keyboard

def extract_user_data(user: types.User) -> Dict[str, Any]:
    """Извлечение данных пользователя Telegram"""
    return {
        "id": user.id,
        "username": user.username or "",
        "first_name": user.first_name or "",
        "last_name": user.last_name or "",
        "language_code": user.language_code or "en",
        "is_premium": getattr(user, 'is_premium', False),
        "photo_url": ""  # Получается отдельно через API
    }

async def process_referral(user_id: int, referral_code: str):
    """Обработка реферальной программы"""
    try:
        # Находим пользователя-реферера
        referrer = await UserModel.get_user_by_referral_code(referral_code)
        
        if referrer and referrer["telegram_id"] != user_id:
            # Создаем реферальную связь
            await ReferralModel.create_referral(
                referrer_id=referrer["telegram_id"],
                referred_id=user_id
            )
            
            # Обновляем информацию о рефереле
            await UserModel.update_user(user_id, {"referred_by": referrer["telegram_id"]})
            
            # Отправляем уведомление рефереру
            await bot.send_message(
                referrer["telegram_id"],
                f"🎉 <b>Новый реферал!</b>\n\n"
                f"По вашей ссылке зарегистрировался новый игрок!\n"
                f"Теперь вы будете получать 5% с его ставок.",
                parse_mode="HTML"
            )
            
            logger.info(f"Создана реферальная связь: {referrer['telegram_id']} -> {user_id}")
            
    except Exception as e:
        logger.error(f"Ошибка обработки реферала: {e}")

async def process_telegram_update(update_data: Dict[str, Any]):
    """Обработка обновлений от Telegram"""
    try:
        update = types.Update(**update_data)
        await dp.feed_update(bot, update)
        
    except Exception as e:
        logger.error(f"Ошибка обработки Telegram update: {e}")

async def send_message_to_user(user_id: int, text: str, **kwargs):
    """Отправка сообщения пользователю"""
    try:
        await bot.send_message(user_id, text, **kwargs)
        return True
    except Exception as e:
        logger.error(f"Ошибка отправки сообщения {user_id}: {e}")
        return False

async def get_user_profile_photos(user_id: int) -> Optional[str]:
    """Получение аватара пользователя"""
    try:
        photos = await bot.get_user_profile_photos(user_id, limit=1)
        
        if photos.photos:
            photo = photos.photos[0][-1]  # Берем последнее (самое большое) фото
            file_info = await bot.get_file(photo.file_id)
            photo_url = f"https://api.telegram.org/file/bot{settings.TELEGRAM_BOT_TOKEN}/{file_info.file_path}"
            return photo_url
            
    except Exception as e:
        logger.error(f"Ошибка получения аватара {user_id}: {e}")
    
    return None