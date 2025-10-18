'use client';

import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { Tag } from '@/types/content.types';

interface TagWithUsage extends Tag {
  blog_post_count: number;
  project_count: number;
  usage_details: {
    blog_posts: Array<{ id: string, slug: string, title: string }>,
    projects: Array<{ id: string, slug: string, title: string }>,
  };
}

export default function TagsManagementPage() {
  const [tags, setTags] = useState<TagWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingTag, setEditingTag] = useState<TagWithUsage | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTagId, setExpandedTagId] = useState<string | null>(null);

  const supabase = createClientSupabaseClient();

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    setLoading(true);
    try {
      // Get all tags
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tagsData, error: tagsError } = await (supabase as any)
        .from('tags')
        .select('*')
        .order('name', { ascending: true });

      if (tagsError) throw tagsError;

      // Get usage information for each tag
      const tagsWithUsage = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tagsData || []).map(async (tag: any) => {
          // Get blog posts using this tag
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: blogPostLinks } = await (supabase as any)
            .from('blog_post_tags')
            .select('blog_post_id, blog_posts(id, title, slug)')
            .eq('tag_id', tag.id);

          // Get projects using this tag
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: projectLinks } = await (supabase as any)
            .from('project_post_tags')
            .select('project_post_id, project_posts(id, title, slug)')
            .eq('tag_id', tag.id);

          const blogPosts =
            blogPostLinks
              ?.map((link: any) => link.blog_posts)
              .filter(Boolean) || [];

          const projects =
            projectLinks
              ?.map((link: any) => link.project_posts)
              .filter(Boolean) || [];

          return {
            ...tag,
            blog_post_count: blogPosts.length,
            project_count: projects.length,
            usage_details: {
              blog_posts: blogPosts,
              projects: projects,
            },
          };
        }),
      );

      setTags(tagsWithUsage);
    } catch (error) {
      console.error('Error loading tags:', error);
      setMessage('Error loading tags');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTag() {
    if (!newTagName.trim()) {
      setMessage('Please enter a tag name');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('tags')
        .insert([{ name: newTagName.trim() }]);

      if (error) throw error;

      setMessage('Tag added successfully!');
      setNewTagName('');
      setShowAddModal(false);
      await loadTags();
    } catch (error) {
      setMessage(
        'Error adding tag: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTag() {
    if (!editingTag) return;

    if (!editingTag.name.trim()) {
      setMessage('Please enter a tag name');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('tags')
        .update({ name: editingTag.name.trim() })
        .eq('id', editingTag.id);

      if (error) throw error;

      setMessage('Tag updated successfully!');
      setEditingTag(null);
      await loadTags();
    } catch (error) {
      setMessage(
        'Error updating tag: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTag(tag: TagWithUsage) {
    const totalUsage = tag.blog_post_count + tag.project_count;

    if (totalUsage > 0) {
      const confirmMessage = `This tag is used in ${tag.blog_post_count} blog post(s) and ${tag.project_count} project(s). Deleting it will remove these associations. Are you sure?`;
      if (!confirm(confirmMessage)) return;
    } else {
      if (!confirm(`Delete tag "${tag.name}"?`)) return;
    }

    setSaving(true);
    setMessage('');

    try {
      // Delete the tag (junction table entries will cascade delete)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      setMessage('Tag deleted successfully!');
      await loadTags();
    } catch (error) {
      setMessage(
        'Error deleting tag: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div>Loading tags...</div>;
  }

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
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            Tags Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage tags used across blog posts and projects
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          + Add New Tag
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

      {/* Add Tag Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
              }}
            >
              Add New Tag
            </h2>
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Enter tag name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                marginBottom: '1.5rem',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTagName('');
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTag}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Adding...' : 'Add Tag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tag Modal */}
      {editingTag && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setEditingTag(null)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
              }}
            >
              Edit Tag
            </h2>
            <input
              type="text"
              value={editingTag.name}
              onChange={(e) =>
                setEditingTag({ ...editingTag, name: e.target.value })
              }
              placeholder="Enter tag name"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                marginBottom: '1.5rem',
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleUpdateTag()}
            />
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setEditingTag(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#e5e7eb',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTag}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: saving ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags List */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Tag Name
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Blog Posts
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Projects
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Total Usage
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No tags found. Create your first tag!
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <>
                  <tr
                    key={tag.id}
                    style={{ borderBottom: '1px solid #e5e7eb' }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: '#e0f2fe',
                            color: '#0369a1',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                          }}
                        >
                          {tag.name}
                        </span>
                        {(tag.blog_post_count > 0 || tag.project_count > 0) && (
                          <button
                            onClick={() =>
                              setExpandedTagId(
                                expandedTagId === tag.id ? null : tag.id,
                              )
                            }
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                            title="Show usage details"
                          >
                            <i
                              className={`fas fa-chevron-${expandedTagId === tag.id ? 'up' : 'down'}`}
                            ></i>
                          </button>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: '#6b7280',
                      }}
                    >
                      {tag.blog_post_count}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: '#6b7280',
                      }}
                    >
                      {tag.project_count}
                    </td>
                    <td
                      style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: '#374151',
                      }}
                    >
                      {tag.blog_post_count + tag.project_count}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <button
                          onClick={() => setEditingTag(tag)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTag(tag)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded details row */}
                  {expandedTagId === tag.id && (
                    <tr style={{ background: '#f9fafb' }}>
                      <td colSpan={5} style={{ padding: '1rem' }}>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '2rem',
                          }}
                        >
                          {/* Blog Posts */}
                          <div>
                            <h4
                              style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#374151',
                              }}
                            >
                              Blog Posts ({tag.usage_details.blog_posts.length})
                            </h4>
                            {tag.usage_details.blog_posts.length > 0 ? (
                              <ul
                                style={{
                                  listStyle: 'none',
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                {tag.usage_details.blog_posts.map((post) => (
                                  <li
                                    key={post.id}
                                    style={{
                                      padding: '0.5rem',
                                      marginBottom: '0.25rem',
                                      background: 'white',
                                      borderRadius: '4px',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    <a
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      {post.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p
                                style={{
                                  color: '#6b7280',
                                  fontSize: '0.875rem',
                                }}
                              >
                                Not used in any blog posts
                              </p>
                            )}
                          </div>
                          {/* Projects */}
                          <div>
                            <h4
                              style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#374151',
                              }}
                            >
                              Projects ({tag.usage_details.projects.length})
                            </h4>
                            {tag.usage_details.projects.length > 0 ? (
                              <ul
                                style={{
                                  listStyle: 'none',
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                {tag.usage_details.projects.map((project) => (
                                  <li
                                    key={project.id}
                                    style={{
                                      padding: '0.5rem',
                                      marginBottom: '0.25rem',
                                      background: 'white',
                                      borderRadius: '4px',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    <a
                                      href={`/projects/${project.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color: '#8b5cf6',
                                        textDecoration: 'none',
                                      }}
                                    >
                                      {project.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p
                                style={{
                                  color: '#6b7280',
                                  fontSize: '0.875rem',
                                }}
                              >
                                Not used in any projects
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f0fdf4',
          borderRadius: '6px',
          border: '1px solid #bbf7d0',
        }}
      >
        <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>
          <strong>Tip:</strong> Tags help organize your content and improve
          navigation. They can be shared across blog posts and projects.
        </p>
      </div>
    </div>
  );
}