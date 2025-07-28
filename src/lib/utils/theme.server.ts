import { cookies } from 'next/headers';

import { initialThemeData } from '@/app/layout';

import { getThemes } from '../api/api.helpers';

// Static version for build time
export async function getStaticThemes() {
  try {
    const themes = await getThemes();
    return themes;
  } catch {
    return [initialThemeData];
  }
}

// Dynamic version for runtime (uses cookies)
export async function getCurrentTheme() {
  try {
    const themes = await getThemes();
    const cookieStore = cookies();
    const selectedTheme = (await cookieStore).get('selected-theme');

    return (
      themes.find((theme) => theme.uniqueName === selectedTheme?.value) ||
      themes[0]
    );
  } catch {
    return initialThemeData;
  }
}