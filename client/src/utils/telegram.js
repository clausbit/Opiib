import WebApp from '@twa-dev/sdk';

export const initializeApp = async () => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize Telegram Web App
      tg.ready();
      tg.expand();
      
      // Set colors
      tg.setHeaderColor('#0a0a0a');
      tg.setBackgroundColor('#0a0a0a');
      
      // Enable closing confirmation
      tg.enableClosingConfirmation();
      
      resolve(tg);
    } else {
      // Fallback for development
      console.warn('Telegram Web App not available, using fallback');
      resolve(null);
    }
  });
};

export const validateTelegramData = (initData) => {
  // In production, you should validate the data hash
  // For now, we'll just check if the data exists
  return initData && initData.user;
};

export const formatTelegramUser = (tgUser) => {
  return {
    id: tgUser.id,
    username: tgUser.username || '',
    firstName: tgUser.first_name || '',
    lastName: tgUser.last_name || '',
    photoUrl: tgUser.photo_url || '',
    languageCode: tgUser.language_code || 'en',
    isPremium: tgUser.is_premium || false
  };
};

export const generateInviteLink = (userId, referralCode) => {
  const botUsername = process.env.REACT_APP_BOT_USERNAME || 'your_bot';
  return `https://t.me/${botUsername}?start=${referralCode}_${userId}`;
};

export const shareInviteLink = (link, text) => {
  if (window.Telegram?.WebApp) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    window.Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    // Fallback - copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      return true;
    }
    return false;
  }
};

export const hapticFeedback = (type = 'impact', style = 'medium') => {
  if (window.Telegram?.WebApp?.HapticFeedback) {
    const hf = window.Telegram.WebApp.HapticFeedback;
    
    switch (type) {
      case 'impact':
        hf.impactOccurred(style); // 'light', 'medium', 'heavy', 'rigid', 'soft'
        break;
      case 'notification':
        hf.notificationOccurred(style); // 'error', 'success', 'warning'
        break;
      case 'selection':
        hf.selectionChanged();
        break;
      default:
        hf.impactOccurred('medium');
    }
  }
};

export const showAlert = (message) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  } else {
    alert(message);
  }
};

export const showConfirm = (message) => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, resolve);
    } else {
      resolve(confirm(message));
    }
  });
};

export const setMainButton = (text, onClick, color = '#00fff0') => {
  if (window.Telegram?.WebApp) {
    const mainButton = window.Telegram.WebApp.MainButton;
    mainButton.setText(text);
    mainButton.setParams({
      color: color,
      text_color: '#ffffff'
    });
    mainButton.onClick(onClick);
    mainButton.show();
  }
};

export const hideMainButton = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.MainButton.hide();
  }
};

export const expandApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.expand();
  }
};

export const closeApp = () => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.close();
  }
};

export const openLink = (url, options = {}) => {
  if (window.Telegram?.WebApp) {
    if (options.tryInstantView) {
      window.Telegram.WebApp.openLink(url, { try_instant_view: true });
    } else {
      window.Telegram.WebApp.openLink(url);
    }
  } else {
    window.open(url, '_blank');
  }
};

export const openTelegramLink = (url) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
};

export const getColorScheme = () => {
  return window.Telegram?.WebApp?.colorScheme || 'dark';
};

export const getThemeParams = () => {
  return window.Telegram?.WebApp?.themeParams || {
    bg_color: '#0a0a0a',
    text_color: '#ffffff',
    hint_color: '#b0b0b0',
    link_color: '#00fff0',
    button_color: '#00fff0',
    button_text_color: '#ffffff'
  };
};

export const getViewportData = () => {
  const tg = window.Telegram?.WebApp;
  return {
    height: tg?.viewportHeight || window.innerHeight,
    stableHeight: tg?.viewportStableHeight || window.innerHeight,
    isExpanded: tg?.isExpanded || false
  };
};

export const isInTelegram = () => {
  return !!(window.Telegram?.WebApp?.initData);
};

export const getTelegramVersion = () => {
  return window.Telegram?.WebApp?.version || '6.0';
};

export const requestContact = () => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp?.requestContact) {
      window.Telegram.WebApp.requestContact(resolve);
    } else {
      resolve(null);
    }
  });
};

export const requestLocation = () => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp?.requestLocation) {
      window.Telegram.WebApp.requestLocation(resolve);
    } else {
      resolve(null);
    }
  });
};

export const invoiceClosed = (callback) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.onEvent('invoiceClosed', callback);
  }
};

export const popupClosed = (callback) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.onEvent('popupClosed', callback);
  }
};

export const themeChanged = (callback) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.onEvent('themeChanged', callback);
  }
};

export const viewportChanged = (callback) => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.onEvent('viewportChanged', callback);
  }
};