import type { Metadata } from 'next';

const MetadataConstants: Metadata = {
  title: 'Rishi Khan Creative Engineer',
  description:
    'Welcome to Break Time Muay Thai. We are a small Muay Thai Gym that focuses on Wellness, Small Group & Private Training.',
  openGraph: {
    title: 'Break Time Muay Thai',
    description:
      'Welcome to Break Time Muay Thai. We are a small Muay Thai Gym that focuses on Wellness, Small Group & Private Training.',
    url: 'https://breaktimemuaythai.com',
    siteName: 'Break Time Muay Thai',
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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