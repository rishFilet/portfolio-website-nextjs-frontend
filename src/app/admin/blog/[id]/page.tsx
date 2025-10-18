'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import ImageUpload from '@/components/admin/ImageUpload';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { BlogPost, Tag } from '@/types/content.types';

type BlogPostImage = {
  id: string,
  image_name: string | null,
  image_url: string,
  is_main: boolean,
  order_index: number,
};

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>,
}) {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [post, setPost] = useState<BlogPost | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [images, setImages] = useState<BlogPostImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  // Unwrap params
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      loadPost();
      loadTags();
      loadImages();
    }
  }, [id]);

  async function loadPost() {
    if (!id) return;
    setLoading(true);
    try {
      // Load post
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: postData, error: postError } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Load associated tags
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tagLinks } = await (supabase as any)
        .from('blog_post_tags')
        .select('tag_id')
        .eq('blog_post_id', id);

      if (tagLinks) {
        setSelectedTags(
          tagLinks.map((link: { tag_id: string }) => link.tag_id),
        );
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setMessage('Error loading post');
    } finally {
      setLoading(false);
    }
  }

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

  async function loadImages() {
    if (!id) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('blog_post_images')
        .select('*')
        .eq('blog_post_id', id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error loading images:', error);
    }
  }

  async function handleImageUpload(url: string) {
    if (!id) return;
    setUploadingImage(true);
    try {
      const nextOrderIndex = images.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blog_post_images')
        .insert([
          {
            blog_post_id: id,
            image_url: url,
            image_name: 'Blog Image',
            is_main: images.length === 0, // First image is main by default
            order_index: nextOrderIndex,
          },
        ]);

      if (error) throw error;
      await loadImages();
      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function setMainImage(imageId: string) {
    if (!id) return;
    try {
      // First, set all images to is_main = false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('blog_post_images')
        .update({ is_main: false })
        .eq('blog_post_id', id);

      // Then set the selected image to is_main = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blog_post_images')
        .update({ is_main: true })
        .eq('id', imageId);

      if (error) throw error;
      await loadImages();
      setMessage('Main image updated!');
    } catch (error) {
      console.error('Error setting main image:', error);
      setMessage('Error setting main image');
    }
  }

  async function deleteImage(imageId: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blog_post_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      await loadImages();
      setMessage('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage('Error deleting image');
    }
  }

  async function handleSave() {
    if (!post || !id) return;

    setSaving(true);
    setMessage('');

    try {
      // Update post
      const updateData = {
        title: post.title,
        slug: post.slug,
        post_content: post.post_content,
        post_summary: post.post_summary,
        is_published: post.is_published,
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from('blog_posts')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // Update tags - delete all existing and insert new ones
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('blog_post_tags')
        .delete()
        .eq('blog_post_id', id);

      if (selectedTags.length > 0) {
        const tagInserts = selectedTags.map((tagId) => ({
          blog_post_id: id,
          tag_id: tagId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: tagError } = await (supabase as any)
          .from('blog_post_tags')
          .insert(tagInserts);

        if (tagError) throw tagError;
      }

      setMessage('Blog post saved successfully!');
      await loadPost();
    } catch (error) {
      setMessage(
        'Error saving: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
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

  if (loading || !id) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
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
            Edit Blog Post
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6b7280',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            Preview Post
          </Link>
          <button
            onClick={handleSave}
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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
            Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
            }}
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
            Slug (URL-friendly)
          </label>
          <input
            type="text"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
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
            URL: /blog/{post.slug}
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
            value={post.post_summary || ''}
            onChange={(e) => setPost({ ...post, post_summary: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '1rem',
              resize: 'vertical',
            }}
            placeholder="Brief description of the post..."
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
            Content (Markdown supported)
          </label>
          <textarea
            value={post.post_content}
            onChange={(e) => setPost({ ...post, post_content: e.target.value })}
            rows={20}
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

        {/* Images */}
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
              marginBottom: '1rem',
            }}
          >
            Images
          </label>

          <ImageUpload
            label="Upload New Image"
            onImageUploaded={handleImageUpload}
            bucket="images"
            maxSizeMB={5}
            currentImageUrl=""
          />

          {uploadingImage && (
            <p
              style={{
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              Uploading image...
            </p>
          )}

          {images.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>
                Current Images
              </h4>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '1rem',
                      border: `2px solid ${image.is_main ? '#10b981' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      backgroundColor: image.is_main ? '#f0fdf4' : 'white',
                    }}
                  >
                    <img
                      src={image.image_url}
                      alt={image.image_name || 'Blog image'}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                        {image.image_name || 'Blog Image'}
                        {image.is_main && (
                          <span
                            style={{
                              marginLeft: '0.5rem',
                              padding: '0.25rem 0.5rem',
                              background: '#10b981',
                              color: 'white',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                            }}
                          >
                            MAIN IMAGE
                          </span>
                        )}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          marginTop: '0.75rem',
                        }}
                      >
                        {!image.is_main && (
                          <button
                            onClick={() => setMainImage(image.id)}
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
                            Set as Main
                          </button>
                        )}
                        <button
                          onClick={() => deleteImage(image.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {images.length === 0 && !uploadingImage && (
            <p
              style={{
                marginTop: '1rem',
                color: '#6b7280',
                fontSize: '0.875rem',
              }}
            >
              No images uploaded yet. Upload an image to use as the main image
              for this blog post card.
            </p>
          )}
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
              {showTagSelector ? 'Done' : '+ Add/Remove Tags'}
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
              checked={post.is_published}
              onChange={(e) =>
                setPost({ ...post, is_published: e.target.checked })
              }
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontWeight: '600' }}>Publish this post</span>
          </label>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.5rem',
              marginLeft: '2rem',
            }}
          >
            {post.is_published
              ? 'This post is visible to the public'
              : 'This post is saved as a draft'}
          </p>
        </div>

        {/* Metadata */}
        <div
          style={{
            background: '#f9fafb',
            padding: '1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          <p>
            <strong>Created:</strong>{' '}
            {new Date(post.created_at).toLocaleString()}
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>Last Updated:</strong>{' '}
            {new Date(post.updated_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}