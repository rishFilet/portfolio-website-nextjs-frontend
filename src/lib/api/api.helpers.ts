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
  } catch {
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

  try {
    const { data } = await apiHandler<T>(
      new Request(url, {
        method: HttpMethod.GET,
        headers,
      }),
    );

    return new Promise((resolve) => {
      resolve(data);
    });
  } catch (error) {
    // If it's a 401 error, it means the API token is missing or invalid
    if (error instanceof Error && error.message.includes('401')) {
      // Return empty data to prevent build failure
      return [] as T;
    }
    throw error;
  }
}

export const getLandingPageData = cache(async () => {
  try {
    const { description, header, commaSeparatedSubHeadersString } =
      await getStrapiData<LandingPageDataType>({
        endpoint: API_IDS.landingPage,
      });

    const commaSeparatedSubHeadersList = convertCommaSeparatedStringToArray(
      commaSeparatedSubHeadersString,
    );
    return {
      description,
      header,
      commaSeparatedSubHeadersList,
    };
  } catch {
    // Return fallback data
    return {
      description: 'Creative Engineer & Full Stack Developer',
      header: 'Rishi Khan',
      commaSeparatedSubHeadersList: ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver'],
    };
  }
});

export const getThemes = cache(async () => {
  try {
    const themes = await getStrapiData<ThemeDataType[]>({
      endpoint: API_IDS.themeData,
    });
    return themes.map(addHashToColors);
  } catch {
    // Return empty array to prevent build failure
    return [];
  }
});

export const getThemeByName = cache(async (themeName: string) => {
  const themes = await getThemes();

  return themes.find((theme) => theme.uniqueName === themeName);
});

export const getBlogPosts = cache(async () => {
  try {
    const posts = await getStrapiData<BlogDataType[]>({
      endpoint: API_IDS.blogPosts,
      populate:
        'populate[0]=postImages.mediaFiles&populate[1]=tags&filters[publishedAt][$notNull]=true',
    });

    // More robust deduplication and filtering
    const uniquePosts = posts
      .filter((post) => {
        // Only include posts with required fields
        if (!post.title || !post.slug || !post.postContent) {
          return false;
        }
        return true;
      })
      .filter((post, index, self) => {
        // Remove duplicates based on slug
        const firstIndex = self.findIndex((p) => p.slug === post.slug);
        return firstIndex === index;
      })
      .sort((a, b) => {
        // Sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return uniquePosts;
  } catch {
    // Return empty array to prevent build failure
    return [];
  }
});

export const getBlogPostsBySlug = cache(async (slug: string) => {
  try {
    const posts = await getStrapiData<BlogDataType[]>({
      endpoint: API_IDS.blogPosts,
      populate:
        'populate[0]=postImages.mediaFiles&populate[1]=tags&filters[publishedAt][$notNull]=true',
    });

    // Find the most recent post with this slug
    const postsWithSlug = posts.filter((post) => post.slug === slug);

    if (postsWithSlug.length === 0) {
      return null;
    }

    // Return the most recent one
    const mostRecent = postsWithSlug.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    return mostRecent;
  } catch {
    // Return null to prevent build failure
    return null;
  }
});

export const getLatestBlogPost = cache(async () => {
  try {
    const posts = await getBlogPosts();

    if (posts.length === 0) {
      return null;
    }

    return posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  } catch {
    // Return null to prevent build failure
    return null;
  }
});
