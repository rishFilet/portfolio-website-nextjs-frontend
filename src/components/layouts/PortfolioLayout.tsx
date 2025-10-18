'use client';

import clsx from 'clsx';

import styles from '@/app/layout.module.css';
import Navigation from '@/components/navigation/Navigation';
import { useTheme } from '@/components/themeProvider/ThemeProvider';

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  const { currentTheme } = useTheme();

  return (
    <div
      className={clsx(
        styles.siteContainer,
        currentTheme?.uniqueName === 'none' && styles.loading,
      )}
    >
      <Navigation />
      <main
        className={clsx(
          styles.main,
          currentTheme?.uniqueName === 'none' && styles.loading,
        )}
      >
        {children}
      </main>
    </div>
  );
}