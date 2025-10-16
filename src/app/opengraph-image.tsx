import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Image() {
  const logoSrc = await fetch(new URL('./icon.png', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={URL.createObjectURL(new Blob([logoSrc]))}
          height="100"
          alt="Rishi Khan Portfolio Logo"
        />
      </div>
    ),
  );
}