import type { PageKey } from '@/config/pageVisibility';

export type NavbarLink = {
  className?: string,
  icon: string,
  name: string,
  pageKey: PageKey,
  path: string,
};

export type NavbarData = {
  attributes: {
    freeTrialLink: string;
  };
};
