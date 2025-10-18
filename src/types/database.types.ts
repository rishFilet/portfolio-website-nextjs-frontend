// Auto-generated types for Supabase database
// Matches the schema from backend-supabase/supabase/migrations

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      about_experiences: {
        Insert: {
          achievements?: Json;
          company_name: string;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          experience_type: 'professional' | 'consulting' | 'freelance';
          id?: string;
          is_active?: boolean;
          job_title: string;
          period?: string | null;
          updated_at?: string;
        };
        Row: {
          achievements: Json;
          company_name: string;
          created_at: string;
          description: string | null;
          display_order: number;
          experience_type: 'professional' | 'consulting' | 'freelance';
          id: string;
          is_active: boolean;
          job_title: string;
          period: string | null;
          updated_at: string;
        };
        Update: {
          achievements?: Json;
          company_name?: string;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          experience_type?: 'professional' | 'consulting' | 'freelance';
          id?: string;
          is_active?: boolean;
          job_title?: string;
          period?: string | null;
          updated_at?: string;
        };
      };
      about_hobbies: {
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          hobby_name: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          hobby_name: string;
          icon_name: string | null;
          id: string;
          is_active: boolean;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          hobby_name?: string;
          icon_name?: string | null;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      about_page_content: {
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          profile_image_name?: string | null;
          profile_image_url?: string | null;
          title: string;
          updated_at?: string;
        };
        Row: {
          content: string;
          created_at: string;
          id: string;
          profile_image_name: string | null;
          profile_image_url: string | null;
          title: string;
          updated_at: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          profile_image_name?: string | null;
          profile_image_url?: string | null;
          title?: string;
          updated_at?: string;
        };
      };
      about_values: {
        Insert: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          value_title: string;
        };
        Row: {
          created_at: string;
          description: string | null;
          display_order: number;
          id: string;
          is_active: boolean;
          updated_at: string;
          value_title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          is_active?: boolean;
          updated_at?: string;
          value_title?: string;
        };
      };
      about_ventures: {
        Insert: {
          achievements?: Json;
          company_name: string;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          is_active?: boolean;
          period?: string | null;
          role?: string | null;
          updated_at?: string;
        };
        Row: {
          achievements: Json;
          company_name: string;
          created_at: string;
          description: string | null;
          display_order: number;
          id: string;
          is_active: boolean;
          period: string | null;
          role: string | null;
          updated_at: string;
        };
        Update: {
          achievements?: Json;
          company_name?: string;
          created_at?: string;
          description?: string | null;
          display_order?: number;
          id?: string;
          is_active?: boolean;
          period?: string | null;
          role?: string | null;
          updated_at?: string;
        };
      };
      blog_post_images: {
        Insert: {
          blog_post_id: string;
          created_at?: string;
          id?: string;
          image_name?: string | null;
          image_url: string;
          is_main?: boolean;
          order_index?: number;
        };
        Row: {
          blog_post_id: string;
          created_at: string;
          id: string;
          image_name: string | null;
          image_url: string;
          is_main: boolean;
          order_index: number;
        };
        Update: {
          blog_post_id?: string;
          created_at?: string;
          id?: string;
          image_name?: string | null;
          image_url?: string;
          is_main?: boolean;
          order_index?: number;
        };
      };
      blog_posts: {
        Insert: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          likes?: number;
          post_content: string;
          post_summary?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          id: string;
          is_published: boolean;
          likes: number;
          post_content: string;
          post_summary: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_published?: boolean;
          likes?: number;
          post_content?: string;
          post_summary?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
      };
      content_history: {
        Insert: {
          action: 'created' | 'updated' | 'deleted';
          changed_at?: string;
          changes?: Json | null;
          id?: string;
          record_id: string;
          table_name: string;
        };
        Row: {
          action: 'created' | 'updated' | 'deleted';
          changed_at: string;
          changes: Json | null;
          id: string;
          record_id: string;
          table_name: string;
        };
        Update: {
          action?: 'created' | 'updated' | 'deleted';
          changed_at?: string;
          changes?: Json | null;
          id?: string;
          record_id?: string;
          table_name?: string;
        };
      };
      landing_page_content: {
        Insert: {
          created_at?: string;
          description: string;
          header: string;
          hero_image_name?: string | null;
          hero_image_url?: string | null;
          id?: string;
          sub_headers?: string | null;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          description: string;
          header: string;
          hero_image_name: string | null;
          hero_image_url: string | null;
          id: string;
          sub_headers: string | null;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          header?: string;
          hero_image_name?: string | null;
          hero_image_url?: string | null;
          id?: string;
          sub_headers?: string | null;
          updated_at?: string;
        };
      };
      project_post_images: {
        Insert: {
          created_at?: string;
          id?: string;
          image_name?: string | null;
          image_url: string;
          is_main?: boolean;
          order_index?: number;
          project_post_id: string;
        };
        Row: {
          created_at: string;
          id: string;
          image_name: string | null;
          image_url: string;
          is_main: boolean;
          order_index: number;
          project_post_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_name?: string | null;
          image_url?: string;
          is_main?: boolean;
          order_index?: number;
          project_post_id?: string;
        };
      };
      project_posts: {
        Insert: {
          content?: string | null;
          created_at?: string;
          display_order?: number;
          github_url?: string | null;
          id?: string;
          is_published?: boolean;
          live_demo_url?: string | null;
          project_summary?: string | null;
          project_url?: string | null;
          short_description?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Row: {
          content: string | null;
          created_at: string;
          display_order: number;
          github_url: string | null;
          id: string;
          is_published: boolean;
          live_demo_url: string | null;
          project_summary: string | null;
          project_url: string | null;
          short_description: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          display_order?: number;
          github_url?: string | null;
          id?: string;
          is_published?: boolean;
          live_demo_url?: string | null;
          project_summary?: string | null;
          project_url?: string | null;
          short_description?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Insert: {
          accent_color?: string;
          background_color?: string;
          border_color?: string;
          created_at?: string;
          favicon_url?: string | null;
          id?: string;
          link_color?: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_background_color?: string;
          secondary_color?: string;
          secondary_text_color?: string;
          site_description?: string | null;
          site_title?: string;
          text_color?: string;
          updated_at?: string;
        };
        Row: {
          accent_color: string;
          background_color: string;
          border_color: string;
          created_at: string;
          favicon_url: string | null;
          id: string;
          link_color: string;
          logo_url: string | null;
          primary_color: string;
          secondary_background_color: string;
          secondary_color: string;
          secondary_text_color: string;
          site_description: string | null;
          site_title: string;
          text_color: string;
          updated_at: string;
        };
        Update: {
          accent_color?: string;
          background_color?: string;
          border_color?: string;
          created_at?: string;
          favicon_url?: string | null;
          id?: string;
          link_color?: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_background_color?: string;
          secondary_color?: string;
          secondary_text_color?: string;
          site_description?: string | null;
          site_title?: string;
          text_color?: string;
          updated_at?: string;
        };
      };
      social_links: {
        Insert: {
          created_at?: string;
          display_name: string;
          icon_shortcode: string;
          id?: string;
          link: string;
          order_index?: number;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          display_name: string;
          icon_shortcode: string;
          id: string;
          link: string;
          order_index: number;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          icon_shortcode?: string;
          id?: string;
          link?: string;
          order_index?: number;
          updated_at?: string;
        };
      };
      tags: {
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      technologies: {
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
    };
  };
}

