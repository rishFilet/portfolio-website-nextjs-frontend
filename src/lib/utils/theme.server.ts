import { cookies } from 'next/headers';

import { getThemes } from '../api/api.helpers';

export async function getCurrentTheme() {
  const themes = await getThemes();
  const cookieStore = cookies();
  const selectedTheme = (await cookieStore).get('selected-theme');

  return (
    themes.find((theme) => theme.uniqueName === selectedTheme?.value) ||
    themes[0]
  );
}