import { defineCollection, z } from 'astro:content';

// Define blog collection schema
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string().default('Anonymous'),
    authorImage: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// Export collections
export const collections = {
  'blog': blogCollection,
};