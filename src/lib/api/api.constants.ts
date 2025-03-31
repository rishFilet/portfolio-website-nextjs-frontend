export const BASE_API_URL = process.env.BASE_API_URL || '';
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

export const successStatusCodes: Record<HttpMethod, number> = {
  [HttpMethod.GET]: 200,
  [HttpMethod.POST]: 201,
};

export const API_IDS = {
  landingPage: 'landing-page',
  themeData: 'themes',
  blogPosts: 'blog-posts',
  socialLinks: 'social-links',
} as const;

export const DEFAULT_THEME = 'light';
