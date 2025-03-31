import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';
import { getBlogPosts } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';
import { convertDateToHumanReadable } from '@/lib/utils/date.helpers';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

import styles from './page.module.css';

const Blog = async () => {
  const blogPosts = await getBlogPosts();
  return (
    <PageContainer>
      {blogPosts.map((data: BlogDataType) => {
        return (
          <Card
            key={data.createdAt}
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
  );
};

export default Blog;