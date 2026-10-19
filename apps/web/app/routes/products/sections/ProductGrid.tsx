import { useTranslation } from 'react-i18next'
import { ProductCard, type ProductCardData } from '../../../components/ProductCard'
import { stagger } from '../../../lib/motion'

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  const { t } = useTranslation()

  if (products.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>{t('products.noProducts')}</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} className="animate-fade-up" style={stagger(i)} />
      ))}
    </div>
  )
}
