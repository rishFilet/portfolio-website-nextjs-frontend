'use client';

import { useState, useMemo } from 'react';

import ProjectCard from '@/components/projectCard/ProjectCard';
import TagFilter from '@/components/tagFilter/TagFilter';

import styles from './page.module.css';

type ProjectData = {
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

interface ProjectsClientProps {
  projects: ProjectData[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all unique tags from projects
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [projects]);

  // Filter projects based on selected tags
  const filteredProjects = useMemo(() => {
    if (selectedTags.length === 0) {
      return projects;
    }

    return projects.filter((project) => {
      if (!project.tags) return false;
      return selectedTags.some((tag) => project.tags?.includes(tag));
    });
  }, [selectedTags, projects]);

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

  if (projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No projects available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.tagFilterContainer}>
        <TagFilter
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className={styles.projectsGrid}>
        {filteredProjects.map((data) => {
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
    </>
  );
}