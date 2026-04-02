import { Link } from 'react-router'

type PostCard = {
  _id: string
  title: string
  slug: string
  publishedAt: string | null
  excerpt: string | null
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

export function PostGrid({ posts }: { posts: PostCard[] }) {
  if (posts.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>Nema objava. Dodajte ih u Sanity Studio.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
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
  )
}
