import type { Route } from './+types/blog'
import { Link } from 'react-router'
import { sanityFetch } from '../lib/sanity'
import { postsQuery } from '../queries/posts'

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData
  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--color-primary)' }}>
          Blog
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Savjeti, inspiracija i priče iz svijeta cvijeća
        </p>
      </div>

      {/* Featured post */}
      {featured && (
        <div className="mb-14">
          <Link
            to={`/blog/${featured.slug}`}
            className="grid grid-cols-1 lg:grid-cols-2 rounded-(--radius-base) overflow-hidden border transition-shadow hover:shadow-xl group"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="relative h-64 lg:h-auto overflow-hidden">
              {featured.mainImage ? (
                <img
                  src={featured.mainImage}
                  alt={featured.mainImageAlt ?? featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full min-h-64" style={{ backgroundColor: 'var(--color-primary-light)' }} />
              )}
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              >
                Istaknuto
              </span>
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              {featured.categories && featured.categories.length > 0 && (
                <span className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--color-accent)' }}>
                  {featured.categories[0].title}
                </span>
              )}
              <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {featured.author && <span>{featured.author.name}</span>}
                {featured.publishedAt && <span>{formatDate(featured.publishedAt)}</span>}
              </div>
              <span
                className="mt-6 self-start px-5 py-2.5 rounded-(--radius-base) text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
              >
                Pročitajte više
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Post grid */}
      {rest.length === 0 && !featured ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Nema objava. Dodajte ih u Sanity Studio.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="group rounded-(--radius-base) overflow-hidden border transition-shadow hover:shadow-lg flex flex-col"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="relative h-48 overflow-hidden">
                {post.mainImage ? (
                  <img
                    src={post.mainImage}
                    alt={post.mainImageAlt ?? post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: 'var(--color-primary-light)' }} />
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {post.categories && post.categories.length > 0 && (
                  <span className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: 'var(--color-accent)' }}>
                    {post.categories[0].title}
                  </span>
                )}
                <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm leading-relaxed line-clamp-3 mb-4 flex-1" style={{ color: 'var(--color-text-muted)' }}>
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs mt-auto pt-4 border-t" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
                  {post.author && <span>{post.author.name}</span>}
                  {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
