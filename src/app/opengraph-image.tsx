import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // For OpenGraph, we'll use a generated image with initials
  // since edge runtime can't access Supabase easily
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <div>Rishi Khan</div>
        <div style={{ fontSize: 48, marginTop: 20, fontWeight: 'normal' }}>
          Portfolio
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}