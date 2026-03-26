import { defineType, defineField } from 'sanity'

// Singleton — general shop identity, referenced by both navbar and footer
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'shopName',
      title: 'Shop name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: '32×32px or 64×64px image shown in browser tab.',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      description: 'Fallback SEO used when a page has no custom SEO set.',
    }),
  ],
  preview: {
    select: { title: 'shopName', media: 'logo' },
  },
})
