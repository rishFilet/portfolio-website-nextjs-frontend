// Public query functions that don't depend on cookies
// Used for public pages to avoid authentication-dependent issues
import { createClient } from '@supabase/supabase-js';

import type {
  BlogPostWithRelations,
  ProjectPostWithRelations,
  LandingPageContent,
  SocialLink,
  Tag,
  Technology,
} from '@/types/content.types';

/**
 * Create a cookieless Supabase client for public data fetching
 * This ensures consistent behavior regardless of authentication state
 */
function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

// Landing Page
export async function getPublicLandingPageData(): Promise<LandingPageContent | null> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching public landing page data:', error);
      throw error;
    }
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching public landing page data:', error);
    return null;
  }
}

// Blog Posts
export async function getPublicBlogPosts(): Promise<BlogPostWithRelations[]> {
  try {
    const supabase = createPublicSupabaseClient();

    const { data: posts, error: postsError } = await supabase
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
        const { data: images } = await supabase
          .from('blog_post_images')
          .select('*')
          .eq('blog_post_id', post.id)
          .order('order_index', { ascending: true });

        // Fetch tags through junction table
        const { data: tagData } = await supabase
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
    console.error('Error fetching public blog posts:', error);
    return [];
  }
}

export async function getPublicLatestBlogPost(): Promise<BlogPostWithRelations | null> {
  try {
    const posts = await getPublicBlogPosts();
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching public latest blog post:', error);
    return null;
  }
}

// Project Posts
export async function getPublicProjectPosts(): Promise<ProjectPostWithRelations[]> {
  try {
    const supabase = createPublicSupabaseClient();

    const { data: projects, error: projectsError } = await supabase
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
        const { data: images } = await supabase
          .from('project_post_images')
          .select('*')
          .eq('project_post_id', project.id)
          .order('order_index', { ascending: true });

        // Fetch tags
        const { data: tagData } = await supabase
          .from('project_post_tags')
          .select('tag_id, tags(id, name)')
          .eq('project_post_id', project.id);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tags = tagData?.map((t: any) => t.tags).filter(Boolean) || [];

        // Fetch technologies
        const { data: techData } = await supabase
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
    console.error('Error fetching public project posts:', error);
    return [];
  }
}

// Social Links
export async function getPublicSocialLinks(): Promise<SocialLink[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public social links:', error);
    return [];
  }
}

// Tags and Technologies
export async function getPublicAllTags(): Promise<Tag[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public tags:', error);
    return [];
  }
}

export async function getPublicAllTechnologies(): Promise<Technology[]> {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('technologies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public technologies:', error);
    return [];
  }
}
