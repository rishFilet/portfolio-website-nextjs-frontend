'use client';

import { useState, useEffect } from 'react';

import ImageUpload from '@/components/admin/ImageUpload';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import type { SiteSettings, Theme } from '@/types/content.types';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [message, setMessage] = useState('');
  const [themeMessage, setThemeMessage] = useState('');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Theme management
  const [themes, setThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [currentThemeData, setCurrentThemeData] = useState<Theme | null>(null);

  const [siteTitle, setSiteTitle] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Colors
  const [primaryColor, setPrimaryColor] = useState('#059669');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [accentColor, setAccentColor] = useState('#34d399');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] =
    useState('#f9fafb');
  const [textColor, setTextColor] = useState('#111827');
  const [secondaryTextColor, setSecondaryTextColor] = useState('#6b7280');
  const [linkColor, setLinkColor] = useState('#059669');
  const [borderColor, setBorderColor] = useState('#e5e7eb');

  const supabase = createClientSupabaseClient();

  useEffect(() => {
    loadSettings();
    loadThemes();
  }, []);

  useEffect(() => {
    if (themes.length > 0) {
      const theme = themes.find((t) => t.unique_name === selectedTheme);
      setCurrentThemeData(theme || null);
    }
  }, [selectedTheme, themes]);

  async function loadSettings() {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from('site_settings')
        .select('*')
        .single();

      if (data) {
        setSettings(data);
        setSiteTitle(data.site_title);
        setSiteDescription(data.site_description || '');
        setFaviconUrl(data.favicon_url || '');
        setPrimaryColor(data.primary_color);
        setSecondaryColor(data.secondary_color);
        setAccentColor(data.accent_color);
        setBackgroundColor(data.background_color);
        setSecondaryBackgroundColor(data.secondary_background_color);
        setTextColor(data.text_color);
        setSecondaryTextColor(data.secondary_text_color);
        setLinkColor(data.link_color);
        setBorderColor(data.border_color);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  }

  async function loadThemes() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('themes')
        .select('*')
        .order('unique_name', { ascending: true });

      if (error) throw error;
      if (data) {
        setThemes(data);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      setThemeMessage('Error loading themes');
    }
  }

  async function saveSettings() {
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        site_title: siteTitle,
        site_description: siteDescription,
        favicon_url: faviconUrl || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        background_color: backgroundColor,
        secondary_background_color: secondaryBackgroundColor,
        text_color: textColor,
        secondary_text_color: secondaryTextColor,
        link_color: linkColor,
        border_color: borderColor,
      };

      if (settings) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('site_settings')
          .update(updateData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
          .from('site_settings')
          .insert([updateData]);

        if (error) throw error;
      }

      setMessage('Settings saved successfully!');
      await loadSettings();
    } catch (error) {
      setMessage(
        'Error saving: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveTheme() {
    if (!currentThemeData) return;

    setSavingTheme(true);
    setThemeMessage('');

    try {
      const updateData = {
        font_awesome_icon: currentThemeData.font_awesome_icon,
        primary_color_hex: currentThemeData.primary_color_hex,
        secondary_color_hex: currentThemeData.secondary_color_hex,
        font_color_hex: currentThemeData.font_color_hex,
        accent_color_hex: currentThemeData.accent_color_hex,
        logo_url: currentThemeData.logo_url || null,
        logo_name: currentThemeData.logo_name || null,
        hero_image_url: currentThemeData.hero_image_url || null,
        hero_image_name: currentThemeData.hero_image_name || null,
        updated_at: new Date().toISOString(),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('themes')
        .update(updateData)
        .eq('id', currentThemeData.id);

      if (error) throw error;

      setThemeMessage(
        `${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme saved successfully!`,
      );
      await loadThemes();
    } catch (error) {
      setThemeMessage(
        'Error saving theme: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    } finally {
      setSavingTheme(false);
    }
  }

  function updateThemeField(field: keyof Theme, value: string) {
    if (!currentThemeData) return;
    setCurrentThemeData({
      ...currentThemeData,
      [field]: value,
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1
        style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}
      >
        Site Settings
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
          General Settings
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}
            >
              Site Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontWeight: '500',
                marginBottom: '0.5rem',
              }}
            >
              Site Description
            </label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
              }}
            />
          </div>

          <div>
            <ImageUpload
              label="Favicon (leave empty to use active theme's logo)"
              currentImageUrl={faviconUrl}
              onImageUploaded={(url) => setFaviconUrl(url)}
              bucket="favicons"
              acceptedFormats="image/png, image/x-icon, image/vnd.microsoft.icon"
              maxSizeMB={1}
            />
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              If no favicon is provided, the logo will be automatically used and
              formatted as a favicon.
            </p>
          </div>
        </div>
      </div>

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
          Theme Management
        </h2>

        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#eff6ff',
            borderRadius: '6px',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <p style={{ margin: 0, color: '#1e3a8a', lineHeight: '1.5' }}>
            <strong>Note:</strong> Each theme (Light/Dark) has its own logo and
            hero image. Upload separate images for each theme to customize the
            appearance when users switch between themes.
          </p>
        </div>

        {themeMessage && (
          <div
            style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              background: themeMessage.includes('Error')
                ? '#fef2f2'
                : '#f0fdf4',
              border: `1px solid ${themeMessage.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: '6px',
              color: themeMessage.includes('Error') ? '#dc2626' : '#16a34a',
            }}
          >
            {themeMessage}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '2px solid #e5e7eb',
              marginBottom: '1.5rem',
            }}
          >
            {(['light', 'dark'] as const).map((themeName) => (
              <button
                key={themeName}
                onClick={() => setSelectedTheme(themeName)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom:
                    selectedTheme === themeName
                      ? '3px solid #3b82f6'
                      : '3px solid transparent',
                  color: selectedTheme === themeName ? '#3b82f6' : '#6b7280',
                  fontWeight: selectedTheme === themeName ? '600' : '400',
                  cursor: 'pointer',
                  marginBottom: '-2px',
                  fontSize: '1rem',
                  textTransform: 'capitalize',
                }}
              >
                <i
                  className={
                    themeName === 'light' ? 'fas fa-sun' : 'fas fa-moon'
                  }
                  style={{ marginRight: '0.5rem' }}
                ></i>
                {themeName} Theme
              </button>
            ))}
          </div>

          {currentThemeData && (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                  }}
                >
                  Font Awesome Icon (e.g., &quot;fas fa-sun&quot;)
                </label>
                <input
                  type="text"
                  value={currentThemeData.font_awesome_icon}
                  onChange={(e) =>
                    updateThemeField('font_awesome_icon', e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                  }}
                  placeholder="fas fa-sun"
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {[
                  {
                    label: 'Primary Color',
                    field: 'primary_color_hex' as const,
                  },
                  {
                    label: 'Secondary Color',
                    field: 'secondary_color_hex' as const,
                  },
                  { label: 'Font Color', field: 'font_color_hex' as const },
                  { label: 'Accent Color', field: 'accent_color_hex' as const },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label
                      style={{
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      {label}
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <input
                        type="color"
                        value={currentThemeData[field]}
                        onChange={(e) =>
                          updateThemeField(field, e.target.value)
                        }
                        style={{
                          width: '60px',
                          height: '40px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      />
                      <input
                        type="text"
                        value={currentThemeData[field]}
                        onChange={(e) =>
                          updateThemeField(field, e.target.value)
                        }
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <ImageUpload
                  label="Theme Logo"
                  currentImageUrl={currentThemeData.logo_url || ''}
                  onImageUploaded={(url) => updateThemeField('logo_url', url)}
                  bucket="theme-logos"
                  maxSizeMB={2}
                />
              </div>

              <div>
                <ImageUpload
                  label="Theme Hero Image"
                  currentImageUrl={currentThemeData.hero_image_url || ''}
                  onImageUploaded={(url) =>
                    updateThemeField('hero_image_url', url)
                  }
                  bucket="theme-hero-images"
                  maxSizeMB={10}
                />
              </div>

              <button
                onClick={saveTheme}
                disabled={savingTheme}
                style={{
                  padding: '0.75rem 2rem',
                  background: savingTheme ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: savingTheme ? 'not-allowed' : 'pointer',
                }}
              >
                {savingTheme
                  ? 'Saving...'
                  : `Save ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} Theme`}
              </button>
            </div>
          )}
        </div>
      </div>

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
          Color Scheme
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              label: 'Primary Color',
              value: primaryColor,
              setter: setPrimaryColor,
            },
            {
              label: 'Secondary Color',
              value: secondaryColor,
              setter: setSecondaryColor,
            },
            {
              label: 'Accent Color',
              value: accentColor,
              setter: setAccentColor,
            },
            {
              label: 'Background Color',
              value: backgroundColor,
              setter: setBackgroundColor,
            },
            {
              label: 'Secondary Background',
              value: secondaryBackgroundColor,
              setter: setSecondaryBackgroundColor,
            },
            { label: 'Text Color', value: textColor, setter: setTextColor },
            {
              label: 'Secondary Text Color',
              value: secondaryTextColor,
              setter: setSecondaryTextColor,
            },
            { label: 'Link Color', value: linkColor, setter: setLinkColor },
            {
              label: 'Border Color',
              value: borderColor,
              setter: setBorderColor,
            },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label
                style={{
                  display: 'block',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {label}
              </label>
              <div
                style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              >
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={saveSettings}
        disabled={saving}
        style={{
          padding: '0.75rem 2rem',
          background: saving ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
}