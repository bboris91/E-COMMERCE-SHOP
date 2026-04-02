import { Link } from 'react-router'

type Props = {
  title: string
  publishedAt: string | null
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

export function PostHeader({ title, publishedAt, mainImage, mainImageAlt, author, categories }: Props) {
  return (
    <>
      <Link
        to="/blog"
        className="inline-flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ← Nazad na blog
      </Link>

      {categories && categories.length > 0 && (
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <span key={cat.slug} className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {cat.title}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6 leading-tight" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm pb-6 mb-8 border-b" style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
        {author && (
          <div className="flex items-center gap-2">
            {author.image && (
              <img src={author.image} alt={author.name} className="w-7 h-7 rounded-full object-cover" />
            )}
            <span>{author.name}</span>
          </div>
        )}
        {publishedAt && <span>{formatDate(publishedAt)}</span>}
      </div>

      {mainImage && (
        <img
          src={mainImage}
          alt={mainImageAlt ?? title}
          className="w-full rounded-(--radius-base) object-cover mb-10 max-h-[480px]"
        />
      )}
    </>
  )
}
