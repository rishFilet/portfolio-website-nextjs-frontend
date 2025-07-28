/**
 * Calculates the reading time for an array of strings based on a reading pace.
 *
 * @param {string[]} textArray - Array of strings to calculate the reading time for.
 * @param {number} readingPace - Number of words per minute (e.g., 200 wpm).
 * @returns {number} - Estimated reading time in minutes (rounded to 2 decimal places).
 */

export function calculateReadingTime(
  textArray: string[],
  readingPace: number = 200,
): number {
  // Count the total number of words in the array
  const totalWords = textArray.reduce((wordCount, text) => {
    // Split each string by spaces and count the words
    return wordCount + text.split(/\s+/).filter(Boolean).length; // Filter removes empty strings
  }, 0);

  // Calculate reading time in minutes
  const readingTime = totalWords / readingPace;

  // Return the reading time rounded to 2 decimal places
  return Math.max(Math.ceil(readingTime), 1);
}

export function convertCommaSeparatedStringToArray(
  commaSeparatedString: string | null | undefined,
): string[] {
  // Handle null/undefined values
  if (!commaSeparatedString) {
    return [];
  }

  return commaSeparatedString.includes(',')
    ? commaSeparatedString.split(',').map((item) => item.trim())
    : [commaSeparatedString];
}
