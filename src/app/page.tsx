import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import HeroImage from '@/components/heroImage/HeroImage';
import PageContainer from '@/components/pageContainer/PageContainer';
import SocialLinks from '@/components/socialLinks/SocialLinks';
import SplitFlapDisplayComponent from '@/components/splitFlapDisplay/SplitFlapDisplay';
import { getLandingPageData, getLatestBlogPost } from '@/lib/api/api.helpers';
import type { ThemeDataType } from '@/lib/api/api.types';

import styles from './page.module.css';

export type HomePageProps = {
  heroImage: ThemeDataType['heroImage'],
};

export default async function Home() {
  const landingPageData = await getLandingPageData();

  const post = await getLatestBlogPost();

  const { description, header, commaSeparatedSubHeadersList } = landingPageData;

  return (
    <PageContainer className={styles.homePage}>
      <div className={styles.gridContainer}>
        <HeroImage className={styles.heroImageContainer} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.heroText}>
          <div className={styles.headerContainer}>
            <h1 className={styles.headerText}>{header}</h1>
          </div>
          <div className={styles.splitFlapContainer}>
            <SplitFlapDisplayComponent
              listOfValues={commaSeparatedSubHeadersList}
              characterWidth="2.2rem"
              step={50}
              borderColor="var(--color-primary)"
              borderWidth="3px"
              textColor="var(--color-primary)"
              background="var(--color-accent)"
            />
          </div>
          <ReactMarkdown
            disallowedElements={[]}
            unwrapDisallowed
            skipHtml
            remarkPlugins={[]}
          >
            {description}
          </ReactMarkdown>
          <div className={styles.latestLinksContainer}>
            <Link className={styles.latestLink} href={`/blog/${post.slug}`}>
              <span className={styles.emoji}>📝</span>Latest Blog Post
            </Link>
          </div>
          <div className={styles.socialLinks}>
            <SocialLinks className={styles.socialLinks} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}