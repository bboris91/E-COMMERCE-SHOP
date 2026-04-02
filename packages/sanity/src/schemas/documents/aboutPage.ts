import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ── Header ──────────────────────────────────────────────
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),

    // ── Story ───────────────────────────────────────────────
    defineField({
      name: 'storyHeading',
      title: 'Story section heading',
      type: 'string',
    }),
    defineField({
      name: 'storyParagraphs',
      title: 'Story paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({
      name: 'storyImage',
      title: 'Story image',
      type: 'image',
      options: { hotspot: true },
    }),

    // ── Values ──────────────────────────────────────────────
    defineField({
      name: 'valuesHeading',
      title: 'Values section heading',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      of: [
        defineField({
          name: 'value',
          title: 'Value',
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon name', type: 'string', description: 'Lucide icon name: Heart, Users, Award, Leaf, Star, etc.' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        }),
      ],
      validation: (r) => r.max(8),
    }),

    // ── Mission ─────────────────────────────────────────────
    defineField({
      name: 'missionHeading',
      title: 'Mission section heading',
      type: 'string',
    }),
    defineField({
      name: 'missionText',
      title: 'Mission text',
      type: 'text',
      rows: 4,
    }),

    // ── SEO ─────────────────────────────────────────────────
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
})
