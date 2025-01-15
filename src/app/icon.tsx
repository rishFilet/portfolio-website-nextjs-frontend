import { ImageResponse } from 'next/og';

import MetadataConstants from './metadata';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  const absoluteUrl = new URL('/icon.png', MetadataConstants.metadataBase || '');

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'blue',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <img src={absoluteUrl.toString()} alt="icon" width={size.width} height={size.height} />
      </div>
    ),
    {
      ...size,
    },
  );
}
