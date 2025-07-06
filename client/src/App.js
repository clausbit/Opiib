import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WebApp from '@twa-dev/sdk';

// Pages
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TasksPage from './pages/TasksPage';
import FriendsPage from './pages/FriendsPage';

// Components
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';

// Hooks
import { useTelegram } from './hooks/useTelegram';
import { useAuth } from './hooks/useAuth';

// Utils
import { initializeApp } from './utils/telegram';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { tg, user: tgUser } = useTelegram();
  const { login, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Telegram Web App
        await initializeApp();
        
        // Set theme colors
        if (tg) {
          tg.setHeaderColor('#0a0a0a');
          tg.setBackgroundColor('#0a0a0a');
          tg.expand();
          tg.ready();
        }

        // Authenticate user if Telegram data is available
        if (tgUser) {
          const userData = {
            id: tgUser.id,
            username: tgUser.username,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
            photoUrl: tgUser.photo_url,
            languageCode: tgUser.language_code
          };
          
          await login(userData);
          setUser(userData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    init();
  }, [tg, tgUser, login]);

  // Show main button based on current page
  useEffect(() => {
    if (tg) {
      tg.MainButton.hide();
    }
  }, [tg]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="app">
        {/* Background Effects */}
        <div className="background-effects">
          <div className="neon-grid"></div>
          <div className="floating-particles"></div>
        </div>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<GamePage user={user} />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/deposit" element={<DepositPage user={user} />} />
            <Route path="/withdraw" element={<WithdrawPage user={user} />} />
            <Route path="/tasks" element={<TasksPage user={user} />} />
            <Route path="/friends" element={<FriendsPage user={user} />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <Navigation />

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(26, 26, 46, 0.95)',
              color: '#ffffff',
              border: '1px solid #00fff0',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 20px rgba(0, 255, 240, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#39ff14',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ff073a',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;