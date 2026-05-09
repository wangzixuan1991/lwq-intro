import { defineCollection, z } from 'astro:content';

const bilingual = z.object({ zh: z.string().default(''), en: z.string().default('') });

const publications = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.enum(['journal', 'conference', 'under_review', 'book', 'patent']),
    year: z.number(),
    authors: z.string(),
    title: bilingual,
    venue: bilingual,
    note: bilingual.optional(),
    link: z.string().optional(),
    order: z.number().optional(),
  }),
});

const news = defineCollection({
  type: 'data',
  schema: z.object({
    date: z.string(),
    text: bilingual,
    link: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    kind: z.enum(['research', 'teaching']),
    title: bilingual,
    period: z.string(),
    role: bilingual,
    funder: bilingual.optional(),
    note: bilingual.optional(),
  }),
});

const talks = defineCollection({
  type: 'data',
  schema: z.object({
    date: z.string(),
    title: bilingual,
    venue: bilingual,
    location: bilingual.optional(),
    kind: z.enum(['talk', 'organized']).default('talk'),
  }),
});

const awards = defineCollection({
  type: 'data',
  schema: z.object({
    year: z.string(),
    title: bilingual,
  }),
});

const teaching = defineCollection({
  type: 'data',
  schema: z.object({
    role: bilingual,
    course: bilingual,
    period: z.string(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    org: bilingual,
    title: bilingual,
    period: z.string(),
  }),
});

const education = defineCollection({
  type: 'data',
  schema: z.object({
    school: bilingual,
    degree: bilingual,
    period: z.string(),
  }),
});

export const collections = { publications, news, projects, talks, awards, teaching, experience, education };
