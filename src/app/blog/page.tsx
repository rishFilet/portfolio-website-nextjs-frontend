import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';
import { getPublicBlogPosts } from '@/lib/supabase/queries-public';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

import styles from './page.module.css';

const Blog = async () => {
  const blogPosts = await getPublicBlogPosts();

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
        {blogPosts.map((post) => {
          const mainImage = post.images?.find((img) => img.is_main);
          return (
            <Card
              key={post.id}
              title={post.title}
              description={post.post_summary || ''}
              image={
                mainImage
                  ? { url: mainImage.image_url, height: 450, width: 800 }
                  : undefined
              }
              link={`/blog/${post.slug}`}
              tags={post.tags?.map((tag) => tag.name)}
              classNames={{ cardContainer: styles.cardContainer }}
            >
              <h6>{convertDateToHumanReadable(post.created_at)}</h6>
              <p dangerouslySetInnerHTML={{ __html: '&#x00B7;' }} />
              <h6>{calculateReadingTime([post.post_content])} min read</h6>
            </Card>
          );
        })}
      </PageContainer>
    </PageVisibilityGuard>
  );
};

export default Blog;

// Force dynamic rendering to fetch fresh data on each request
export const dynamic = 'force-dynamic';