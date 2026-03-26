import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seed() {
  console.log('🌸 Seeding navbar and footer...\n')

  const tx = client.transaction()

  tx.createOrReplace({
    _id: 'navbar',
    _type: 'navbar',
    shopName: 'Flora Bianca',
  })

  tx.createOrReplace({
    _id: 'footer',
    _type: 'footer',
    tagline: 'Sveže cveće za svaku priliku',
    contactEmail: 'zdravo@florabianca.rs',
    contactPhone: '+381 11 123 4567',
    address: 'Cvetna ulica 12, Beograd 11000',
    socialLinks: {
      instagram: 'https://instagram.com/florabianca',
      facebook: 'https://facebook.com/florabianca',
    },
    openingHours: [
      { _key: 'pon-pet', days: 'Pon – Pet', hours: '09:00 – 19:00' },
      { _key: 'subota', days: 'Subota', hours: '10:00 – 18:00' },
      { _key: 'nedlja', days: 'Nedlja', hours: '10:00 – 16:00' },
    ],
    copyrightText: '© 2026 Flora Bianca. Sva prava zadržana.',
  })

  await tx.commit()
  console.log('✅ Navbar and footer seeded. Publish them in Sanity Studio.')
}

seed().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
