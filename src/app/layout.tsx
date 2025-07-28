import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import {
  Indie_Flower,
  Inter,
  Oswald,
  Qwigley,
  Roboto,
  Bitter,
  Raleway,
} from 'next/font/google';
import Script from 'next/script';

import '@/styles/reset.css'; // Import reset styles first
import '@/styles/globals.css'; // Import global styles next

import styles from '@/app/layout.module.css'; // Import layout styles
import { Providers } from '@/app/providers';
import Navigation from '@/components/navigation/Navigation'; // Import component styles
import { getThemes } from '@/lib/api/api.helpers';
import type { MediaFormatType, ThemeDataType } from '@/lib/api/api.types';
import { getStaticThemes } from '@/lib/utils/theme.server';

library.add(fas, far, fab);

import MetadataConstants from './metadata';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
  display: 'swap',
});
const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});
const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
});

const indieFlower = Indie_Flower({
  subsets: ['latin'],
  variable: '--font-indie-flower',
  display: 'swap',
  weight: '400',
});

const qwigley = Qwigley({
  subsets: ['latin'],
  variable: '--font-qwigley',
  display: 'swap',
  weight: '400',
});

export const metadata = MetadataConstants;

export const initialMediaFormat: MediaFormatType = {
  height: 0,
  name: '',
  url: '',
  width: 0,
};
export const initialThemeData: ThemeDataType = {
  uniqueName: 'light',
  fontAwesomeIcon: 'fas fa-sun',
  primaryColorHexCode: '#ffffff',
  secondaryColorHexCode: '#000000',
  fontColorHexCode: '#000000',
  accentColorHexCode: '#2bb1a5',
  logo: {
    alternativeText: '',
    formats: {
      small: initialMediaFormat as MediaFormatType,
      medium: initialMediaFormat as MediaFormatType,
      large: initialMediaFormat as MediaFormatType,
      thumbnail: initialMediaFormat as MediaFormatType,
    },
    ...initialMediaFormat,
  },
  heroImage: {
    alternativeText: '',
    formats: {
      small: initialMediaFormat as MediaFormatType,
      medium: initialMediaFormat as MediaFormatType,
      large: initialMediaFormat as MediaFormatType,
      thumbnail: initialMediaFormat as MediaFormatType,
    },
    ...initialMediaFormat,
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) => {
  // Add error handling for theme data fetching
  let themeData;
  let initialTheme;

  try {
    themeData = await getThemes();
    initialTheme = await getStaticThemes().then((themes) => themes[0]);
  } catch {
    // Use fallback theme data
    themeData = [initialThemeData];
    initialTheme = initialThemeData;
  }

  return (
    <>
      <html
        lang="en"
        className={`${roboto.variable} ${oswald.variable} ${indieFlower.variable} ${qwigley.variable} ${bitter.variable} ${raleway.variable} ${inter.variable}`}
      >
        <body>
          <Script
            src="https://kit.fontawesome.com/7e82cbbb97.js"
            strategy="afterInteractive"
          />
          <Providers theme={initialTheme} allThemes={themeData}>
            <div
              className={clsx(
                styles.siteContainer,
                initialTheme.uniqueName === 'none' && styles.loading,
              )}
            >
              <Navigation />
              <main
                className={clsx(
                  styles.main,
                  initialTheme.uniqueName === 'none' && styles.loading,
                )}
              >
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </>
  );
};

export default RootLayout;