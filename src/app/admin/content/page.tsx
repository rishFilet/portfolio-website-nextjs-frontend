'use client';

import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { LandingPageContent, SocialLink } from '@/types/content.types';

export default function ContentManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Landing page data
  const [landingPage, setLandingPage] = useState<LandingPageContent | null>(
    null,
  );
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const [subHeaders, setSubHeaders] = useState('');

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialLink, setNewSocialLink] = useState({
    display_name: '',
    icon_shortcode: '',
    link: '',
  });

  const supabase = createClientSupabaseClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load landing page
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: lpData } = await (supabase as any)
        .from('landing_page_content')
        .select('*')
        .single();

      if (lpData) {
        setLandingPage(lpData);
        setHeader(lpData.header);
        setDescription(lpData.description);
        setSubHeaders(lpData.sub_headers || '');
      }

      // Load social links
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: slData } = await (supabase as any)
        .from('social_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (slData) {
        setSocialLinks(slData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  }

  async function saveLandingPage() {
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        header,
        description,
        sub_headers: subHeaders,
      };

      if (landingPage) {
        // Update existing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('landing_page_content')
          .update(updateData)
          .eq('id', landingPage.id);

        if (error) throw error;
      } else {
        // Insert new
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('landing_page_content')
          .insert([updateData]);

        if (error) throw error;
      }

      setMessage('Landing page saved successfully!');
      await loadData();
    } catch (error) {
      setMessage(
        'Error saving: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSaving(false);
    }
  }

  async function addSocialLink() {
    if (!newSocialLink.display_name || !newSocialLink.link) {
      setMessage('Please fill in all social link fields');
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('social_links').insert([
        {
          ...newSocialLink,
          order_index: socialLinks.length,
        },
      ]);

      if (error) throw error;

      setNewSocialLink({ display_name: '', icon_shortcode: '', link: '' });
      setMessage('Social link added!');
      await loadData();
    } catch (error) {
      setMessage(
        'Error adding social link: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async function deleteSocialLink(id: string) {
    if (!confirm('Delete this social link?')) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessage('Social link deleted!');
      await loadData();
    } catch (error) {
      setMessage(
        'Error deleting: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Landing Page Content
      </h1>

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

      {/* Landing Page Section */}
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          Hero Section
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Header (Name)
          </label>
          <input
            type="text"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
            }}
            placeholder="Your Name"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Sub-headers (comma-separated rotating text)
          </label>
          <input
            type="text"
            value={subHeaders}
            onChange={(e) => setSubHeaders(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
            }}
            placeholder="Full Stack Developer,UI/UX Designer,Problem Solver"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
            }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
            }}
            placeholder="A brief description about yourself..."
          />
        </div>

        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <p style={{ margin: 0, color: '#374151' }}>
            <strong>Note:</strong> Hero images and logos are now managed
            per-theme. Go to <strong>Settings → Theme Management</strong> to set
            hero images and logos for each theme (Light/Dark).
          </p>
        </div>

        <button
          onClick={saveLandingPage}
          disabled={saving}
          style={{
            padding: '0.75rem 1.5rem',
            background: saving ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving...' : 'Save Landing Page'}
        </button>
      </div>

      {/* Social Links Section */}
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          Social Links
        </h2>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>
            Existing Links
          </h3>
          {socialLinks.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No social links yet.</p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{link.display_name}</strong> ({link.icon_shortcode})
                    <br />
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', fontSize: '0.875rem' }}
                    >
                      {link.link}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteSocialLink(link.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>
            Add New Social Link
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 2fr auto',
              gap: '1rem',
              alignItems: 'end',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                }}
              >
                Display Name
              </label>
              <input
                type="text"
                value={newSocialLink.display_name}
                onChange={(e) =>
                  setNewSocialLink({
                    ...newSocialLink,
                    display_name: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                }}
                placeholder="GitHub"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                }}
              >
                Icon Shortcode
              </label>
              <input
                type="text"
                value={newSocialLink.icon_shortcode}
                onChange={(e) =>
                  setNewSocialLink({
                    ...newSocialLink,
                    icon_shortcode: e.target.value,
                  })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                }}
                placeholder="github"
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                }}
              >
                Link URL
              </label>
              <input
                type="text"
                value={newSocialLink.link}
                onChange={(e) =>
                  setNewSocialLink({ ...newSocialLink, link: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                }}
                placeholder="https://github.com/username"
              />
            </div>
            <button
              onClick={addSocialLink}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Add Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}