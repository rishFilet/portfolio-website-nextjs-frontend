/**
 * Debug utility for API issues
 */

import { API_IDS } from './api.constants';
import { getStrapiData } from './api.helpers';

import type { BlogDataType } from './api.types';

export async function debugBlogPosts() {
  try {
    console.log('🔍 Debugging blog posts API...');

    const posts = await getStrapiData<BlogDataType[]>({
      endpoint: API_IDS.blogPosts,
      populate:
        'populate[0]=postImages.mediaFiles&populate[1]=tags&filters[publishedAt][$notNull]=true',
    });

    console.log(`📊 Total posts from API: ${posts.length}`);

    // Group by slug
    const groupedBySlug: Record<string, BlogDataType[]> = {};
    posts.forEach((post) => {
      if (!groupedBySlug[post.slug]) {
        groupedBySlug[post.slug] = [];
      }
      groupedBySlug[post.slug].push(post);
    });

    console.log('\n📋 Posts by slug:');
    Object.keys(groupedBySlug).forEach((slug) => {
      const slugPosts = groupedBySlug[slug];
      console.log(`\n🔗 Slug: "${slug}" (${slugPosts.length} posts)`);

      slugPosts.forEach((post, index) => {
        console.log(`  ${index + 1}. Title: "${post.title}"`);
        console.log(`     Created: ${post.createdAt}`);
        console.log(
          `     Has Images: ${post.postImages && post.postImages.length > 0 ? 'Yes' : 'No'}`,
        );
        console.log(`     Image Count: ${post.postImages ? post.postImages.length : 0}`);
      });
    });

    // Find duplicates
    const duplicates = Object.keys(groupedBySlug).filter((slug) => groupedBySlug[slug].length > 1);

    if (duplicates.length > 0) {
      console.log('\n⚠️  DUPLICATES FOUND:');
      duplicates.forEach((slug) => {
        console.log(`  - "${slug}" has ${groupedBySlug[slug].length} posts`);
      });
    } else {
      console.log('\n✅ No duplicates found!');
    }

    return {
      totalPosts: posts.length,
      uniqueSlugs: Object.keys(groupedBySlug).length,
      duplicates: duplicates,
      groupedPosts: groupedBySlug,
    };
  } catch (error) {
    console.error('❌ Error debugging blog posts:', error);
    return null;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as unknown as { debugBlogPosts: typeof debugBlogPosts }).debugBlogPosts = debugBlogPosts;
}
