import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { postsQuery } from '../../queries/posts'
import { FeaturedPost } from './sections/FeaturedPost'
import { PostGrid } from './sections/PostGrid'

type PostCard = {
  _id: string
  title: string
  slug: string
  publishedAt: string | null
  excerpt: string | null
  featured: boolean | null
  mainImage: string | null
  mainImageAlt: string | null
  author: { name: string; image: string | null } | null
  categories: { title: string; slug: string }[] | null
}

export async function loader() {
  const posts = await sanityFetch<PostCard[]>(postsQuery)
  return { posts }
}

export function meta() {
  return [
    { title: 'Blog – Flora Bianca' },
    { name: 'description', content: 'Savjeti, inspiracija i priče iz svijeta cvijeća.' },
  ]
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData
  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          Blog
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Savjeti, inspiracija i priče iz svijeta cvijeća
        </p>
      </div>
      {featured && <FeaturedPost post={featured} />}
      {(rest.length > 0 || !featured) && <PostGrid posts={rest} />}
    </main>
  )
}
