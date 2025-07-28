import { cache } from 'react';

import { convertCommaSeparatedStringToArray } from '@/lib/utils/string.helpers';

import { addHashToColors } from '../utils/theme';

import {
  API_IDS,
  BASE_API_URL,
  HttpMethod,
  STRAPI_API_TOKEN,
  successStatusCodes,
} from './api.constants';

import type {
  BlogDataType,
  GetStrapiDataParams,
  LandingPageDataType,
  ThemeDataType,
} from './api.types';

export async function apiHandler<T>(request: Request): Promise<Record<string, T>> {
  try {
    const response = await fetch(request, {
      next: {
        revalidate: 5, //TODO: Update this when launched live
      },
    });

    if (response.status === successStatusCodes[request.method as HttpMethod]) {
      return response.json();
    } else {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error('Something went wrong on API server!');
  }
}

export async function getStrapiData<T>({
  endpoint,
  populate = 'populate=*',
}: GetStrapiDataParams): Promise<T> {
  const url = `${BASE_API_URL}/api/${endpoint}?${populate}`;

  // Only include Authorization header if token is available
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const { data } = await apiHandler<T>(
    new Request(url, {
      method: HttpMethod.GET,
      headers,
    }),
  );

  return new Promise((resolve) => {
    resolve(data);
  });
}

export const getLandingPageData = cache(async () => {
  const { description, header, commaSeparatedSubHeadersString } =
    await getStrapiData<LandingPageDataType>({ endpoint: API_IDS.landingPage });

  const commaSeparatedSubHeadersList = convertCommaSeparatedStringToArray(
    commaSeparatedSubHeadersString,
  );
  return {
    description,
    header,
    commaSeparatedSubHeadersList,
  };
});

export const getThemes = cache(async () => {
  const themes = await getStrapiData<ThemeDataType[]>({
    endpoint: API_IDS.themeData,
  });
  return themes.map(addHashToColors);
});

export const getThemeByName = cache(async (themeName: string) => {
  const themes = await getThemes();

  return themes.find((theme) => theme.uniqueName === themeName);
});

export const getBlogPosts = cache(async () => {
  return getStrapiData<BlogDataType[]>({
    endpoint: API_IDS.blogPosts,
    populate: 'populate[0]=postImages.mediaFiles&populate[1]=tags',
  });
});

export const getBlogPostsBySlug = cache(async (slug: string) => {
  const posts = await getStrapiData<BlogDataType[]>({
    endpoint: API_IDS.blogPosts,
    populate: 'populate[0]=postImages.mediaFiles&populate[1]=tags',
  });

  return posts.find((post) => post.slug === slug);
});

export const getLatestBlogPost = cache(async () => {
  const posts = await getBlogPosts();

  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
});
