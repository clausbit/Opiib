require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const crypto = require('crypto');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Bot configuration
const BOT_TOKEN = process.env.BOT_TOKEN || '7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://agrobmin.com.ua';
const WEBHOOK_URL = `${WEBAPP_URL}/webhook`;

// Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN);

// In-memory storage (in production, use a proper database)
const users = new Map();
const gameData = new Map();
const referrals = new Map();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for Mini App compatibility
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: ['https://web.telegram.org', 'https://agrobmin.com.ua'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Set webhook
async function setWebhook() {
    try {
        await bot.setWebHook(WEBHOOK_URL, {
            allowed_updates: ['message', 'callback_query', 'inline_query']
        });
        console.log(`✅ Webhook set to: ${WEBHOOK_URL}`);
    } catch (error) {
        console.error('❌ Error setting webhook:', error);
    }
}

// Webhook endpoint
app.post('/webhook', (req, res) => {
    try {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
});

// Bot command handlers
bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const firstName = msg.from.first_name || 'Player';
    const username = msg.from.username || '';
    const referralCode = match[1] ? match[1].trim() : '';
    
    // Store user data
    users.set(userId, {
        id: userId,
        chatId: chatId,
        firstName: firstName,
        username: username,
        photoUrl: null,
        balance: 100.0, // Starting balance
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        referredBy: null,
        totalBets: 0,
        totalWins: 0
    });
    
    // Handle referral
    if (referralCode.startsWith('ref_')) {
        const referrerId = parseInt(referralCode.substring(4));
        if (referrerId && referrerId !== userId && users.has(referrerId)) {
            const user = users.get(userId);
            user.referredBy = referrerId;
            users.set(userId, user);
            
            // Add referral bonus
            const referrer = users.get(referrerId);
            if (referrer) {
                referrer.balance += 3; // 3 AI bonus for referral
                users.set(referrerId, referrer);
                
                // Notify referrer
                try {
                    await bot.sendMessage(referrer.chatId, 
                        `🎉 Great! ${firstName} joined using your referral link! You earned 3 AI bonus!`);
                } catch (e) {
                    console.log('Could not notify referrer:', e.message);
                }
            }
            
            // Track referral
            if (!referrals.has(referrerId)) {
                referrals.set(referrerId, []);
            }
            referrals.get(referrerId).push({
                userId: userId,
                firstName: firstName,
                joinedAt: new Date().toISOString()
            });
        }
    }
    
    // Get user's profile photo
    try {
        const photos = await bot.getUserProfilePhotos(userId, { limit: 1 });
        if (photos.total_count > 0) {
            const photo = photos.photos[0][0];
            const fileInfo = await bot.getFile(photo.file_id);
            const user = users.get(userId);
            user.photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
            users.set(userId, user);
        }
    } catch (e) {
        console.log('Could not get user photo:', e.message);
    }
    
    // Welcome message with Mini App button
    const welcomeMessage = `🎮 Welcome to **Neon Roll Casino**, ${firstName}! 🎰

🌟 Experience the thrill of casino gaming with stunning neon graphics
💎 Win up to **x45 multiplier** on your bets
🎯 Complete tasks and earn rewards
👥 Invite friends and get bonuses
💰 You start with **100 AI** tokens!

Ready to roll? 🎲`;

    const keyboard = {
        inline_keyboard: [[
            {
                text: '🎮 PLAY NEON ROLL 🎮',
                web_app: { url: WEBAPP_URL }
            }
        ], [
            {
                text: '👥 Invite Friends',
                callback_data: 'invite_friends'
            },
            {
                text: '📊 My Stats',
                callback_data: 'my_stats'
            }
        ]]
    };

    await bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
    });
});

// Help command
bot.onText(/\/help/, async (msg) => {
    const helpMessage = `🎰 **Neon Roll Casino Help** 🎰

🎮 **How to Play:**
• Choose a color (Red, Blue, Green, Yellow)
• Place your bet (minimum 1 AI)
• Wait for the roll every 15 seconds
• Win big with multipliers!

🎯 **Multipliers:**
• Red/Blue: x2.2 (higher chance)
• Green: x5 (medium chance)  
• Yellow: x45 (rare but huge!)

💰 **Features:**
• Complete daily tasks for rewards
• Refer friends and earn 3 AI + commissions
• Manage your crypto deposits/withdrawals
• Track your gaming statistics

🔧 **Commands:**
/start - Start the game
/help - Show this help
/stats - View your statistics
/invite - Get your invite link

Good luck and have fun! 🍀`;

    await bot.sendMessage(msg.chat.id, helpMessage, {
        parse_mode: 'Markdown'
    });
});

// Stats command
bot.onText(/\/stats/, async (msg) => {
    const userId = msg.from.id;
    const user = users.get(userId);
    
    if (!user) {
        await bot.sendMessage(msg.chat.id, 'Please start the bot first with /start');
        return;
    }
    
    const userReferrals = referrals.get(userId) || [];
    const winRate = user.totalBets > 0 ? ((user.totalWins / user.totalBets) * 100).toFixed(1) : '0';
    
    const statsMessage = `📊 **Your Neon Roll Statistics** 📊

👤 **Player:** ${user.firstName}
💰 **Balance:** ${user.balance.toFixed(2)} AI
🎲 **Total Bets:** ${user.totalBets}
🏆 **Total Wins:** ${user.totalWins}
📈 **Win Rate:** ${winRate}%
👥 **Referrals:** ${userReferrals.length}
📅 **Joined:** ${new Date(user.joinedAt).toLocaleDateString()}

Keep playing to improve your stats! 🚀`;

    await bot.sendMessage(msg.chat.id, statsMessage, {
        parse_mode: 'Markdown'
    });
});

// Invite command
bot.onText(/\/invite/, async (msg) => {
    const userId = msg.from.id;
    const inviteLink = `https://t.me/${(await bot.getMe()).username}?start=ref_${userId}`;
    
    const inviteMessage = `👥 **Invite Friends to Neon Roll Casino!** 👥

Share this link with your friends:
\`${inviteLink}\`

🎁 **Your Benefits:**
• Get 3 AI for each friend who joins
• Earn 5% from their bets (1st level)
• Earn 1% from 2nd and 3rd level referrals
• No limits on earnings!

The more friends you invite, the more you earn! 💰`;

    const keyboard = {
        inline_keyboard: [[
            {
                text: '📤 Share Invite Link',
                switch_inline_query: `🎮 Join me in Neon Roll Casino! 💎\n\nWin up to x45 multiplier and earn AI tokens!\n\n${inviteLink}`
            }
        ]]
    };

    await bot.sendMessage(msg.chat.id, inviteMessage, {
        reply_markup: keyboard,
        parse_mode: 'Markdown'
    });
});

// Callback query handler
bot.on('callback_query', async (query) => {
    const userId = query.from.id;
    const chatId = query.message.chat.id;
    const data = query.data;
    
    await bot.answerCallbackQuery(query.id);
    
    switch (data) {
        case 'invite_friends':
            await bot.sendMessage(chatId, 'Use /invite command to get your referral link!');
            break;
            
        case 'my_stats':
            // Trigger stats command
            await bot.sendMessage(chatId, 'Loading your statistics...');
            // Send stats
            const user = users.get(userId);
            if (user) {
                const userReferrals = referrals.get(userId) || [];
                const winRate = user.totalBets > 0 ? ((user.totalWins / user.totalBets) * 100).toFixed(1) : '0';
                
                const statsMessage = `📊 **Your Statistics** 📊
                
💰 Balance: ${user.balance.toFixed(2)} AI
🎲 Total Bets: ${user.totalBets}
🏆 Total Wins: ${user.totalWins}
📈 Win Rate: ${winRate}%
👥 Referrals: ${userReferrals.length}`;

                await bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
            }
            break;
    }
});

// API Routes

// Get user data
app.get('/api/user/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.get(userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't expose sensitive data
    const publicUser = {
        id: user.id,
        firstName: user.firstName,
        username: user.username,
        photoUrl: user.photoUrl,
        balance: user.balance,
        totalBets: user.totalBets,
        totalWins: user.totalWins
    };
    
    res.json(publicUser);
});

// Update user balance
app.post('/api/user/:userId/balance', (req, res) => {
    const userId = parseInt(req.params.userId);
    const { amount, type } = req.body; // type: 'add' or 'subtract'
    
    const user = users.get(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    if (type === 'add') {
        user.balance += amount;
    } else if (type === 'subtract') {
        user.balance = Math.max(0, user.balance - amount);
    }
    
    user.lastActive = new Date().toISOString();
    users.set(userId, user);
    
    res.json({ balance: user.balance });
});

// Place bet
app.post('/api/bet', (req, res) => {
    const { userId, color, multiplier, amount } = req.body;
    
    const user = users.get(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    if (amount > user.balance) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Update user stats
    user.totalBets += 1;
    user.lastActive = new Date().toISOString();
    users.set(userId, user);
    
    res.json({ success: true, newBalance: user.balance });
});

// Record win
app.post('/api/win', (req, res) => {
    const { userId, amount } = req.body;
    
    const user = users.get(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    user.totalWins += 1;
    user.balance += amount;
    user.lastActive = new Date().toISOString();
    users.set(userId, user);
    
    res.json({ success: true, newBalance: user.balance });
});

// Get referrals
app.get('/api/referrals/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userReferrals = referrals.get(userId) || [];
    
    res.json({
        level1: userReferrals.length,
        level2: 0, // Simplified for demo
        level3: 0,
        referrals: userReferrals
    });
});

// Verify Telegram Web App data
function verifyTelegramWebApp(initData) {
    // This would normally verify the hash from Telegram
    // For demo purposes, we'll skip verification
    return true;
}

// Main route - serve the Mini App
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        users: users.size,
        uptime: process.uptime()
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Neon Roll Casino server running on port ${PORT}`);
    console.log(`🌐 Web App URL: ${WEBAPP_URL}`);
    console.log(`🤖 Bot Token: ${BOT_TOKEN.substring(0, 10)}...`);
    
    // Set webhook
    await setWebhook();
    
    // Log bot info
    try {
        const botInfo = await bot.getMe();
        console.log(`🤖 Bot @${botInfo.username} is ready!`);
        console.log(`📱 Mini App: https://t.me/${botInfo.username}`);
    } catch (error) {
        console.error('❌ Error getting bot info:', error);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;