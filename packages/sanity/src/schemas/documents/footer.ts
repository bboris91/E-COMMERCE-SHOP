import { defineType, defineField } from 'sanity'

// Singleton — one footer config per dataset
export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short line shown under the logo in the footer.',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Shop address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'facebook', type: 'url', title: 'Facebook' }),
        defineField({ name: 'tiktok', type: 'url', title: 'TikTok' }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'days', title: 'Days', type: 'string', description: 'e.g. Mon – Fri' }),
            defineField({ name: 'hours', title: 'Hours', type: 'string', description: 'e.g. 9:00 – 19:00' }),
          ],
          preview: {
            select: { title: 'days', subtitle: 'hours' },
          },
        },
      ],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
      description: 'e.g. © 2026 Flora Bianca. All rights reserved.',
    }),
  ],
  preview: {
    select: { title: 'contactEmail' },
    prepare({ title }) {
      return { title: 'Footer', subtitle: title }
    },
  },
})
