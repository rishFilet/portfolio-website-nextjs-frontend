'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { Tag, Technology } from '@/types/content.types';

export default function NewProjectPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [projectSummary, setProjectSummary] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const [allTechnologies, setAllTechnologies] = useState<Technology[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    [],
  );
  const [showTechSelector, setShowTechSelector] = useState(false);

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    loadTags();
    loadTechnologies();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  }, [title, slug]);

  async function loadTags() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (data) {
        setAllTags(data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  }

  async function loadTechnologies() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('technologies')
        .select('*')
        .order('name', { ascending: true });

      if (data) {
        setAllTechnologies(data);
      }
    } catch (error) {
      console.error('Error loading technologies:', error);
    }
  }

  async function handleCreate() {
    if (!title.trim()) {
      setMessage('Please enter a title');
      return;
    }

    if (!slug.trim()) {
      setMessage('Please enter a slug');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // Create project
      const newProject = {
        title: title.trim(),
        slug: slug.trim(),
        content: content || null,
        short_description: shortDescription || null,
        project_summary: projectSummary || null,
        github_url: githubUrl || null,
        live_demo_url: liveDemoUrl || null,
        display_order: displayOrder,
        is_published: isPublished,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: createdProject, error: createError } = await (
        supabase as any
      )
        .from('project_posts')
        .insert([newProject])
        .select()
        .single();

      if (createError) throw createError;

      // Add tags if any selected
      if (selectedTags.length > 0 && createdProject) {
        const tagInserts = selectedTags.map((tagId) => ({
          project_post_id: createdProject.id,
          tag_id: tagId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: tagError } = await (supabase as any)
          .from('project_post_tags')
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      // Add technologies if any selected
      if (selectedTechnologies.length > 0 && createdProject) {
        const techInserts = selectedTechnologies.map((techId) => ({
          project_post_id: createdProject.id,
          technology_id: techId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: techError } = await (supabase as any)
          .from('project_post_technologies')
          .insert(techInserts);

        if (techError) throw techError;
      }

      setMessage('Project created successfully!');
      // Redirect to projects list after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1000);
    } catch (error) {
      setMessage(
        'Error creating project: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
      setSaving(false);
    }
  }

  function toggleTag(tagId: string) {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  }

  function toggleTechnology(techId: string) {
    if (selectedTechnologies.includes(techId)) {
      setSelectedTechnologies(
        selectedTechnologies.filter((id) => id !== techId),
      );
    } else {
      setSelectedTechnologies([...selectedTechnologies, techId]);
    }
  }

  const selectedTagObjects = allTags.filter((tag) =>
    selectedTags.includes(tag.id),
  );

  const selectedTechObjects = allTechnologies.filter((tech) =>
    selectedTechnologies.includes(tech.id),
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <Link
            href="/admin/projects"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'inline-block',
            }}
          >
            ← Back to Projects
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Create New Project
          </h1>
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            background: saving ? '#9ca3af' : '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Creating...' : 'Create Project'}
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '6px',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
          }}
        >
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Title */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
            autoFocus
          />
        </div>

        {/* Slug */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Slug (URL-friendly) *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'monospace',
            }}
          />
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.5rem',
            }}
          >
            URL: /projects/{slug || 'your-slug-here'}
          </p>
        </div>

        {/* Short Description */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Short Description
          </label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One-liner description..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
          />
        </div>

        {/* Project Summary */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Project Summary
          </label>
          <textarea
            value={projectSummary}
            onChange={(e) => setProjectSummary(e.target.value)}
            rows={3}
            placeholder="Brief overview of the project..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            style={{
              display: 'block',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            Full Content (Markdown supported)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            placeholder="Detailed project description, features, challenges, etc..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              fontFamily: 'monospace',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Links */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>
            Project Links
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                Live Demo URL
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://your-project.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <label style={{ fontWeight: '600' }}>Tags</label>
            <button
              onClick={() => setShowTagSelector(!showTagSelector)}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              {showTagSelector ? 'Done' : '+ Add Tags'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: showTagSelector ? '1rem' : 0,
            }}
          >
            {selectedTagObjects.length > 0 ? (
              selectedTagObjects.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: '#e0f2fe',
                    color: '#0369a1',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {tag.name}
                  <button
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0369a1',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                No tags selected
              </p>
            )}
          </div>

          {showTagSelector && (
            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: isSelected ? '#3b82f6' : 'white',
                        color: isSelected ? 'white' : '#374151',
                        border: `1px solid ${isSelected ? '#3b82f6' : '#d1d5db'}`,
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected && '✓ '}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Technologies */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <label style={{ fontWeight: '600' }}>Technologies</label>
            <button
              onClick={() => setShowTechSelector(!showTechSelector)}
              style={{
                padding: '0.5rem 1rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              {showTechSelector ? 'Done' : '+ Add Technologies'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: showTechSelector ? '1rem' : 0,
            }}
          >
            {selectedTechObjects.length > 0 ? (
              selectedTechObjects.map((tech) => (
                <span
                  key={tech.id}
                  style={{
                    padding: '0.375rem 0.75rem',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {tech.name}
                  <button
                    onClick={() => toggleTechnology(tech.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#92400e',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                No technologies selected
              </p>
            )}
          </div>

          {showTechSelector && (
            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {allTechnologies.map((tech) => {
                  const isSelected = selectedTechnologies.includes(tech.id);
                  return (
                    <button
                      key={tech.id}
                      onClick={() => toggleTechnology(tech.id)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        background: isSelected ? '#f59e0b' : 'white',
                        color: isSelected ? 'white' : '#374151',
                        border: `1px solid ${isSelected ? '#f59e0b' : '#d1d5db'}`,
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected && '✓ '}
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Display Order and Publish */}
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              style={{
                width: '150px',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            />
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              Lower numbers appear first
            </p>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontWeight: '600' }}>Publish immediately</span>
          </label>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              marginLeft: '2rem',
            }}
          >
            {isPublished
              ? 'This project will be visible to the public'
              : 'Save as draft (not visible to public)'}
          </p>
        </div>
      </div>
    </div>
  );
}