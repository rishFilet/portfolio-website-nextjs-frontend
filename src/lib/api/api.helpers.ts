import { cache } from 'react';

import { addHashToColors } from '../utils/theme';

import {
  API_IDS,
  BASE_API_URL,
  HttpMethod,
  STRAPI_API_TOKEN,
  successStatusCodes,
} from './api.constants';

import type { GetStrapiDataParams, ThemeDataType } from './api.types';

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
      throw new Error('Something went wrong on API server!');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStrapiData<T>({
  endpoint,
  populate = '*',
}: GetStrapiDataParams): Promise<T> {
  const url = `${BASE_API_URL}/api/${endpoint}?populate=${populate}`;

  const { data } = await apiHandler<T>(
    new Request(url, {
      method: HttpMethod.GET,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    }),
  );

  return new Promise((resolve) => {
    resolve(data);
  });
}

export const getThemes = cache(async () => {
  const themes = await getStrapiData<ThemeDataType[]>({ endpoint: API_IDS.themeData });
  return themes.map(addHashToColors);
});

export const getThemeByName = cache(async (themeName: string) => {
  const themes = await getThemes();

  return themes.find((theme) => theme.uniqueName === themeName);
});