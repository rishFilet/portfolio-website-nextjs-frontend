// This file is not really necessary to bring in the theme data,
// but it is there in case other providers are needed
'use client';

import { ScrollProvider } from '@/components/scrollProvider/ScrollProvider';
import { ThemeProvider } from '@/components/themeProvider/ThemeProvider';
import { ThemeDataType } from '@/lib/api/api.types';

export function Providers({
  children,
  theme,
  allThemes,
}: {
  allThemes: ThemeDataType[];
  children: React.ReactNode;
  theme: ThemeDataType;
}) {
  return (
    <ThemeProvider initialTheme={theme} initialThemes={allThemes}>
      <ScrollProvider>
        {children}
      </ScrollProvider>
    </ThemeProvider>
  );
}
