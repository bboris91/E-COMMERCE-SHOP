import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { postsQuery } from '../../queries/posts'
import { FeaturedPost } from './sections/FeaturedPost'
import { PostGrid } from './sections/PostGrid'
import { useTranslation } from 'react-i18next'

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
    { name: 'description', content: 'Saveti, inspiracija i priče iz sveta cveća.' },
  ]
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData
  const { t } = useTranslation()
  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          {t('blog.title')}
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          {t('blog.subtitle')}
        </p>
      </div>
      {featured && <FeaturedPost post={featured} />}
      {(rest.length > 0 || !featured) && <PostGrid posts={rest} />}
    </main>
  )
}
