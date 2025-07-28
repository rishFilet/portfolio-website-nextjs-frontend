import type { Metadata } from 'next';

const MetadataConstants: Metadata = {
  title: 'Rishi Khan Creative Engineer',
  description:
    'Creative Engineer & Full Stack Developer. Building innovative digital experiences with modern web technologies.',
  openGraph: {
    title: 'Rishi Khan Creative Engineer',
    description:
      'Creative Engineer & Full Stack Developer. Building innovative digital experiences with modern web technologies.',
    url: 'https://rishikhan.dev',
    siteName: 'Rishi Khan Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://rishikhan.dev',
  ),
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default MetadataConstants;