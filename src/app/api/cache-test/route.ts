// Test endpoint to verify caching is disabled
import { NextResponse } from 'next/server';

export async function GET() {
  const timestamp = new Date().toISOString();

  return NextResponse.json({
    message: 'Cache test endpoint',
    timestamp,
    random: Math.random(),
    cacheStatus: 'should be different each time',
  });
}

// Disable caching for this endpoint
export const dynamic = 'force-dynamic';
export const revalidate = 0;
