import { BlogDataType } from '@/lib/api/api.types';

import styles from './BlogPostPage.module.css';

type BlogPostPageProps = {
  blogData: BlogDataType;
};

const BlogPostPage = (props: BlogPostPageProps) => {
  const { cardDescription, footer, imageSrc, postContent, tags, title } = props.blogData;
  return (
    <div className={styles.blogPostContainer}>
      <h3>Blog Post</h3>
      <h6>Published on: 2021-09-01 / Read time: 5min</h6>
      <div className={styles.tagsContainer}></div>
      <div className={styles.blogPostContentContainer}></div>
    </div>
  );
};

export default BlogPostPage;
