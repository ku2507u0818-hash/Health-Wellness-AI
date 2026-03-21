import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../lib/i18n';

type FontSize = '14px' | '16px' | '18px';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem('arogya_lang') as Language) || 'en'
  );
  const [theme, setThemeState] = useState<'light' | 'dark'>(
    (localStorage.getItem('arogya_dark') === 'true' ? 'dark' : 'light')
  );
  const [fontSize, setFontSizeState] = useState<FontSize>(
    (localStorage.getItem('arogya_fontsize') as FontSize) || '16px'
  );
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('arogya_token')
  );

  const setLanguage = (lang: Language) => {
    localStorage.setItem('arogya_lang', lang);
    setLanguageState(lang);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    localStorage.setItem('arogya_dark', newTheme === 'dark' ? 'true' : 'false');
    setThemeState(newTheme);
  };

  const setFontSize = (size: FontSize) => {
    localStorage.setItem('arogya_fontsize', size);
    setFontSizeState(size);
  };

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('arogya_token', newToken);
    } else {
      localStorage.removeItem('arogya_token');
    }
    setTokenState(newToken);
  };

  const logout = () => {
    setToken(null);
    window.location.href = '/login';
  };

  // Apply theme and font size to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.fontSize = fontSize;
  }, [theme, fontSize]);

  return (
    <AppStateContext.Provider
      value={{ language, setLanguage, theme, setTheme, fontSize, setFontSize, token, setToken, logout }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
