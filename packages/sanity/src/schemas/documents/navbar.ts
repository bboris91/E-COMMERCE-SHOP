import { defineType, defineField } from 'sanity'

// Singleton — one navbar config per dataset
export const navbar = defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
      description: 'Shown in the top navigation bar.',
    }),
    defineField({
      name: 'shopName',
      title: 'Shop name',
      type: 'string',
      description: 'Shown as text if no logo is uploaded.',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'shopName', media: 'logo' },
  },
})
