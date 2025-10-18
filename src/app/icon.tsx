import { ImageResponse } from 'next/og';

import { createServerSupabaseClient } from '@/lib/supabase/server';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  // Try to get favicon from site_settings or logo from active theme
  let imageUrl = null;

  try {
    const supabase = await createServerSupabaseClient();

    // First try to get favicon from site settings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settings } = await (supabase as any)
      .from('site_settings')
      .select('favicon_url')
      .single();

    if (settings?.favicon_url) {
      imageUrl = settings.favicon_url;
    } else {
      // If no favicon, try to get logo from active theme
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: theme } = await (supabase as any)
        .from('themes')
        .select('logo_url')
        .eq('is_active', true)
        .single();

      imageUrl = theme?.logo_url;
    }
  } catch (error) {
    // If there's an error, fall back to generated icon
    console.error('Error fetching icon:', error);
  }

  // If we have an image URL, fetch and return it
  if (imageUrl) {
    try {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();

      return new Response(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      // Fall through to generated icon
    }
  }

  // Default: generate an icon with initials
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        RK
      </div>
    ),
    {
      ...size,
    },
  );
}