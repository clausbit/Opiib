# 🤖 Telegram Bot Setup Guide

This guide will walk you through setting up your Telegram bot for the Neon Roll Casino Mini App.

## 📋 Prerequisites

- A Telegram account
- Your domain with HTTPS (e.g., `https://agrobmin.com.ua`)
- Basic knowledge of Telegram bot commands

## 🚀 Step-by-Step Setup

### Step 1: Create Your Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a conversation** with BotFather by sending `/start`
3. **Create a new bot** by sending `/newbot`
4. **Choose a name** for your bot (e.g., "Neon Roll Casino")
5. **Choose a username** for your bot (must end with "bot", e.g., "neonrollcasino_bot")
6. **Save your bot token** - you'll need this for your `.env` file

Example conversation:
```
You: /newbot
BotFather: Alright, a new bot. How are we going to call it? Please choose a name for your bot.
You: Neon Roll Casino
BotFather: Good. Now let's choose a username for your bot. It must end in `bot`.
You: neonrollcasino_bot
BotFather: Done! Congratulations on your new bot. You will find it at t.me/neonrollcasino_bot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands.

Use this token to access the HTTP API:
7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI
```

### Step 2: Configure Bot Settings

#### Set Bot Description
```
/setdescription
@neonrollcasino_bot
🎰 Welcome to Neon Roll Casino! Experience the thrill of betting with stunning neon graphics. Win up to x45 multiplier! 💎 Complete tasks, invite friends, and enjoy the ultimate crypto gaming experience. 🚀
```

#### Set About Text
```
/setabouttext
@neonrollcasino_bot
🎮 Neon Roll Casino - The most exciting Telegram casino game with beautiful neon design, multiple betting options, referral system, and crypto integration. Play responsibly and have fun! 🎰✨
```

#### Set Bot Commands
```
/setcommands
@neonrollcasino_bot
start - 🎮 Start playing Neon Roll Casino
help - ❓ Get help and game instructions
stats - 📊 View your gaming statistics
invite - 👥 Get your referral link
```

#### Set Menu Button (Mini App)
```
/setmenubutton
@neonrollcasino_bot
🎮 PLAY NEON ROLL
https://agrobmin.com.ua
```

### Step 3: Upload Bot Avatar

1. **Prepare an image** (512x512 pixels recommended)
2. **Send the command**:
   ```
   /setuserpic
   @neonrollcasino_bot
   ```
3. **Upload your bot's profile picture** when prompted

### Step 4: Configure Privacy Settings

#### Allow Groups (Optional)
```
/setjoingroups
@neonrollcasino_bot
Enable
```

#### Set Group Privacy
```
/setprivacy
@neonrollcasino_bot
Disable
```

### Step 5: Set Up Inline Mode (Optional)

```
/setinline
@neonrollcasino_bot
🎰 Search Neon Roll Casino games...
```

```
/setinlinefeedback
@neonrollcasino_bot
Enable
```

## 🔧 Environment Configuration

Create your `.env` file with the bot token:

```env
BOT_TOKEN=7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI
WEBAPP_URL=https://agrobmin.com.ua
PORT=3000
NODE_ENV=production
```

## 🌐 Domain Setup

### Requirements
- **HTTPS is mandatory** for Telegram Mini Apps
- Domain must be accessible from the internet
- SSL certificate must be valid

### Testing Your Domain
```bash
# Test if your domain is accessible
curl -I https://agrobmin.com.ua

# Should return HTTP/1.1 200 OK or similar
```

## 🔗 Webhook Configuration

Your webhook will be automatically set when you start the server. The webhook URL will be:
```
https://agrobmin.com.ua/webhook
```

### Manual Webhook Setup (if needed)
```bash
# Set webhook
curl -F "url=https://agrobmin.com.ua/webhook" \
     "https://api.telegram.org/bot7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI/setWebhook"

# Check webhook info
curl "https://api.telegram.org/bot7967948563:AAEcl-6mW5kd4jaqjsRIqnv34egBWmh1LiI/getWebhookInfo"
```

## 🧪 Testing Your Bot

### 1. Basic Bot Test
1. Search for your bot in Telegram
2. Send `/start` command
3. You should receive a welcome message with the "PLAY NEON ROLL" button

### 2. Mini App Test
1. Tap the "🎮 PLAY NEON ROLL" button
2. The Mini App should load in Telegram
3. You should see the neon-themed casino interface

### 3. Functionality Test
- Try placing a bet
- Check if balance updates
- Test navigation between screens
- Verify sound effects work
- Test referral link generation

## 🔍 Troubleshooting

### Common Issues

#### Bot doesn't respond to commands
- ✅ Check if bot token is correct in `.env`
- ✅ Verify webhook is set correctly
- ✅ Check server logs for errors
- ✅ Ensure server is running and accessible

#### Mini App doesn't load
- ✅ Verify WEBAPP_URL uses HTTPS
- ✅ Check if domain is accessible
- ✅ Ensure SSL certificate is valid
- ✅ Check browser developer console for errors

#### Webhook errors
```bash
# Check webhook status
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"

# Delete webhook if needed
curl "https://api.telegram.org/bot<YOUR_TOKEN>/deleteWebhook"

# Set webhook again
curl -F "url=https://yourdomain.com/webhook" \
     "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook"
```

### Debug Commands

```bash
# Get bot info
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"

# Get webhook info
curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"

# Send test message
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/sendMessage" \
     -H "Content-Type: application/json" \
     -d '{"chat_id":"<CHAT_ID>","text":"Test message"}'
```

## 📱 Final Steps

1. **Test everything** thoroughly
2. **Share your bot** with friends for beta testing
3. **Monitor logs** for any issues
4. **Set up analytics** to track usage
5. **Prepare for launch** 🚀

## 🎉 Launch Checklist

- [ ] Bot responds to all commands
- [ ] Mini App loads correctly
- [ ] All game features work
- [ ] Sound effects play
- [ ] Referral system works
- [ ] Balance management functions
- [ ] Mobile responsive design
- [ ] Error handling works
- [ ] Server monitoring set up
- [ ] Backup system in place

## 🔐 Security Notes

- **Never share your bot token** publicly
- **Use environment variables** for sensitive data
- **Set up proper rate limiting**
- **Monitor for suspicious activity**
- **Keep your server updated**

## 📞 Support

If you encounter any issues:

1. **Check the logs** first
2. **Review the troubleshooting** section
3. **Test with debug commands**
4. **Contact support** if needed

---

**Congratulations! Your Neon Roll Casino bot is ready to roll! 🎰✨**

Remember to test everything thoroughly before going live, and always monitor your bot's performance and user feedback.