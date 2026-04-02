import { Link } from 'react-router'

type Category = {
  _id: string
  title: string
  slug: string
}

export function CategoryFilter({ categories, activeCategory }: { categories: Category[]; activeCategory: string | null }) {
  return (
    <div className="flex gap-2 flex-wrap mb-10">
      <Link
        to="/products"
        className="px-4 py-2 rounded-(--radius-base) text-sm font-medium border transition-colors"
        style={
          !activeCategory
            ? { backgroundColor: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
            : { backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }
        }
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat._id}
          to={`/products?category=${cat.slug}`}
          className="px-4 py-2 rounded-(--radius-base) text-sm font-medium border transition-colors"
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
