import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || `http://localhost:7777/api`;

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Token storage key
const TOKEN_KEY = 'auth_token';

// Helper functions for token management
const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Configure axios interceptor to automatically add Authorization header
axios.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = getStoredToken();
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get('/auth/me');
      // Backend response structure: { success: true, data: { user } }
      setUser(response.data.data?.user || null);
    } catch (error) {
      console.error('Auth check failed:', error);
      // If auth check fails, clear stored token and user
      removeStoredToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('Attempting login with username:', username);
      const response = await axios.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      // Store the token - backend response structure: { success: true, data: { user, token } }
      if (response.data.data?.token) {
        console.log('Storing token:', response.data.data.token.substring(0, 20) + '...');
        setStoredToken(response.data.data.token);
      } else {
        console.log('No token found in response');
      }
      
      const user = response.data.data?.user || null;
      console.log('Setting user:', user);
      setUser(user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setUser(null);
      removeStoredToken();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await axios.post('/auth/register', { username, email, password });
      
      // Store the token - backend response structure: { success: true, data: { user, token } }
      if (response.data.data?.token) {
        setStoredToken(response.data.data.token);
      }
      
      setUser(response.data.data?.user || null);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setUser(null);
      removeStoredToken();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      removeStoredToken();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
