import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(['Backend', 'Language', 'Database', 'Infrastructure', 'AI']),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: () =>
    z.object({
      title: z.string(),
      summary: z.string(),
      status: z.enum(['in-progress', 'completed', 'planned']),
      phase: z.string().optional(),
      period: z.string(),
      tags: z.array(z.string()).default([]),
      repo: z.string().url().optional(),
      order: z.number().default(0),
    }),
});

const publications = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
  schema: () =>
    z.object({
      title: z.string(),
      year: z.number(),
      venue: z.string().optional(),
      pdf: z.string().optional(),
      slides: z.string().optional(),
      repo: z.string().url().optional(),
    }),
});

export const collections = { blog, research, publications };
