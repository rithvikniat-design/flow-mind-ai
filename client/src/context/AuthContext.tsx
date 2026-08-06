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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          // 5-second timeout safeguard for network requests
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Profile request timeout')), 5000)
          );
          const data: any = await Promise.race([authService.me(), timeoutPromise]);
          if (isMounted && data?.user) {
            setUser(data.user);
            localStorage.setItem('flowmind_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn('Unable to verify profile token:', err);
          if (isMounted) logout();
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, [token]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data?.token && data?.user) {
        localStorage.setItem('flowmind_token', data.token);
        localStorage.setItem('flowmind_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error('Invalid authentication response from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details: any) => {
    setLoading(true);
    try {
      const data = await authService.signup(details);
      if (data?.token && data?.user) {
        localStorage.setItem('flowmind_token', data.token);
        localStorage.setItem('flowmind_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      } else {
        throw new Error('Invalid registration response from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('flowmind_token');
    localStorage.removeItem('flowmind_user');
    setToken(null);
    setUser(null);
    setLoading(false);
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
