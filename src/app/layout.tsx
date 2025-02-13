
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { Indie_Flower, Inter, Oswald, Qwigley, Roboto } from 'next/font/google';
import Script from 'next/script';

import '@/styles/reset.css'; // Import reset styles first
import '@/styles/globals.css'; // Import global styles next

import styles from '@/app/layout.module.css'; // Import layout styles
import { Providers } from '@/app/providers';
import Navigation from '@/components/navigation/Navigation'; // Import component styles
import { getThemes } from '@/lib/api/api.helpers';
import type { MediaFormatType, ThemeDataType } from '@/lib/api/api.types';
import { getCurrentTheme } from '@/lib/utils/theme.server';
library.add(fas, far, fab);

import MetadataConstants from './metadata';



const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
  uniqueName: 'none',
  fontAwesomeIcon: 'sun',
  primaryColorHexCode: '#000000',
  secondaryColorHexCode: '#ffffff',
  fontColorHexCode: '#000000',
  accentColorHexCode: '#ffffff',
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
  children: React.ReactNode;
}>) => {
  const themeData = await getThemes();
  const initialTheme =
    await getCurrentTheme();

  return (
    <>
      <html
        lang="en"
        className={`${roboto.variable} ${oswald.variable} ${indieFlower.variable} ${qwigley.variable}`}
      >
        <body className={inter.className}>
          <Script src="https://kit.fontawesome.com/7e82cbbb97.js" strategy="afterInteractive" />
          <Providers theme={initialTheme} allThemes={themeData}>
            <div className={clsx(styles.siteContainer, initialTheme.uniqueName === 'none' && styles.loading)}>
              <Navigation />
              <main className={clsx(styles.main, initialTheme.uniqueName === 'none' && styles.loading)}>{children}</main>
            </div>
          </Providers>
        </body>
      </html>
    </>
  );
};

export default RootLayout;