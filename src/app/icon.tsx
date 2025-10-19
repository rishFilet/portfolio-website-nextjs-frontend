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
    const { data: settingsData } = await (supabase as any)
      .from('site_settings')
      .select('favicon_url')
      .order('updated_at', { ascending: false })
      .limit(1);

    const settings =
      settingsData && settingsData.length > 0 ? settingsData[0] : null;

    console.log('🎨 Favicon debug - Settings:', {
      favicon_url: settings?.favicon_url,
    });

    if (settings?.favicon_url) {
      imageUrl = settings.favicon_url;
      console.log('✅ Using custom favicon from site_settings');
    } else {
      // If no favicon, try to get logo from active theme
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: themeData } = await (supabase as any)
        .from('themes')
        .select('logo_url, unique_name, is_active')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1);

      const theme = themeData && themeData.length > 0 ? themeData[0] : null;
      console.log('🎨 Favicon debug - Theme:', theme);

      if (theme?.logo_url) {
        imageUrl = theme.logo_url;
        console.log('✅ Using theme logo as favicon:', theme.unique_name);
      } else {
        console.log('⚠️ No active theme with logo found, using generated icon');
      }
    }
  } catch (error) {
    // If there's an error, fall back to generated icon
    console.error('❌ Error fetching icon:', error);
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