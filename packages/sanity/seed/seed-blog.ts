import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

import { authorDoc, posts } from './blog-data'

async function seedBlog() {
  console.log('📝 Seeding blog content (Serbian — ekavica)...\n')

  const transaction = client.transaction()

  transaction.createOrReplace(authorDoc)
  console.log('✓ Author')

  for (const post of posts) {
    transaction.createOrReplace(post)
  }
  console.log(`✓ ${posts.length} blog posts`)

  await transaction.commit()

  console.log('\n✅ Done! Publish the posts in Sanity Studio to make them live.')
}

seedBlog().catch((err) => {
  console.error('❌ Blog seed failed:', err.message)
  process.exit(1)
})
