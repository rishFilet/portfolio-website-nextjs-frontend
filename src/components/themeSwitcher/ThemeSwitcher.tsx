'use client';
import clsx from 'clsx';
import { useState } from 'react';
import Switch from 'react-switch';

import type { ThemeDataType } from '@/lib/api/api.types';

import { useTheme } from '../themeProvider/ThemeProvider';

import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const { themes, currentTheme, setCurrentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const [switchChecked, setSwitchChecked] = useState(currentTheme?.uniqueName === 'light');

  const darkTheme = themes.find((theme) => theme.uniqueName === 'dark');
  const lightTheme = themes.find((theme) => theme.uniqueName === 'light');

  const switchTheme = async (theme: ThemeDataType | undefined) => {
    if (!theme) {
      throw new Error('Light or dark theme not found');
    }
    // Set cookie
    document.cookie = `selected-theme=${theme.uniqueName};path=/`;
    // Refresh the page to get new server-side props
    setCurrentTheme(theme);
  };

  const handleThemeChange = async (checked: boolean) => {
    setIsLoading(true);
    try {
      setSwitchChecked(checked);
      switchTheme(checked ? lightTheme : darkTheme);
    } catch (error) {
      console.error('Failed to change theme', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label>
        <Switch
          onChange={handleThemeChange}
          checked={switchChecked}
          onColor={lightTheme?.accentColorHexCode}
          offColor={darkTheme?.accentColorHexCode}
          height={35}
          handleDiameter={32}
          width={75}
          checkedIcon={<i className={clsx(styles.themeIcon, lightTheme?.fontAwesomeIcon)}></i>}
          uncheckedIcon={<i className={clsx(styles.themeIcon, darkTheme?.fontAwesomeIcon)}></i>}
          boxShadow="0 1px 5px rgba(0, 0, 0, 0.6)"
        />
      </label>
    </div>
  );
}