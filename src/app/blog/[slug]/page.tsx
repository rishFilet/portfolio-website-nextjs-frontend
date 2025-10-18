/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

import HeroImage from '@/components/heroImage/HeroImage';
import ImageComponent from '@/components/image/Image';
import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';
import Separator from '@/components/separator/Separator';
import { getBlogPostBySlug } from '@/lib/supabase/queries';
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
    post = await getBlogPostBySlug(slug);
  } catch {
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

  const mainImage = post?.images?.find((image) => image.is_main);

  return (
    <PageVisibilityGuard pageKey="blogPost">
      <PageContainer className={styles.blogPostContainer}>
        <h3>{post.title}</h3>
        <div className={styles.blogMetaDataContainer}>
          <HeroImage className={styles.heroImageContainer} />
          <div className={styles.subHeaderInfo}>
            <h5>Rishi Khan</h5>
            <div className={styles.subHeaderInfoDetails}>
              <h6>{convertDateToHumanReadable(post.created_at)}</h6>
              <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
              <h6>{calculateReadingTime([post.post_content])} min read</h6>
            </div>
          </div>
        </div>
        {mainImage && (
          <div className={styles.aspectRatioContainer}>
            <div className={styles.cardImageContainer}>
              <ImageComponent
                src={mainImage.image_url}
                alt={mainImage.image_name || post.title}
                height={450}
                width={800}
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
            {post.post_content}
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