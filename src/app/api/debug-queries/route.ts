import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({
      error: 'Missing Supabase environment variables',
      supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
      supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING',
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Test landing_page_content query
    const { data: landingData, error: landingError } = await supabase
      .from('landing_page_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    // Test social_links query
    const { data: socialData, error: socialError } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });

    // Test blog_posts query
    const { data: blogData, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1);

    // Test RLS directly
    const { data: rlsTest, error: rlsError } = await supabase
      .from('landing_page_content')
      .select('count');

    return NextResponse.json(
      {
        environment: {
          supabaseUrl,
          supabaseAnonKey: `${supabaseAnonKey.substring(0, 10)}...`,
          nodeEnv: process.env.NODE_ENV,
        },
        queries: {
          landing_page_content: {
            data: landingData,
            error: landingError,
            count: landingData?.length || 0,
          },
          social_links: {
            data: socialData,
            error: socialError,
            count: socialData?.length || 0,
          },
          blog_posts: {
            data: blogData,
            error: blogError,
            count: blogData?.length || 0,
          },
          rls_test: {
            data: rlsTest,
            error: rlsError,
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Exception occurred',
        message: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    );
  }
}
