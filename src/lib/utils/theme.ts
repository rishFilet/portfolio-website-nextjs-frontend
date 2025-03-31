import type { ThemeDataType } from '../api/api.types';

export function addHashToColors(theme: ThemeDataType): ThemeDataType {
  const colorKeys = [
    'primaryColorHexCode',
    'secondaryColorHexCode',
    'accentColorHexCode',
    'fontColorHexCode',
  ] as const;

  return {
    ...theme,
    ...Object.fromEntries(
      colorKeys.map((key) => {
        const value = theme[key];
        // Only process if the value exists and is a string
        if (typeof value === 'string') {
          return [key, value.startsWith('#') ? value : `#${value}`];
        }
        // Otherwise, return the original key with an undefined or fallback value
        return [key, value];
      }),
    ),
  };
}
