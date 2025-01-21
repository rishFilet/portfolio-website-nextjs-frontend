'use client';
import clsx from 'clsx';
import { useState } from 'react';

import { getThemeByName } from '@/lib/api/api.helpers';
import type { ThemeDataType } from '@/lib/api/api.types';

import { useTheme } from '../themeProvider/ThemeProvider';

import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const { themes, currentTheme, setCurrentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const switchTheme = async (theme: ThemeDataType) => {
    // Set cookie
    document.cookie = `selected-theme=${theme.uniqueName};path=/`;
    // Refresh the page to get new server-side props
    setCurrentTheme(theme);
    window.location.reload();
  };

  const handleThemeChange = async (themeName: string) => {
    setIsLoading(true);
    try {
      const newTheme = await getThemeByName(themeName);
      if (!newTheme) {
        throw new Error('Theme not found');
      }
      switchTheme(newTheme);
    } catch (error) {
      console.error('Failed to change theme', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.themeSwitchContainer}>
      {themes.map((theme) => (
        <button
          key={theme.uniqueName}
          onClick={() => handleThemeChange(theme.uniqueName)}
          className={styles.themeSwitchButton}
          disabled={isLoading}
          aria-label={`Switch to ${theme.uniqueName} theme`}
        >
          <i
            className={clsx(
              styles.themeIcon,
              currentTheme.uniqueName === theme.uniqueName && styles.activeThemeIcon,
              theme.fontAwesomeIcon,
              currentTheme.uniqueName === theme.uniqueName &&
                isLoading &&
                styles.isLoadingAndActive,
              currentTheme.uniqueName !== theme.uniqueName &&
                isLoading &&
                styles.isLoadingAndInactive,
            )}
          ></i>
        </button>
      ))}
    </div>
  );
}