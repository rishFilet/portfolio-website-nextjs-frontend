import ImageComponent from '../image/Image';

import styles from './Card.module.css';

type CardProps = {
  children?: React.ReactNode;
  description: string;
  imageSrc?: string;
  link?: string;
  tags?: string[];
  title: string;
};

const Card = (props: CardProps) => {
  const {
    description = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur nihil fugiat inventore non animi dignissimos.',
    imageSrc,
    link,
    title = 'Blog title',
    tags,
    children,
  } = props;

  return (
    <div className={styles.cardContainer}>
      {imageSrc && (
        <div className={styles.cardImageContainer}>
          <ImageComponent src={imageSrc} alt={title} />
        </div>
      )}
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
  );
};

export default Card;