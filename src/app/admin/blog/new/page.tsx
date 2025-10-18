'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { Tag } from '@/types/content.types';

export default function NewBlogPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    loadTags();
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

  async function handleCreate() {
    if (!title.trim()) {
      setMessage('Please enter a title');
      return;
    }

    if (!slug.trim()) {
      setMessage('Please enter a slug');
      return;
    }

    if (!postContent.trim()) {
      setMessage('Please enter content');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // Create post
      const newPost = {
        title: title.trim(),
        slug: slug.trim(),
        post_content: postContent,
        post_summary: postSummary || null,
        is_published: isPublished,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: createdPost, error: createError } = await (supabase as any)
        .from('blog_posts')
        .insert([newPost])
        .select()
        .single();

      if (createError) throw createError;

      // Add tags if any selected
      if (selectedTags.length > 0 && createdPost) {
        const tagInserts = selectedTags.map((tagId) => ({
          blog_post_id: createdPost.id,
          tag_id: tagId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: tagError } = await (supabase as any)
          .from('blog_post_tags')
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      setMessage('Blog post created successfully!');
      // Redirect to edit page after a short delay
      setTimeout(() => {
        router.push(`/admin/blog/${createdPost.id}`);
      }, 1000);
    } catch (error) {
      setMessage(
        'Error creating post: ' +
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

  const selectedTagObjects = allTags.filter((tag) =>
    selectedTags.includes(tag.id),
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
            href="/admin/blog"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              display: 'inline-block',
            }}
          >
            ← Back to Blog Posts
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Create New Blog Post
          </h1>
        </div>
        <button
          onClick={handleCreate}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            background: saving ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Creating...' : 'Create Post'}
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
            placeholder="Enter post title..."
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
            URL: /blog/{slug || 'your-slug-here'}
          </p>
        </div>

        {/* Summary */}
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
            Summary (Optional)
          </label>
          <textarea
            value={postSummary}
            onChange={(e) => setPostSummary(e.target.value)}
            rows={3}
            placeholder="Brief description of the post..."
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
            Content (Markdown supported) *
          </label>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={20}
            placeholder="Write your blog post content here..."
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

          {/* Selected Tags Display */}
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
                      display: 'flex',
                      alignItems: 'center',
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

          {/* Tag Selector */}
          {showTagSelector && (
            <div
              style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.75rem',
                }}
              >
                Click tags to add or remove:
              </p>
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
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {isSelected && '✓ '}
                      {tag.name}
                    </button>
                  );
                })}
              </div>
              {allTags.length === 0 && (
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  No tags available.{' '}
                  <Link
                    href="/admin/tags"
                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                  >
                    Create tags
                  </Link>{' '}
                  first.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Publish Status */}
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
              ? 'This post will be visible to the public'
              : 'Save as draft (not visible to public)'}
          </p>
        </div>
      </div>
    </div>
  );
}