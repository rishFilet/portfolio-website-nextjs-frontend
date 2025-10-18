'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types/content.types';

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  // Explicitly type the supabase client to avoid type inference issues
  type SupabaseClient = ReturnType<typeof createClientSupabaseClient>;

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function togglePublish(id: string, currentStatus: boolean) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blog_posts')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  }

  async function deletePost(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
          }}
        >
          + New Post
        </Link>
      </div>

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
                }}
              >
                Title
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                }}
              >
                Slug
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              >
                Created
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'right',
                  fontWeight: '600',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  No blog posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem' }}>
                    <Link
                      href={`/admin/blog/${post.id}`}
                      style={{ color: '#3b82f6', textDecoration: 'none' }}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {post.slug}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: post.is_published ? '#d1fae5' : '#fee2e2',
                        color: post.is_published ? '#065f46' : '#991b1b',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                      }}
                    >
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.875rem',
                    }}
                  >
                    {new Date(post.created_at).toLocaleDateString()}
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
                        onClick={() =>
                          togglePublish(post.id, post.is_published)
                        }
                        style={{
                          padding: '0.5rem 1rem',
                          background: post.is_published ? '#f59e0b' : '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                        }}
                      >
                        {post.is_published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}