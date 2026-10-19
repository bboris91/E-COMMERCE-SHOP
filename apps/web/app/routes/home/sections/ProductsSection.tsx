import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { ProductCard, type ProductCardData } from '../../../components/ProductCard'
import { stagger } from '../../../lib/motion'

export function ProductsSection({ products }: { products: ProductCardData[] }) {
  const { t } = useTranslation()
  const displayed = products.slice(0, 7)
  const hasMore = products.length >= 7

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      <div className="mb-10" data-reveal="">
        <span className="eyebrow mb-3">{t('products.collection')}</span>
        <h2 className="text-3xl md:text-5xl font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('products.ourProducts')}
        </h2>
      </div>
      {products.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>
          {t('products.noProductsHome')}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Reveal wrappers keep the card's own hover transform free */}
          {displayed.map((product, i) => (
            <div key={product._id} data-reveal="" style={stagger(i, 80)} className="flex">
              <ProductCard product={product} className="w-full" />
            </div>
          ))}

          {hasMore && (
            <div data-reveal="" style={stagger(displayed.length, 80)} className="flex">
              <Link
                to="/products"
                className="card group w-full flex flex-col items-center justify-center gap-3 min-h-48"
                style={{ backgroundColor: 'var(--color-primary-light)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-8deg]"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <ArrowRight className="btn-arrow w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-center px-4" style={{ color: 'var(--color-primary)' }}>
                  {t('products.viewAll')}
                </span>
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
