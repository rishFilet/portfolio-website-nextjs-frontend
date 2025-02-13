import Image from 'next/image';

import styles from './Image.module.css';

type ImageComponentProps = {
  alt: string;
  height?: number;
  src: string;
  style?: React.CSSProperties;
  width?: number;
};

const ImageComponent = (props: ImageComponentProps) => {
  const { alt, src, style, height, width } = props;
  return (
    <div className={styles.imageContainer}>
      <Image
        src={src}
        alt={alt}
        height={height}
        width={width}
        className={styles.responsiveImage}
        style={{
          objectFit: style?.objectFit ?? 'cover', // cover, contain, none
          ...style,
        }}
      />
    </div>
  );
};

export default ImageComponent;