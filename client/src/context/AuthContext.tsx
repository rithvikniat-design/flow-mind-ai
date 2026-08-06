import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  signup: (details: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('flowmind_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('flowmind_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const data = await authService.me();
          setUser(data.user);
          localStorage.setItem('flowmind_user', JSON.stringify(data.user));
        } catch (err) {
          console.warn('Expired token, logging out.');
          logout();
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('flowmind_token', data.token);
      localStorage.setItem('flowmind_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details: any) => {
    setLoading(true);
    try {
      const data = await authService.signup(details);
      localStorage.setItem('flowmind_token', data.token);
      localStorage.setItem('flowmind_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('flowmind_token');
    localStorage.removeItem('flowmind_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
