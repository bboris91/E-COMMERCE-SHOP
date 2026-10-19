import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { delay } from '../../../lib/motion'

type Category = {
  _id: string
  title: string
  slug: string
}

export function CategoryFilter({ categories, activeCategory }: { categories: Category[]; activeCategory: string | null }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-2 flex-wrap mb-10 animate-fade-up" style={delay(100)}>
      <Link
        to="/products"
        className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-primary"
        style={
          !activeCategory
            ? { backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
            : { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }
        }
      >
        {t('products.all')}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          to={`/products?category=${cat.slug}`}
          className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-primary"
          style={
            activeCategory === cat.slug
              ? { backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
              : { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }
          }
        >
          {cat.title}
        </Link>
      ))}
    </div>
  )
}
