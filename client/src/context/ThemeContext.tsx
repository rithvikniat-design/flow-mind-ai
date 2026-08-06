import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'obsidian' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('flowmind_theme') as ThemeMode;
    if (saved === 'obsidian' || saved === 'dark' || saved === 'light') return saved;
    // Default to Enterprise Obsidian for sharp, high-density infrastructure aesthetic
    return 'obsidian';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-obsidian', 'dark', 'light');
    
    if (theme === 'obsidian') {
      root.classList.add('dark', 'theme-obsidian');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    localStorage.setItem('flowmind_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'obsidian') return 'dark';
      if (prev === 'dark') return 'light';
      return 'obsidian';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

