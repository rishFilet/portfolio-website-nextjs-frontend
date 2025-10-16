'use client';

import { useState, useMemo } from 'react';

import PageContainer from '@/components/pageContainer/PageContainer';
import { PageVisibilityGuard } from '@/components/pageVisibility/PageVisibilityGuard';
import ProjectCard from '@/components/projectCard/ProjectCard';
import TagFilter from '@/components/tagFilter/TagFilter';

import styles from './page.module.css';

type ProjectProps = {
  cardDescription: string,
  createdAt: string,
  githubUrl?: string,
  image?: {
    height: number,
    url: string,
    width: number,
  },
  link: string,
  liveDemoUrl?: string,
  tags?: string[],
  technologies?: string[],
  title: string,
};

const initialProjectsData: ProjectProps[] = [
  {
    title: 'Climate Data Analytics Platform',
    cardDescription:
      'Real-time climate monitoring system with predictive analytics for renewable energy optimization.',
    link: '/projects/climate-data-analytics',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    tags: ['React', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/yourusername/climate-data-analytics',
    liveDemoUrl: 'https://climate-analytics-demo.com',
    createdAt: '2024-01-15',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=1',
      width: 800,
    },
  },
  {
    title: 'Portfolio Website',
    cardDescription:
      'A modern, responsive portfolio website built with Next.js, TypeScript, and Strapi CMS.',
    link: '/projects/portfolio-website',
    technologies: ['React', 'Next.js', 'TypeScript', 'Strapi', 'CSS Modules'],
    tags: ['React', 'Next.js', 'TypeScript', 'Strapi', 'CSS Modules'],
    githubUrl: 'https://github.com/yourusername/portfolio-website',
    liveDemoUrl: 'https://your-portfolio.com',
    createdAt: '2024-01-15',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=2',
      width: 800,
    },
  },
  {
    title: 'E-Commerce Platform',
    cardDescription:
      'A full-featured e-commerce platform with user authentication, product management, and payment integration.',
    link: '/projects/ecommerce-platform',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    tags: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveDemoUrl: 'https://your-ecommerce.com',
    createdAt: '2023-11-20',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=3',
      width: 800,
    },
  },
  {
    title: 'Task Management App',
    cardDescription:
      'A collaborative task management application with real-time updates and team collaboration features.',
    link: '/projects/task-management-app',
    technologies: ['React', 'Firebase', 'TypeScript', 'Tailwind CSS'],
    tags: ['React', 'Firebase', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/yourusername/task-management-app',
    liveDemoUrl: 'https://your-task-app.com',
    createdAt: '2023-09-10',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=4',
      width: 800,
    },
  },
  {
    title: 'Weather Dashboard',
    cardDescription:
      'A beautiful weather dashboard with interactive charts and real-time weather data visualization.',
    link: '/projects/weather-dashboard',
    technologies: ['React', 'OpenWeather API', 'Chart.js', 'CSS Grid'],
    tags: ['React', 'OpenWeather API', 'Chart.js', 'CSS Grid'],
    githubUrl: 'https://github.com/yourusername/weather-dashboard',
    liveDemoUrl: 'https://your-weather-app.com',
    createdAt: '2023-07-05',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=5',
      width: 800,
    },
  },
  {
    title: 'AI-Powered Chatbot',
    cardDescription:
      'An intelligent chatbot system with natural language processing and machine learning capabilities.',
    link: '/projects/ai-chatbot',
    technologies: ['Python', 'TensorFlow', 'Flask', 'React', 'WebSocket'],
    tags: ['Python', 'AI/ML', 'React', 'WebSocket'],
    githubUrl: 'https://github.com/yourusername/ai-chatbot',
    liveDemoUrl: 'https://ai-chatbot-demo.com',
    createdAt: '2023-06-15',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=6',
      width: 800,
    },
  },
  {
    title: 'Blockchain Supply Chain',
    cardDescription:
      'A decentralized supply chain management system built on blockchain technology.',
    link: '/projects/blockchain-supply-chain',
    technologies: ['Solidity', 'Web3.js', 'React', 'Node.js', 'IPFS'],
    tags: ['Blockchain', 'Web3', 'React', 'Node.js'],
    githubUrl: 'https://github.com/yourusername/blockchain-supply-chain',
    liveDemoUrl: 'https://supply-chain-demo.com',
    createdAt: '2023-05-20',
    image: {
      height: 450,
      url: 'https://picsum.photos/800/450?random=7',
      width: 800,
    },
  },
];

// Force dynamic rendering to prevent build failures
export const dynamic = 'force-dynamic';

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    initialProjectsData.forEach((project) => {
      project.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, []);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return initialProjectsData;
    }

    return initialProjectsData.filter((project) => {
      if (!project.tags) return false;
      return selectedTags.some((tag) => project.tags?.includes(tag));
    });
  }, [selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <PageVisibilityGuard pageKey="projects">
      <PageContainer>
        <div className={styles.headerContainer}>
          <div className={styles.projectsHeader}>
            <h1>Project Portfolio</h1>
            <p>
              Discover innovative solutions I&apos;ve built for climate
              technology, space exploration, renewable energy, and sustainable
              automation systems.
            </p>
          </div>
        </div>

        <div className={styles.tagFilterContainer}>
          <TagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className={styles.projectsGrid}>
          {filteredProjects.map((data: ProjectProps) => {
            return (
              <ProjectCard
                key={`${data.title}-${data.createdAt}`}
                title={data.title}
                description={data.cardDescription}
                tags={data.tags}
                link={data.link}
                githubUrl={data.githubUrl}
                liveDemoUrl={data.liveDemoUrl}
                image={data.image}
                classNames={{ cardContainer: styles.projectCard }}
              />
            );
          })}
        </div>
      </PageContainer>
    </PageVisibilityGuard>
  );
};

export default Projects;