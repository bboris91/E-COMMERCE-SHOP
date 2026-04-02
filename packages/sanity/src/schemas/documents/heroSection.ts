import { defineType, defineField } from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero section',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'backgroundImages',
      title: 'Background images',
      description: 'Add multiple images to enable a slideshow. At least one recommended.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary button',
      type: 'cta',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary button (optional)',
      type: 'cta',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'backgroundImages.0' },
  },
})
