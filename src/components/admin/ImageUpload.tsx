'use client';

import { useState, useEffect } from 'react';

import { createClientSupabaseClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  acceptedFormats?: string;
  bucket?: string;
  currentImageUrl?: string | null;
  label?: string;
  maxSizeMB?: number;
  onImageUploaded: (url: string) => void;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  bucket = 'images',
  label = 'Upload Image',
  acceptedFormats = 'image/png, image/jpeg, image/jpg, image/webp, image/gif',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');

  const supabase = createClientSupabaseClient();

  // Update preview URL when currentImageUrl prop changes (e.g., switching themes)
  useEffect(() => {
    setPreviewUrl(currentImageUrl || '');
  }, [currentImageUrl]);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setError('');
      setUploading(true);

      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`);
      }

      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg|webp|gif)$/)) {
        throw new Error(
          'Please upload a valid image file (PNG, JPEG, WebP, or GIF)',
        );
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: uploadError, data } = await (supabase as any).storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: urlData } = (supabase as any).storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        setPreviewUrl(urlData.publicUrl);
        onImageUploaded(urlData.publicUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to upload image',
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveImage() {
    if (confirm('Are you sure you want to remove this image?')) {
      setPreviewUrl('');
      onImageUploaded('');
    }
  }

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </label>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Image Preview */}
        {previewUrl && (
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f9fafb',
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                padding: '0.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            type="file"
            accept={acceptedFormats}
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
            id={`file-upload-${label.replace(/\s+/g, '-')}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-')}`}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: uploading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            {uploading
              ? 'Uploading...'
              : previewUrl
                ? 'Change Image'
                : 'Upload Image'}
          </label>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem',
            }}
          >
            Max {maxSizeMB}MB. Supports PNG, JPEG, WebP, GIF
          </p>
        </div>

        {/* Or use URL */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '0.5rem',
              color: '#6b7280',
            }}
          >
            Or paste image URL:
          </label>
          <input
            type="url"
            value={previewUrl}
            onChange={(e) => {
              setPreviewUrl(e.target.value);
              onImageUploaded(e.target.value);
            }}
            placeholder="https://example.com/image.png"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
            }}
          />
        </div>
      </div>
    </div>
  );
}