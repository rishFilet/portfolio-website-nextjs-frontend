export const PAGE_VISIBILITY_CONFIG = {
  // Main pages
  home: true,
  about: true,
  projects: true,
  blog: true,

  // Dynamic pages (these inherit from their parent)
  projectDetails: true,
  blogPost: true,

  // Other pages
  contact: true,
  resume: true,
} as const;

export type PageKey = keyof typeof PAGE_VISIBILITY_CONFIG;

export function isPageVisible(pageKey: PageKey): boolean {
  return PAGE_VISIBILITY_CONFIG[pageKey];
}

export function getVisiblePages(): PageKey[] {
  return Object.entries(PAGE_VISIBILITY_CONFIG)
    .filter(([, isVisible]) => isVisible)
    .map(([pageKey]) => pageKey as PageKey);
}
