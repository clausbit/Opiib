# 🎰 Neon Roll Casino - Telegram Mini App 🎰

A stunning casino game with neon-style design built as a Telegram Mini App. Experience the thrill of betting with beautiful animations, sound effects, and engaging gameplay!

## ✨ Features

### 🎮 Game Features
- **Stunning Neon Design**: Dark theme with bright neon colors (blue, green, red, yellow, purple)
- **3x3 Color Grid**: Interactive betting grid with smooth animations
- **Multiple Multipliers**: Win up to x45 with different color combinations
- **Real-time Rolling**: 15-second game rounds with countdown timer
- **Sound Effects**: Web Audio API-powered sound system
- **Game History**: Track last 5 games with visual indicators

### 💰 Economy Features
- **Balance Management**: AI token-based economy
- **Crypto Integration**: Support for multiple cryptocurrencies (TON, USDT, TRX, BNB, BTC, LTC, DOGE, USDC)
- **Deposit/Withdrawal**: Simulated crypto wallet system
- **Starting Balance**: 100 AI tokens for new users

### 👥 Social Features
- **Referral System**: 3-level referral program with commissions
- **Friend Invites**: Easy sharing with 2-click invite system
- **User Profiles**: Telegram integration with avatars and usernames
- **Player Lists**: Real-time player activity display

### 🎯 Gamification
- **Task System**: Complete challenges for rewards
- **Achievement Tracking**: Betting and referral milestones
- **Statistics**: Comprehensive player stats and analytics
- **Leaderboards**: Competition features

### 📱 Technical Features
- **Responsive Design**: Optimized for mobile devices
- **PWA Ready**: Fast loading and offline capabilities
- **Telegram Integration**: Full Web App API support
- **Haptic Feedback**: Native mobile feedback
- **Cross-platform**: Works on iOS, Android, and Desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Telegram Bot Token
- Domain with HTTPS (required for Mini Apps)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/neon-roll-casino.git
cd neon-roll-casino
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env file with your settings
```

4. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required
BOT_TOKEN=your_telegram_bot_token
WEBAPP_URL=https://yourdomain.com

# Optional
PORT=3000
NODE_ENV=production
STARTING_BALANCE=100.0
```

### Telegram Bot Setup

1. **Create a new bot** with [@BotFather](https://t.me/BotFather)
2. **Get your bot token** from BotFather
3. **Set up the Mini App**:
   ```
   /setmenubutton
   @yourbotname
   🎮 Play Neon Roll
   https://yourdomain.com
   ```

4. **Configure bot settings**:
   ```
   /setdescription - Set bot description
   /setabouttext - Set about text
   /setuserpic - Upload bot avatar
   ```

## 🎯 Game Mechanics

### Betting System
- **Red/Blue**: 40% chance each, x2.2 multiplier
- **Green**: 18% chance, x5 multiplier  
- **Yellow**: 2% chance, x45 multiplier

### Referral Program
- **Level 1**: 5% commission from direct referrals
- **Level 2**: 1% commission from 2nd level
- **Level 3**: 1% commission from 3rd level
- **Signup Bonus**: 3 AI tokens per referral

### Task Rewards
**Friend Tasks:**
- 3 friends: 21 AI
- 7 friends: 28 AI
- 15 friends: 40 AI
- 50 friends: 140 AI

**Betting Tasks:**
- 500 bets: 25 AI
- 1000 bets: 50 AI
- 5000 bets: 250 AI
- 25000 bets: 1250 AI

## 🎨 Design System

### Color Palette
- **Primary**: #00f5ff (Cyan)
- **Secondary**: #ff006e (Pink)
- **Success**: #00ff88 (Green)
- **Warning**: #ffff00 (Yellow)
- **Accent**: #8338ec (Purple)
- **Background**: #0a0a0a to #1a1a2e (Dark gradient)

### Typography
- **Font**: Arial, sans-serif
- **Sizes**: 12px (small) to 24px (titles)
- **Effects**: Neon glow with text-shadow

### Animations
- **Smooth transitions**: 0.3s ease
- **Grid spinning**: Rotation + scale effects
- **Particle systems**: Win celebrations
- **Gradient shifts**: Color cycling

## 📁 File Structure

```
neon-roll-casino/
├── index.html          # Main Mini App HTML
├── styles.css          # Neon styling and animations
├── app.js             # Main application logic
├── game.js            # Game engine and mechanics
├── server.js          # Node.js backend server
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
├── README.md          # This file
└── assets/           # Images and media (if any)
```

## 🚢 Deployment

### Option 1: Digital Ocean / VPS

1. **Set up server**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone and setup
git clone https://github.com/yourusername/neon-roll-casino.git
cd neon-roll-casino
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
nano .env
```

3. **Start with PM2**
```bash
pm2 start server.js --name "neon-roll"
pm2 startup
pm2 save
```

4. **Setup Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Heroku

1. **Create Heroku app**
```bash
heroku create neon-roll-casino
```

2. **Set environment variables**
```bash
heroku config:set BOT_TOKEN=your_token
heroku config:set WEBAPP_URL=https://neon-roll-casino.herokuapp.com
```

3. **Deploy**
```bash
git push heroku main
```

### Option 3: Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard

## 📱 Usage

### For Players

1. **Start the bot**: Search for your bot in Telegram
2. **Tap "Play"**: Launch the Mini App
3. **Place bets**: Choose color and amount
4. **Wait for results**: 15-second rounds
5. **Invite friends**: Earn referral bonuses
6. **Complete tasks**: Get reward bonuses

### For Developers

#### Adding New Features

```javascript
// Example: Add new color
// In game.js
const newColor = {
    name: 'purple',
    weight: 5,
    multiplier: 10.0
};

// In styles.css
.grid-cell.purple {
    background: linear-gradient(45deg, #8338ec, #b794f6);
    box-shadow: 0 0 20px rgba(131, 56, 236, 0.5);
}
```

#### API Endpoints

- `GET /api/user/:userId` - Get user data
- `POST /api/bet` - Place a bet
- `POST /api/win` - Record a win
- `GET /api/referrals/:userId` - Get referral data
- `GET /health` - Health check

## 🔒 Security

### Best Practices Implemented
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for Telegram domains
- Helmet.js for security headers
- Environment variable protection

### Additional Recommendations
- Use HTTPS everywhere
- Implement proper authentication for API endpoints
- Add request logging and monitoring
- Set up database backups (if using persistent storage)
- Monitor for suspicious betting patterns

## 🐛 Troubleshooting

### Common Issues

**Bot not responding**
- Check bot token in .env file
- Verify webhook URL is accessible
- Check server logs for errors

**Mini App not loading**
- Ensure WEBAPP_URL uses HTTPS
- Check CORS settings
- Verify static files are served correctly

**Audio not working**
- Web Audio API requires user interaction
- Check browser compatibility
- Verify sound is enabled in app settings

**Webhook errors**
- Ensure webhook endpoint is accessible
- Check Telegram webhook info with `/getWebhookInfo`
- Verify SSL certificate is valid

### Debug Commands

```bash
# Check bot info
curl https://api.telegram.org/bot<TOKEN>/getMe

# Check webhook
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# Test webhook
curl -X POST https://yourdomain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

## 📊 Analytics & Monitoring

### Metrics to Track
- Daily/Monthly Active Users (DAU/MAU)
- Bet volume and frequency
- Win/loss ratios
- Referral conversion rates
- Task completion rates
- User retention

### Recommended Tools
- **Google Analytics**: Web traffic
- **Mixpanel**: User behavior
- **Sentry**: Error tracking
- **DataDog**: Server monitoring
- **Telegram Analytics**: Bot metrics

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Telegram**: @yourusername
- **Email**: support@yourdomain.com

## 🚀 Roadmap

### Phase 1 (Current)
- ✅ Basic game mechanics
- ✅ Neon design system
- ✅ Telegram integration
- ✅ Referral system

### Phase 2 (Next)
- 🔄 Database integration
- 🔄 Real crypto payments
- 🔄 Advanced analytics
- 🔄 Tournament system

### Phase 3 (Future)
- 📋 Multiple game modes
- 📋 NFT integration
- 📋 Advanced social features
- 📋 Mobile app version

---

## 🎉 Get Started Today!

Ready to launch your own Neon Roll Casino? Follow the setup instructions above and start building your crypto gaming empire!

**Happy Gaming! 🎰✨**