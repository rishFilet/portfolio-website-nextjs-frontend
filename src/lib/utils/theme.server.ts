import { cookies } from 'next/headers';

import { initialThemeData } from '@/app/layout';
import { getThemes } from '@/lib/supabase/queries';

import { adaptSupabaseThemesToThemeData } from './theme-adapter';

// Static version for build time
export async function getStaticThemes() {
  try {
    const supabaseThemes = await getThemes();
    const themes = adaptSupabaseThemesToThemeData(supabaseThemes);
    return themes;
  } catch {
    return [initialThemeData];
  }
}

// Dynamic version for runtime (uses cookies)
export async function getCurrentTheme() {
  try {
    const supabaseThemes = await getThemes();
    const themes = adaptSupabaseThemesToThemeData(supabaseThemes);
    const cookieStore = cookies();
    const selectedTheme = (await cookieStore).get('selected-theme');

    return (
      themes.find((theme) => theme.uniqueName === selectedTheme?.value) ||
      themes[0] ||
      initialThemeData
    );
  } catch {
    return initialThemeData;
  }
}