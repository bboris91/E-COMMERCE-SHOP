import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

export type ProductCardData = {
  _id: string
  title: string
  slug: string
  image: string | null
  category: { title: string; slug: string } | null
}

type Props = {
  product: ProductCardData
  className?: string
  style?: CSSProperties
}

export function ProductCard({ product, className = '', style }: Props) {
  const { t } = useTranslation()

  return (
    <Link to={`/products/${product.slug}`} className={`card group flex flex-col ${className}`} style={style}>
      <div className="overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="card-img w-full aspect-square object-cover"
          />
        ) : (
          <div
            className="w-full aspect-square flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary-light)' }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>{t('products.noImage')}</span>
          </div>
        )}
      </div>
      <div className="p-4 flex items-end justify-between gap-3">
        <div>
          {product.category && (
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {product.category.title}
            </span>
          )}
          <h3 className="font-semibold mt-1" style={{ color: 'var(--color-text)' }}>
            {product.title}
          </h3>
        </div>
        <ArrowRight
          className="w-4 h-4 shrink-0 mb-1 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: 'var(--color-primary)' }}
        />
      </div>
    </Link>
  )
}
