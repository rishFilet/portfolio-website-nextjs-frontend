import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';
import { getBlogPosts } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

import styles from './page.module.css';

const Blog = async () => {
  let blogPosts: BlogDataType[] = [];

  try {
    blogPosts = await getBlogPosts();
  } catch {
    // Return empty array to prevent build failure
    blogPosts = [];
  }

  if (blogPosts.length === 0) {
    return (
      <PageVisibilityGuard pageKey="blog">
        <PageContainer>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Blog Posts</h2>
            <p>No blog posts available at the moment.</p>
          </div>
        </PageContainer>
      </PageVisibilityGuard>
    );
  }

  return (
    <PageVisibilityGuard pageKey="blog">
      <PageContainer>
        {blogPosts.map((data: BlogDataType) => {
          return (
            <Card
              key={`${data.slug}-${data.createdAt}`}
              title={data.title}
              description={data.postSummary}
              image={
                data.postImages.find((image) => image.isMain)?.mediaFiles[0]
                  .formats?.medium
              }
              link={`/blog/${data.slug}`}
              tags={data.tags?.map((tag) => tag.name)}
              classNames={{ cardContainer: styles.cardContainer }}
            >
              <h6>{convertDateToHumanReadable(data.createdAt)}</h6>
              <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
              <h6>{calculateReadingTime([data.postContent])} min read</h6>
            </Card>
          );
        })}
      </PageContainer>
    </PageVisibilityGuard>
  );
};

export default Blog;

// Force dynamic rendering to prevent build failures
export const dynamic = 'force-dynamic';