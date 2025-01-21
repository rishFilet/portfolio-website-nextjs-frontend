import { API_IDS } from '@/lib/api/api.constants';
import { getBlogPostsBySlug, getStrapiData } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';

import styles from './page.module.css';

export type Params = Promise<{
  slug: string;
}>;

const BlogPostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const post = await getBlogPostsBySlug(slug);

  return (
    <div className={styles.blogPostContainer}>
      <h3>{post ? post.title : 'Post not found'}</h3>
      {post && (
        <>
          <h6>Published on: 2021-09-01 / Read time: 5min</h6>
          <div className={styles.tagsContainer}>{post.tags}</div>
          <div className={styles.blogPostContentContainer}></div>
        </>
      )}
    </div>
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