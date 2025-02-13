import ReactMarkdown from 'react-markdown';

import ImageComponent from '@/components/image/Image';
import PageContainer from '@/components/pageContainer/PageContainer';
import Separator from '@/components/separator/Separator';
import { API_IDS } from '@/lib/api/api.constants';
import { getBlogPostsBySlug, getStrapiData } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

import styles from './page.module.css';

export type Params = Promise<{
  slug: string;
}>;

const BlogPostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const post = await getBlogPostsBySlug(slug);
  const image = post?.postImages.find((image) => image.priority === 1)?.mediaFiles[0].formats
    ?.medium;

  return (
    <PageContainer className={styles.blogPostContainer}>
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
      <h3>{post ? post.title : 'Post not found'}</h3>
      {post && (
        <>
          <div className={styles.subHeaderInfo}>
            <h6>{convertDateToHumanReadable(post.createdAt)}</h6>
            <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
            <h6>{calculateReadingTime([post.postContent])} min read</h6>
          </div>
          <Separator orientation="horizontal" style={{ marginBottom: '1.5rem' }} />
          <ReactMarkdown className={styles.blogPostContentContainer}>
            {post.postContent}
          </ReactMarkdown>
        </>
      )}
    </PageContainer>
  );
};

export default BlogPostPage;

export async function generateStaticParams() {
  const posts = await getStrapiData<BlogDataType[]>({
    endpoint: API_IDS.blogPosts,
  });

  return posts.map((post: BlogDataType) => ({
    slug: post.slug,
  }));
}