'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';

import type { User } from '@supabase/supabase-js';

interface AdminNavProps {
  user: User;
}

export default function AdminNav({ user }: AdminNavProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav
      style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            href="/admin"
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              textDecoration: 'none',
            }}
          >
            Admin Dashboard
          </Link>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              href="/admin"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/content"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Content
            </Link>
            <Link
              href="/admin/projects"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Projects
            </Link>
            <Link
              href="/admin/blog"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Blog
            </Link>
            <Link
              href="/admin/tags"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Tags
            </Link>
            <Link
              href="/admin/about"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              About
            </Link>
            <Link
              href="/admin/settings"
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '0.875rem',
              }}
            >
              Settings
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            View Site →
          </Link>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {user.email}
          </span>
          <button
            onClick={handleSignOut}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </div>
    </nav>
  );
}