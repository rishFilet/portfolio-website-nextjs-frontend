'use client';

import { usePathname } from 'next/navigation';

import PortfolioLayout from '@/components/layouts/PortfolioLayout';

export default function RootTemplate({
  children,
}: {
  children: React.ReactNode,
}) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  // Admin routes render directly without the portfolio layout
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes get the portfolio layout
  return <PortfolioLayout>{children}</PortfolioLayout>;
}