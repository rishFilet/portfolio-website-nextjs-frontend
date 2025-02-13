import clsx from 'clsx';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import HeroImage from '@/components/heroImage/HeroImage';
import PageContainer from '@/components/pageContainer/PageContainer';
import SocialLinks from '@/components/socialLinks/SocialLinks';
import { API_IDS } from '@/lib/api/api.constants';
import { getLatestBlogPost, getStrapiData } from '@/lib/api/api.helpers';
import type { LandingPageDataType, ThemeDataType } from '@/lib/api/api.types';

import { shartollLight } from './fonts';
import styles from './page.module.css';

export type HomePageProps = {
  heroImage: ThemeDataType['heroImage'];
};

export default async function Home() {
  const landingPageData = await getStrapiData<LandingPageDataType>({
    endpoint: API_IDS.landingPage,
  });

  const post = await getLatestBlogPost();

  const { description, header, subHeader } = landingPageData;

  return (
    <PageContainer className={styles.homePage}>
      <div className={styles.gridContainer}>
        <HeroImage className={styles.heroImageContainer} />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.heroText}>
          <h1 className={clsx(shartollLight.className)}>{header}</h1>
          <h2>{subHeader}</h2>
          <ReactMarkdown disallowedElements={[]} unwrapDisallowed skipHtml remarkPlugins={[]}>
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