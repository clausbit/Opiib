import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export const useTelegram = () => {
  const [tg] = useState(WebApp);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (tg) {
      try {
        // Initialize Telegram Web App
        tg.ready();
        tg.expand();
        
        // Set theme
        tg.setHeaderColor('#0a0a0a');
        tg.setBackgroundColor('#0a0a0a');
        
        // Get user data
        const initData = tg.initDataUnsafe;
        if (initData && initData.user) {
          setUser(initData.user);
        }
        
        setIsReady(true);
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Hide main button initially
        tg.MainButton.hide();
        
      } catch (error) {
        console.error('Telegram Web App initialization error:', error);
        setIsReady(true); // Set ready even on error for development
      }
    }
  }, [tg]);

  const onClose = () => {
    tg.close();
  };

  const onToggleMainButton = () => {
    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  const showAlert = (message) => {
    tg.showAlert(message);
  };

  const showConfirm = (message, callback) => {
    tg.showConfirm(message, callback);
  };

  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (tg.HapticFeedback) {
      if (type === 'impact') {
        tg.HapticFeedback.impactOccurred(style);
      } else if (type === 'notification') {
        tg.HapticFeedback.notificationOccurred(style);
      } else if (type === 'selection') {
        tg.HapticFeedback.selectionChanged();
      }
    }
  };

  const setMainButton = (text, onClick, color = '#00fff0') => {
    tg.MainButton.setText(text);
    tg.MainButton.setParams({
      color: color,
      text_color: '#ffffff'
    });
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  };

  const hideMainButton = () => {
    tg.MainButton.hide();
  };

  const openLink = (url) => {
    tg.openLink(url);
  };

  const openTelegramLink = (url) => {
    tg.openTelegramLink(url);
  };

  const shareURL = (url, text) => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    tg.openTelegramLink(shareUrl);
  };

  const requestContact = () => {
    if (tg.requestContact) {
      tg.requestContact();
    }
  };

  const requestLocation = () => {
    if (tg.requestLocation) {
      tg.requestLocation();
    }
  };

  return {
    tg,
    user,
    isReady,
    queryId: tg?.initDataUnsafe?.query_id,
    colorScheme: tg?.colorScheme,
    themeParams: tg?.themeParams,
    isExpanded: tg?.isExpanded,
    viewportHeight: tg?.viewportHeight,
    viewportStableHeight: tg?.viewportStableHeight,
    onClose,
    onToggleMainButton,
    showAlert,
    showConfirm,
    hapticFeedback,
    setMainButton,
    hideMainButton,
    openLink,
    openTelegramLink,
    shareURL,
    requestContact,
    requestLocation
  };
};