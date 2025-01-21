'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { ThemeDataType } from '@/lib/api/api.types';

interface ThemeContextType {
  currentTheme: ThemeDataType;
  setCurrentTheme: (theme: ThemeDataType) => void;
  themes: ThemeDataType[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme,
  initialThemes,
}: {
  children: React.ReactNode;
  initialTheme: ThemeDataType;
  initialThemes: ThemeDataType[];
}) {
  const [currentTheme, setCurrentTheme] = useState<ThemeDataType>(initialTheme);
  useEffect(() => {
    const root = document.documentElement;

    // Update all theme-related CSS variables
    root.style.setProperty('--color-primary', currentTheme.primaryColorHexCode);
    root.style.setProperty('--color-secondary', currentTheme.secondaryColorHexCode);
    root.style.setProperty('--color-accent', currentTheme.accentColorHexCode);
    root.style.setProperty('--color-font', currentTheme.fontColorHexCode);

    // You can also add dark mode variables if needed
    // root.style.setProperty('--color-primary-dark', currentTheme.colors.primaryDark);
  }, [currentTheme]);
  return (
    <ThemeContext.Provider value={{ themes: initialThemes, currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
