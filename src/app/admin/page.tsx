import Link from 'next/link';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { DashboardStats } from '@/types/content.types';

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabaseClient();

  // Get counts for all content types
  const [
    { count: totalBlogPosts },
    { count: publishedBlogPosts },
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalTags },
    { count: totalTechnologies },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase.from('project_posts').select('*', { count: 'exact', head: true }),
    supabase
      .from('project_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true),
    supabase.from('tags').select('*', { count: 'exact', head: true }),
    supabase.from('technologies').select('*', { count: 'exact', head: true }),
  ]);

  return {
    totalBlogPosts: totalBlogPosts || 0,
    publishedBlogPosts: publishedBlogPosts || 0,
    totalProjects: totalProjects || 0,
    publishedProjects: publishedProjects || 0,
    totalTags: totalTags || 0,
    totalTechnologies: totalTechnologies || 0,
    recentChanges: 0, // TODO: Implement from content_history
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      subtitle: `${stats.publishedBlogPosts} published`,
      link: '/admin/blog',
      color: '#3b82f6',
    },
    {
      title: 'Projects',
      value: stats.totalProjects,
      subtitle: `${stats.publishedProjects} published`,
      link: '/admin/projects',
      color: '#8b5cf6',
    },
    {
      title: 'Tags',
      value: stats.totalTags,
      subtitle: 'Total tags',
      link: '/admin/tags',
      color: '#10b981',
    },
    {
      title: 'Technologies',
      value: stats.totalTechnologies,
      subtitle: 'Total technologies',
      link: '/admin/content',
      color: '#f59e0b',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Welcome back! Here&apos;s an overview of your portfolio content.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.link}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                }}
              >
                <h3 style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {card.title}
                </h3>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: card.color,
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '0.5rem',
                }}
              >
                {card.value}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {card.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Quick Actions
          </h2>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            <Link
              href="/admin/blog/new"
              style={{
                padding: '0.75rem 1rem',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              + New Blog Post
            </Link>
            <Link
              href="/admin/projects/new"
              style={{
                padding: '0.75rem 1rem',
                background: '#8b5cf6',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              + New Project
            </Link>
            <Link
              href="/admin/content"
              style={{
                padding: '0.75rem 1rem',
                background: '#10b981',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Manage Landing Page
            </Link>
            <Link
              href="/admin/tags"
              style={{
                padding: '0.75rem 1rem',
                background: '#14b8a6',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Manage Tags
            </Link>
            <Link
              href="/admin/settings"
              style={{
                padding: '0.75rem 1rem',
                background: '#6b7280',
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Site Settings
            </Link>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
            }}
          >
            Getting Started
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.75rem', color: '#6b7280' }}>
              ✓ Configure site settings
            </li>
            <li style={{ marginBottom: '0.75rem', color: '#6b7280' }}>
              ✓ Update landing page content
            </li>
            <li style={{ marginBottom: '0.75rem', color: '#6b7280' }}>
              ✓ Add your first blog post
            </li>
            <li style={{ marginBottom: '0.75rem', color: '#6b7280' }}>
              ✓ Showcase your projects
            </li>
            <li style={{ marginBottom: '0.75rem', color: '#6b7280' }}>
              ✓ Customize your About page
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}