import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';
import { BlogDataType } from '@/lib/api/api.types';

const initialBlogData = [
  {
    title: 'Blog Title',
    cardDescription:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur nihil fugiat inventore non animi dignissimos.',
    imageSrc: '/vercel.svg',
    link: '/blog/1',
    footer: {
      postedDate: '12/12/2023',
      readTime: '5 min read',
    },
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    postContent:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur nihil fugiat inventore non animi dignissimos.',
  },
];

const Blog = () => {
  return (
    <PageContainer>
      {initialBlogData.map((data: BlogDataType) => {
        return (
          <Card
            key={data.footer.postedDate}
            title={data.title}
            description={data.cardDescription}
            imageSrc={data.imageSrc}
            tags={data.tags}
          >
            <h6>{data.footer.postedDate}</h6>
            <h6>{data.footer.readTime}</h6>
          </Card>
        );
      })}
    </PageContainer>
  );
};

export default Blog;
