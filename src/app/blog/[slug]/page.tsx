/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

import HeroImage from '@/components/heroImage/HeroImage';
import ImageComponent from '@/components/image/Image';
import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';
import Separator from '@/components/separator/Separator';
import { API_IDS } from '@/lib/api/api.constants';
import { getBlogPostsBySlug, getStrapiData } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

import styles from './page.module.css';

export type Params = Promise<{
  slug: string,
}>;

const BlogPostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogPostsBySlug(slug);
  } catch (error) {
    post = null;
  }

  if (!post) {
    return (
      <PageVisibilityGuard pageKey="blogPost">
        <PageContainer className={styles.blogPostContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Post not found</h3>
            <p>The blog post you&apos;re looking for doesn&apos;t exist or is not available.</p>
          </div>
        </PageContainer>
      </PageVisibilityGuard>
    );
  }

  const image = post?.postImages.find((image) => image.order === 1)
    ?.mediaFiles[0].formats?.medium;

  return (
    <PageVisibilityGuard pageKey="blogPost">
      <PageContainer className={styles.blogPostContainer}>
        <h3>{post.title}</h3>
        <div className={styles.blogMetaDataContainer}>
          <HeroImage className={styles.heroImageContainer} />
          <div className={styles.subHeaderInfo}>
            <h5>Rishi Khan</h5>
            <div className={styles.subHeaderInfoDetails}>
              <h6>{convertDateToHumanReadable(post.createdAt)}</h6>
              <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
              <h6>{calculateReadingTime([post.postContent])} min read</h6>
            </div>
          </div>
        </div>
        {image && (
          <div className={styles.aspectRatioContainer}>
            <div className={styles.cardImageContainer}>
              <ImageComponent
                src={image.url}
                alt={image.name}
                height={image.height}
                width={image.width}
                style={{ borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        )}
        <Separator
          orientation="horizontal"
          style={{ marginBottom: '1.5rem' }}
        />
        <div className={styles.blogPostContentContainer}>
          <ReactMarkdown
            disallowedElements={[]}
            unwrapDisallowed
            remarkPlugins={[remarkGfm]}
            components={{
               
              code({
                node: _node,
                inline,
                className,
                children,
                ...props
              }: any) {
                const match = (className || '').match(/language-(\w+)/);
                return !inline && match ? (
                  <SyntaxHighlighter
                    customStyle={{
                      backgroundColor: 'var(--color-codeblock)',
                      borderRadius: '0.5rem',
                    }}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers
                    codeTagProps={{ className: styles.codeTag }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={styles.inlineCodeTag} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.postContent}
          </ReactMarkdown>{' '}
          <Separator
            orientation="horizontal"
            style={{ marginBottom: '1.5rem' }}
          />
        </div>
      </PageContainer>
    </PageVisibilityGuard>
  );
};

export default BlogPostPage;

// Force dynamic rendering to prevent build failures
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const posts = await getStrapiData<BlogDataType[]>({
      endpoint: API_IDS.blogPosts,
      populate: 'filters[publishedAt][$notNull]=true',
    });

    return posts.map((post: BlogDataType) => ({
      slug: post.slug,
    }));
  } catch (error) {
    // Return empty array to prevent build failure
    return [];
  }
}