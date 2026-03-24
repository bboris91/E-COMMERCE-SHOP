import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  // Price and stock are NOT stored here — they live in Prisma (managed via admin panel)
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0',
      category: 'category.title',
    },
    prepare({ title, media, category }) {
      return {
        title,
        media,
        subtitle: category ?? 'No category',
      }
    },
  },
})
