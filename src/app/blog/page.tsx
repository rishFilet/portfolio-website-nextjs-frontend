import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';
import { getBlogPosts } from '@/lib/api/api.helpers';
import { BlogDataType } from '@/lib/api/api.types';
import { calculateReadingTime } from '@/lib/utils/string.helpers';

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
            // imageSrc={data.}
            tags={data.tags}
          >
            <h6>{data.createdAt}</h6>
            <h6>{calculateReadingTime([data.postContent])}</h6>
          </Card>
        );
      })}
    </PageContainer>
  );
};

export default Blog;