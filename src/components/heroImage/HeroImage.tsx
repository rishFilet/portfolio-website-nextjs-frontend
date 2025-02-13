'use client';

import clsx from 'clsx';

import ImageComponent from '@/components/image/Image';

import { useTheme } from '../themeProvider/ThemeProvider';

import styles from './HeroImage.module.css';

type HeroImageProps = {
  className?: string;
};

const HeroImage = (props: HeroImageProps) => {
  const { className } = props;
  const { currentTheme } = useTheme();

  const heroImage = currentTheme.heroImage;
  return (
    <div className={clsx(styles.heroImageContainer, className)}>
      <ImageComponent
        alt={heroImage.alternativeText}
        src={heroImage.formats.large.url}
        height={heroImage.formats.large.height}
        width={heroImage.formats.large.width}
        style={{ borderRadius: '50%', boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)' }}
      />
    </div>
  );
};

export default HeroImage;