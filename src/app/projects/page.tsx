import Card from '@/components/card/Card';
import PageContainer from '@/components/pageContainer/PageContainer';

import styles from './page.module.css';

type ProjectsProps = {
  cardDescription: string;
  createdAt: string;
  link: string;
  tags?: string[];
  technologies?: string[];
  title: string;
};

const initialProjectsData = [
  {
    title: 'Blog Title',
    cardDescription:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo maiores porro explicabo accusantium perspiciatis unde, rem, sit ullam magnam, totam ipsam vitae laborum. Consectetur nihil fugiat inventore non animi dignissimos.',
    link: '/blog/1',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    createdAt: '12/12/2023',
  },
];

const Projects = () => {
  return (
    <PageContainer>
      {initialProjectsData.map((data: ProjectsProps) => {
        return (
          <Card
            key={data.createdAt}
            title={data.title}
            description={data.cardDescription}
            tags={data.tags}
          >
            {data.technologies?.map((technology) => (
              <button key={technology} className={styles.tag}>
                {technology}
              </button>
            ))}
          </Card>
        );
      })}
    </PageContainer>
  );
};

export default Projects;
