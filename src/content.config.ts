import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { site } from './site.config';

export const BLOG_CATEGORIES = ['best-of', 'alternatives', 'comparison', 'guide', 'explainer', 'review'] as const;

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(BLOG_CATEGORIES),
    tags: z.array(z.string()).default([]),
    author: z.string().default(site.defaultAuthor),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
