import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback hook for when not using provider
    return useAuthHook();
  }
  return context;
};

const useAuthHook = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Check for saved user data
    const savedUser = localStorage.getItem('casino_user');
    const savedToken = localStorage.getItem('casino_token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        
        // Fetch current user data
        fetchUserData();
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
      setBalance(response.data.user.balance || 0);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (userData) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post('/api/auth/login', {
        telegramData: userData
      });

      const { user: userInfo, token, balance: userBalance } = response.data;
      
      // Save to localStorage
      localStorage.setItem('casino_user', JSON.stringify(userInfo));
      localStorage.setItem('casino_token', token);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userInfo);
      setBalance(userBalance || 0);
      setIsAuthenticated(true);
      
      return { success: true, user: userInfo };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('casino_user');
    localStorage.removeItem('casino_token');
    
    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Reset state
    setUser(null);
    setBalance(0);
    setIsAuthenticated(false);
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    if (user) {
      const updatedUser = { ...user, balance: newBalance };
      setUser(updatedUser);
      localStorage.setItem('casino_user', JSON.stringify(updatedUser));
    }
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('casino_user', JSON.stringify(newUser));
  };

  const refreshBalance = async () => {
    try {
      const response = await axios.get('/api/user/balance');
      const newBalance = response.data.balance;
      updateBalance(newBalance);
      return newBalance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      return balance;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    balance,
    login,
    logout,
    updateBalance,
    updateUser,
    refreshBalance,
    fetchUserData
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};