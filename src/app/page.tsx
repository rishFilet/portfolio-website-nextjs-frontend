
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import HeroImage from '@/components/heroImage/HeroImage';
import PageContainer from '@/components/pageContainer/PageContainer';
import SocialLinks from '@/components/socialLinks/SocialLinks';
import SplitFlapDisplayComponent from '@/components/splitFlapDisplay/SplitFlapDisplay';
import type { ThemeDataType } from '@/lib/api/api.types';
import { getLandingPageData, getLatestBlogPost } from '@/lib/supabase/queries';

import styles from './page.module.css';

export type HomePageProps = {
  heroImage: ThemeDataType['heroImage'],
};

export default async function Home() {
  // Fetch from Supabase
  const landingPageData = await getLandingPageData();
  const post = await getLatestBlogPost();

  // Extract data with fallbacks
  const header = landingPageData?.header || 'Rishi Khan';
  const description = landingPageData?.description || 'Creative Engineer & Full Stack Developer';
  const subHeadersString = landingPageData?.sub_headers || 'Full Stack Developer,UI/UX Designer,Problem Solver';
  const commaSeparatedSubHeadersList = subHeadersString.split(',').map(s => s.trim());

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
          <div className={styles.descriptionContent}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
                em: ({ children }) => <em className={styles.emphasis}>{children}</em>,
                a: ({ href, children }) => (
                  <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                ol: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
                li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                h1: ({ children }) => <h2 className={styles.heading}>{children}</h2>,
                h2: ({ children }) => <h3 className={styles.subheading}>{children}</h3>,
                h3: ({ children }) => <h4 className={styles.subheading}>{children}</h4>,
                code: ({ children }) => <code className={styles.inlineCode}>{children}</code>,
                pre: ({ children }) => <pre className={styles.codeBlock}>{children}</pre>,
                blockquote: ({ children }) => <blockquote className={styles.blockquote}>{children}</blockquote>,
              }}
            >
              {description}
            </ReactMarkdown>
          </div>
          {post && (
            <div className={styles.latestLinksContainer}>
              <Link className={styles.latestLink} href={`/blog/${post.slug}`}>
                <span className={styles.emoji}>📝</span>Latest Blog Post
              </Link>
            </div>
          )}
          <div className={styles.socialLinks}>
            <SocialLinks className={styles.socialLinks} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely