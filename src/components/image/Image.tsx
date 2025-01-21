import Image from 'next/image';

import styles from './Image.module.css';

type ImageComponentProps = {
  alt: string;
  src: string;
  style?: React.CSSProperties;
};

const ImageComponent = (props: ImageComponentProps) => {
  const { alt, src, style } = props;
  return (
    <div className={styles.imageContainer}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectFit: style?.objectFit ?? 'cover', // cover, contain, none
          ...style,
        }}
      />
    </div>
  );
};

export default ImageComponent;