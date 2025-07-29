'use client';

import clsx from 'clsx';

import styles from './TagFilter.module.css';

type TagFilterProps = {
  allTags: string[],
  className?: string,
  onClearFilters: () => void,
  onTagToggle: (tag: string) => void,
  selectedTags: string[],
};

const TagFilter = ({
  allTags,
  selectedTags,
  onTagToggle,
  onClearFilters,
  className,
}: TagFilterProps) => {
  const hasSelectedTags = selectedTags.length > 0;

  return (
    <div className={clsx(styles.tagFilterContainer, className)}>
      <div className={styles.tagFilterHeader}>
        <h3>Filter by Tags</h3>
        {hasSelectedTags && (
          <button
            onClick={onClearFilters}
            className={styles.clearFiltersButton}
            type="button"
          >
            Clear filters
          </button>
        )}
      </div>
      <div className={styles.tagsContainer}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            className={clsx(
              styles.tagButton,
              selectedTags.includes(tag) && styles.tagButtonActive,
            )}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;