export const getContrastColor = (hexColor: string) => {
  // Remove the '#' if present and convert to RGB
  hexColor = hexColor.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate YIQ value
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white based on YIQ value
  return yiq >= 128 ? 'black' : 'white';
};

export const getComplementaryColor = (hex: string) => {
  // Ensure the hex code is valid
  hex = hex.replace('#', '');
  if (hex.length !== 6 && hex.length !== 3) {
    return 'Invalid Hex Code';
  }

  // Expand shorthand hex codes (e.g., "03F") to full hex codes (e.g., "0033FF")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate complementary RGB values
  const cr = 255 - r;
  const cg = 255 - g;
  const cb = 255 - b;

  // Convert complementary RGB values back to hex
  const complementaryHex = `#${cr.toString(16).padStart(2, '0')}${cg.toString(16).padStart(2, '0')}${cb.toString(16).padStart(2, '0')}`;

  return complementaryHex;
};
