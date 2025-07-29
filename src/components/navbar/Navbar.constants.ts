import { isPageVisible, type PageKey } from '@/config/pageVisibility';

export const links = [
  { name: 'Home', path: '/', icon: '🛖', pageKey: 'home' as PageKey },
  { name: 'Blog', path: '/blog', icon: '📝', pageKey: 'blog' as PageKey },
  {
    name: 'Projects',
    path: '/projects',
    icon: '💼',
    pageKey: 'projects' as PageKey,
  },
  { name: 'About', path: '/about', icon: '📄', pageKey: 'about' as PageKey },
];

// Filter out disabled pages
export const visibleLinks = links.filter((link) => isPageVisible(link.pageKey));
