'use client';

import clsx from 'clsx';
import Link from 'next/link';

import ImageComponent from '../image/Image';

import styles from './ProjectCard.module.css';

type ProjectCardProps = {
  children?: React.ReactNode,
  classNames?: {
    cardContainer: string,
  },
  description: string,
  githubUrl?: string,
  image?: {
    height: number,
    url: string,
    width: number,
  },
  link?: string,
  liveDemoUrl?: string,
  tags?: string[],
  title: string,
};

const ProjectCard = (props: ProjectCardProps) => {
  const {
    description = 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum.',
    image,
    link,
    tags = [],
    title = 'Project Title',
    githubUrl,
    liveDemoUrl,
  } = props;

  const cardContent = (
    <>
      {image && (
        <div className={styles.aspectRatioContainer}>
          <ImageComponent
            alt={title}
            height={image.height}
            src={image.url}
            style={{ borderRadius: '0.7rem' }}
            width={image.width}
          />
        </div>
      )}

      <div className={styles.textContentContainer}>
        {tags.length > 0 && (
          <div className={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.actionButtonsContainer}>
          {link && (
            <Link href={link} className={styles.viewDetailsButton}>
              <span>View Details</span>
              <svg
                className={styles.arrowIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
              </svg>
            </Link>
          )}

          <div className={styles.externalButtonsContainer}>
            {githubUrl && (
              <a
                className={styles.externalButton}
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View on GitHub"
              >
                <svg
                  className={styles.externalButtonIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}

            {liveDemoUrl && (
              <a
                className={styles.externalButton}
                href={liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="View Live Demo"
              >
                <svg
                  className={styles.externalButtonIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14,3V7H17.59L7.76,16.83L9.17,18.24L19,8.41V12H23V3M19,19H5V5H12V1H5C3.89,1 3,1.89 3,3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (link) {
    return (
      <div
        className={clsx(styles.cardContainer, props.classNames?.cardContainer)}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.cardContainer, props.classNames?.cardContainer)}
    >
      {cardContent}
    </div>
  );
};

export default ProjectCard;