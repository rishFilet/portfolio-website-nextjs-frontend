import { z } from 'zod';

import type { NextConfig } from 'next';

const Config = z.object({
  BASE_API_URL: z.string(),
  STRAPI_API_TOKEN: z.string(),
  SUPABASE_HOSTNAME: z.string(),
});

Config.parse(process.env);

const nextConfig: NextConfig = {
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    SUPABASE_HOSTNAME: process.env.SUPABASE_HOSTNAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: process.env.SUPABASE_HOSTNAME || 'localhost',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;