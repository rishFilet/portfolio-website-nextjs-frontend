import clsx from 'clsx';
import Link from 'next/link';

import ImageComponent from '../image/Image';

import styles from './Card.module.css';

type CardProps = {
  children?: React.ReactNode;
  classNames?: {
    cardContainer: string;
  };
  description: string;
  image?: {
    height: number;
    url: string;
    width: number;
  };
  link?: string;
  tags?: string[];
  title: string;
};

const Card = (props: CardProps) => {
  const {
    description = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur nihil fugiat inventore non animi dignissimos.',
    image,
    link,
    title = 'Blog title',
    tags,
    children,
    classNames,
  } = props;
  return (
    <Link className={clsx(styles.cardContainer, classNames?.cardContainer)} href={`${link}`}>
      {image && (
        <div className={styles.aspectRatioContainer}>
          <div className={styles.cardImageContainer}>
            <ImageComponent
              src={image.url}
              alt={title}
              height={image.height}
              width={image.width}
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
        </div>
      )}
      <div className={styles.textContentContainer}>
        <div className={styles.tagsContainer}>
          {tags?.map((tag) => (
            <button key={tag} className={styles.tag}>
              {tag}
            </button>
          ))}
        </div>
        <div className={styles.textContainer}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <div className={styles.footer}>{children}</div>
      </div>
    </Link>
  );
};

export default Card;