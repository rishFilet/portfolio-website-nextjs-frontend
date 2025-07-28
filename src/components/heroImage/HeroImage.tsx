'use client';

import clsx from 'clsx';

import ImageComponent from '@/components/image/Image';

import { useTheme } from '../themeProvider/ThemeProvider';

import styles from './HeroImage.module.css';

type HeroImageProps = {
  className?: string,
};

const HeroImage = (props: HeroImageProps) => {
  const { className } = props;
  const { currentTheme } = useTheme();

  const heroImage = currentTheme.heroImage;

  // Check if we have valid image data
  const hasValidImage =
    heroImage &&
    (heroImage.formats.small?.url ||
      heroImage.formats.medium?.url ||
      heroImage.formats.large?.url);

  // If no valid image, show a placeholder
  if (!hasValidImage) {
    return (
      <div className={clsx(styles.heroImageContainer, className)}>
        <div
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '3rem',
            fontWeight: 'bold',
            boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)',
          }}
        >
          RK
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(styles.heroImageContainer, className)}>
      <ImageComponent
        alt={heroImage.alternativeText || 'Hero Image'}
        src={
          heroImage.formats.large?.url ||
          heroImage.formats.medium?.url ||
          heroImage.formats.small.url
        }
        height={
          heroImage.formats.large?.height ||
          heroImage.formats.medium?.height ||
          heroImage.formats.small?.height ||
          200
        }
        width={
          heroImage.formats.large?.width ||
          heroImage.formats.medium?.width ||
          heroImage.formats.small?.width ||
          200
        }
        style={{
          borderRadius: '50%',
          boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)',
        }}
      />
    </div>
  );
};

export default HeroImage;