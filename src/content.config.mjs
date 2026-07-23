import { z } from 'zod';
import { glob } from 'astro/loaders';

const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date().optional(),
});

export const collections = {
  pages: {
    type: 'content_layer',
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: pageSchema,
  },
  blog: {
    type: 'content_layer',
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: blogSchema,
  },
  learn: {
    type: 'content_layer',
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/learn' }),
    schema: pageSchema,
  },
  software: {
    type: 'content_layer',
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/software' }),
    schema: pageSchema,
  },
  adopters: {
    type: 'content_layer',
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/adopters' }),
    schema: pageSchema,
  },
};
