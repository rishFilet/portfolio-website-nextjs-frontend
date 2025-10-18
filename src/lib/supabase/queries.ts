// Public query functions for fetching content from Supabase
import { cache } from 'react';

import type {
  BlogPostWithRelations,
  ProjectPostWithRelations,
  LandingPageContent,
  SiteSettings,
  SocialLink,
  AboutVenture,
  AboutExperience,
  AboutHobby,
  AboutValue,
  Tag,
  Technology,
  Theme,
} from '@/types/content.types';

import { createServerSupabaseClient } from './server';

// Landing Page
export const getLandingPageData = cache(async (): Promise<LandingPageContent | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('landing_page_content')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return null;
  }
});

// Site Settings
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).from('site_settings').select('*').single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
});

// Blog Posts
export const getBlogPosts = cache(async (): Promise<BlogPostWithRelations[]> => {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch published blog posts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: posts, error: postsError } = await (supabase as any)
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (postsError) throw postsError;
    if (!posts) return [];

    // Fetch images and tags for each post
    const postsWithRelations = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      posts.map(async (post: any) => {
        // Fetch images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: images } = await (supabase as any)
          .from('blog_post_images')
          .select('*')
          .eq('blog_post_id', post.id)
          .order('order_index', { ascending: true });

        // Fetch tags through junction table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: tagData } = await (supabase as any)
          .from('blog_post_tags')
          .select('tag_id, tags(id, name)')
          .eq('blog_post_id', post.id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tags = tagData?.map((t: any) => t.tags).filter(Boolean) || [];

        return {
          ...post,
          images: images || [],
          tags,
        };
      }),
    );

    return postsWithRelations;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
});

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPostWithRelations | null> => {
    try {
      const supabase = await createServerSupabaseClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: post, error: postError } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (postError) throw postError;
      if (!post) return null;

      // Fetch images
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: images } = await (supabase as any)
        .from('blog_post_images')
        .select('*')
        .eq('blog_post_id', post.id)
        .order('order_index', { ascending: true });

      // Fetch tags
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tagData } = await (supabase as any)
        .from('blog_post_tags')
        .select('tag_id, tags(id, name)')
        .eq('blog_post_id', post.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tags = tagData?.map((t: any) => t.tags).filter(Boolean) || [];

      return {
        ...post,
        images: images || [],
        tags,
      };
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }
  },
);

export const getLatestBlogPost = cache(async (): Promise<BlogPostWithRelations | null> => {
  try {
    const posts = await getBlogPosts();
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching latest blog post:', error);
    return null;
  }
});

// Project Posts
export const getProjectPosts = cache(async (): Promise<ProjectPostWithRelations[]> => {
  try {
    const supabase = await createServerSupabaseClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: projects, error: projectsError } = await (supabase as any)
      .from('project_posts')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (projectsError) throw projectsError;
    if (!projects) return [];

    // Fetch images, tags, and technologies for each project
    const projectsWithRelations = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      projects.map(async (project: any) => {
        // Fetch images
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: images } = await (supabase as any)
          .from('project_post_images')
          .select('*')
          .eq('project_post_id', project.id)
          .order('order_index', { ascending: true });

        // Fetch tags
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: tagData } = await (supabase as any)
          .from('project_post_tags')
          .select('tag_id, tags(id, name)')
          .eq('project_post_id', project.id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tags = tagData?.map((t: any) => t.tags).filter(Boolean) || [];

        // Fetch technologies
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: techData } = await (supabase as any)
          .from('project_post_technologies')
          .select('technology_id, technologies(id, name)')
          .eq('project_post_id', project.id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const technologies = techData?.map((t: any) => t.technologies).filter(Boolean) || [];

        return {
          ...project,
          images: images || [],
          tags,
          technologies,
        };
      }),
    );

    return projectsWithRelations;
  } catch (error) {
    console.error('Error fetching project posts:', error);
    return [];
  }
});

export const getProjectPostBySlug = cache(
  async (slug: string): Promise<ProjectPostWithRelations | null> => {
    try {
      const supabase = await createServerSupabaseClient();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: project, error: projectError } = await (supabase as any)
        .from('project_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (projectError) throw projectError;
      if (!project) return null;

      // Fetch images
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: images } = await (supabase as any)
        .from('project_post_images')
        .select('*')
        .eq('project_post_id', project.id)
        .order('order_index', { ascending: true });

      // Fetch tags
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: tagData } = await (supabase as any)
        .from('project_post_tags')
        .select('tag_id, tags(id, name)')
        .eq('project_post_id', project.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tags = tagData?.map((t: any) => t.tags).filter(Boolean) || [];

      // Fetch technologies
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: techData } = await (supabase as any)
        .from('project_post_technologies')
        .select('technology_id, technologies(id, name)')
        .eq('project_post_id', project.id);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const technologies = techData?.map((t: any) => t.technologies).filter(Boolean) || [];

      return {
        ...project,
        images: images || [],
        tags,
        technologies,
      };
    } catch (error) {
      console.error('Error fetching project post by slug:', error);
      return null;
    }
  },
);

// Social Links
export const getSocialLinks = cache(async (): Promise<SocialLink[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
});

// About Page Sections
export const getAboutVentures = cache(async (): Promise<AboutVenture[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('about_ventures')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching about ventures:', error);
    return [];
  }
});

export const getAboutExperiences = cache(
  async (type?: 'professional' | 'consulting' | 'freelance'): Promise<AboutExperience[]> => {
    try {
      const supabase = await createServerSupabaseClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from('about_experiences').select('*').eq('is_active', true);

      if (type) {
        query = query.eq('experience_type', type);
      }

      const { data, error } = await query.order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching about experiences:', error);
      return [];
    }
  },
);

export const getAboutHobbies = cache(async (): Promise<AboutHobby[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('about_hobbies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching about hobbies:', error);
    return [];
  }
});

export const getAboutValues = cache(async (): Promise<AboutValue[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('about_values')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching about values:', error);
    return [];
  }
});

// Tags and Technologies
export const getAllTags = cache(async (): Promise<Tag[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
});

export const getAllTechnologies = cache(async (): Promise<Technology[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('technologies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching technologies:', error);
    return [];
  }
});

// Themes
export const getThemes = cache(async (): Promise<Theme[]> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('themes')
      .select('*')
      .eq('is_active', true)
      .order('unique_name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching themes:', error);
    return [];
  }
});

export const getThemeByName = cache(async (themeName: string): Promise<Theme | null> => {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('themes')
      .select('*')
      .eq('unique_name', themeName)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching theme by name:', error);
    return null;
  }
});
