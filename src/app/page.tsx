import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

import ImageComponent from '@/components/image/Image';
import PageContainer from '@/components/pageContainer/PageContainer';
import { API_IDS } from '@/lib/api/api.constants';
import { getStrapiData } from '@/lib/api/api.helpers';
import type { LandingPageDataType, ThemeDataType } from '@/lib/api/api.types';
import { getCurrentTheme } from '@/lib/utils/theme.server';

import { shartollLight } from './fonts';
import styles from './page.module.css';

export type HomePageProps = {
  heroImage: ThemeDataType['heroImage'];
};

export default async function Home() {
  const landingPageData = await getStrapiData<LandingPageDataType>({
    endpoint: API_IDS.landingPage,
  });

  const { heroImage } = await getCurrentTheme();

  const { description, header, subHeader } = landingPageData;

  return (
    <PageContainer className={styles.homePage}>
      <div className={styles.heroImageContainer}>
        <ImageComponent
          alt={heroImage.alternativeText}
          src={heroImage.formats.large.url}
          style={{ borderRadius: '1rem', boxShadow: '0 0.1rem 0.3rem rgba(0, 0, 0, 0.5)' }}
        />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.heroText}>
          <h1 className={clsx(shartollLight.className)}>{header}</h1>
          <h2>{subHeader}</h2>
          <ReactMarkdown disallowedElements={[]} unwrapDisallowed skipHtml remarkPlugins={[]}>
            {description}
          </ReactMarkdown>
          {/* <div className={styles.ctaButton}>
            <button>Check out my latest blog post</button>
            <button>Check out my latest project</button>
          </div> */}
          <div className={styles.socialLinks}></div>
        </div>
      </div>
    </PageContainer>
  );
}