import 'dotenv/config'
import { createClient } from '@sanity/client'
import { authorDoc, posts } from './blog-data'

// Seeds a single blog post by _id without touching the others.
// Usage: pnpm seed:blog-post <post-id>

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function seedBlogPost() {
  const id = process.argv[2]
  const post = posts.find((p) => p._id === id)

  if (!post) {
    console.error(`❌ Post "${id ?? ''}" not found. Available ids:\n${posts.map((p) => `  - ${p._id}`).join('\n')}`)
    process.exit(1)
  }

  await client
    .transaction()
    .createIfNotExists(authorDoc)
    .createOrReplace(post)
    .commit()

  console.log(`✅ Seeded "${post.title}"`)
}

seedBlogPost().catch((err) => {
  console.error('❌ Blog post seed failed:', err.message)
  process.exit(1)
})
