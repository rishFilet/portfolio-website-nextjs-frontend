import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get theme from cookie or set default
  const theme = request.cookies.get('selected-theme')?.value || 'light';
  const response = NextResponse.next();

  // Ensure cookie is set
  if (!request.cookies.has('selected-theme')) {
    response.cookies.set('selected-theme', theme);
  }

  return response;
}