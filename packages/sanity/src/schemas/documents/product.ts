import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  // Price and stock are NOT stored here — they live in Prisma (managed via admin panel)
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'richText',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.min(1).error('At least one image is required.'),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
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
