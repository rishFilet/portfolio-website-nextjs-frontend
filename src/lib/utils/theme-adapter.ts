// Adapter to convert Supabase Theme to ThemeDataType format
import type { ThemeDataType, MediaFormatType, MediaType } from '@/lib/api/api.types';
import type { Theme } from '@/types/content.types';

const emptyMediaFormat: MediaFormatType = {
  height: 0,
  name: '',
  url: '',
  width: 0,
};

const createMediaType = (url: string | null, name: string | null): MediaType => {
  const mediaFormat: MediaFormatType = {
    height: 300, // Default height
    width: 300, // Default width
    name: name || '',
    url: url || '',
  };

  return {
    alternativeText: name || '',
    formats: {
      small: mediaFormat,
      medium: mediaFormat,
      large: mediaFormat,
      thumbnail: mediaFormat,
    },
    ...mediaFormat,
  };
};

export function adaptSupabaseThemeToThemeData(theme: Theme): ThemeDataType {
  return {
    uniqueName: theme.unique_name,
    fontAwesomeIcon: theme.font_awesome_icon,
    primaryColorHexCode: theme.primary_color_hex,
    primaryColorAltHexCode: null,
    secondaryColorHexCode: theme.secondary_color_hex,
    secondaryColorAltHexCode: null,
    fontColorHexCode: theme.font_color_hex,
    accentColorHexCode: theme.accent_color_hex,
    accentColorAltHexCode: null,
    logo: createMediaType(theme.logo_url, theme.logo_name),
    heroImage: createMediaType(theme.hero_image_url, theme.hero_image_name),
  };
}

export function adaptSupabaseThemesToThemeData(themes: Theme[]): ThemeDataType[] {
  return themes.map(adaptSupabaseThemeToThemeData);
}
