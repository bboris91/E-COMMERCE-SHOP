import { Link } from 'react-router'

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export function FeaturedPost({ post }: { post: PostCard }) {
  return (
    <div className="mb-14">
      <Link
        to={`/blog/${post.slug}`}
        className="grid grid-cols-1 lg:grid-cols-2 rounded-(--radius-base) overflow-hidden border transition-shadow hover:shadow-xl group"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="relative h-64 lg:h-auto overflow-hidden">
          {post.mainImage ? (
            <img
              src={post.mainImage}
              alt={post.mainImageAlt ?? post.title}
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
          {post.categories && post.categories.length > 0 && (
            <span className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: 'var(--color-accent)' }}>
              {post.categories[0].title}
            </span>
          )}
          <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {post.author && <span>{post.author.name}</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
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
  )
}
