import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { delay } from '../../../lib/motion'

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
  const { t } = useTranslation()

  return (
    <>
      <Link
        to="/blog"
        className="group inline-flex items-center gap-1.5 text-sm mb-8 transition-colors hover:text-primary animate-fade-in"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {t('blog.backToBlog')}
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

      <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight animate-fade-up" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm pb-6 mb-8 border-b animate-fade-up" style={{ ...delay(100), color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>
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
        <div className="overflow-hidden rounded-(--radius-base) mb-10 animate-fade-up" style={delay(200)}>
          <img
            src={mainImage}
            alt={mainImageAlt ?? title}
            className="w-full object-cover max-h-120 animate-[ken-burns_1.6s_var(--ease-soft)_backwards]"
          />
        </div>
      )}
    </>
  )
}
