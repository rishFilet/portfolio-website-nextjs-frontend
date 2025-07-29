'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { isPageVisible, type PageKey } from '@/config/pageVisibility';

interface PageVisibilityGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  pageKey: PageKey;
}

export function PageVisibilityGuard({
  pageKey,
  children,
  fallback,
}: PageVisibilityGuardProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isPageVisible(pageKey)) {
      // Redirect to home page if page is not visible
      router.push('/');
    }
  }, [pageKey, router]);

  // If page is not visible, show fallback or redirect
  if (!isPageVisible(pageKey)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Return null while redirecting
    return null;
  }

  return <>{children}</>;
}