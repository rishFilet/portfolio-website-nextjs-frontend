// Content-specific types for the portfolio website

import { Database } from './database.types';

// Table row types
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Technology = Database['public']['Tables']['technologies']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostImage = Database['public']['Tables']['blog_post_images']['Row'];
export type ProjectPost = Database['public']['Tables']['project_posts']['Row'];
export type ProjectPostImage = Database['public']['Tables']['project_post_images']['Row'];
export type LandingPageContent = Database['public']['Tables']['landing_page_content']['Row'];
export type AboutPageContent = Database['public']['Tables']['about_page_content']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type AboutVenture = Database['public']['Tables']['about_ventures']['Row'];
export type AboutExperience = Database['public']['Tables']['about_experiences']['Row'];
export type AboutHobby = Database['public']['Tables']['about_hobbies']['Row'];
export type AboutValue = Database['public']['Tables']['about_values']['Row'];
export type ContentHistory = Database['public']['Tables']['content_history']['Row'];

// Theme type (for now, manually defined until we regenerate database types)
export type Theme = {
  accent_color_hex: string;
  created_at: string;
  font_awesome_icon: string;
  font_color_hex: string;
  hero_image_name: string | null;
  hero_image_url: string | null;
  id: string;
  is_active: boolean;
  logo_name: string | null;
  logo_url: string | null;
  primary_color_hex: string;
  secondary_color_hex: string;
  unique_name: string;
  updated_at: string;
};

// Extended types with relationships

export interface BlogPostWithRelations extends BlogPost {
  images?: BlogPostImage[];
  tags?: Tag[];
}

export interface ProjectPostWithRelations extends ProjectPost {
  images?: ProjectPostImage[];
  tags?: Tag[];
  technologies?: Technology[];
}

// Form data types
export type BlogPostFormData = Database['public']['Tables']['blog_posts']['Insert'];
export type ProjectPostFormData = Database['public']['Tables']['project_posts']['Insert'];
export type LandingPageFormData = Database['public']['Tables']['landing_page_content']['Update'];
export type SiteSettingsFormData = Database['public']['Tables']['site_settings']['Update'];
export type AboutVentureFormData = Database['public']['Tables']['about_ventures']['Insert'];
export type AboutExperienceFormData = Database['public']['Tables']['about_experiences']['Insert'];
export type AboutHobbyFormData = Database['public']['Tables']['about_hobbies']['Insert'];
export type AboutValueFormData = Database['public']['Tables']['about_values']['Insert'];
export type SocialLinkFormData = Database['public']['Tables']['social_links']['Insert'];

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  data: T[];
  page: number;
  pageSize: number;
}

// Achievement types for About section
export type Achievement = string;

export interface AboutVentureWithAchievements extends Omit<AboutVenture, 'achievements'> {
  achievements: Achievement[];
}

export interface AboutExperienceWithAchievements extends Omit<AboutExperience, 'achievements'> {
  achievements: Achievement[];
}

// Admin dashboard stats
export interface DashboardStats {
  publishedBlogPosts: number;
  publishedProjects: number;
  recentChanges: number;
  totalBlogPosts: number;
  totalProjects: number;
  totalTags: number;
  totalTechnologies: number;
}
