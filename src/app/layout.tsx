import { Theme } from '@radix-ui/themes';
import { Indie_Flower, Inter, Oswald, Qwigley, Roboto_Condensed } from 'next/font/google';
import Script from 'next/script';

import Navigation from '@/components/navigation/Navigation';

import styles from './layout.module.css';
import MetadataConstants from './metadata';

import '@radix-ui/themes/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
  display: 'swap',
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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <html
        lang="en"
        className={`${robotoCondensed.variable} ${oswald.variable} ${indieFlower.variable} ${qwigley.variable}`}
      >
        <body className={inter.className}>
          <Script src="https://kit.fontawesome.com/7e82cbbb97.js" strategy="afterInteractive" />
          <Theme>
            <div className={styles.siteContainer}>
              <Navigation />
              <main className={styles.main}>{children}</main>
            </div>
          </Theme>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
