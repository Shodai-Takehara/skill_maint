'use client';

import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useNextTheme();
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  return {
    theme: currentTheme,
    setTheme,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    toggleTheme: () => setTheme(currentTheme === 'dark' ? 'light' : 'dark'),
  };
};