import type { Route } from './+types/products'
import { Link } from 'react-router'
import { sanityFetch } from '../lib/sanity'
import { productsQuery } from '../queries/products'
import { categoriesQuery } from '../queries/categories'

type ProductCard = {
  _id: string
  title: string
  slug: string
  image: string | null
  category: { title: string; slug: string } | null
}

type Category = {
  _id: string
  title: string
  slug: string
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const categorySlug = url.searchParams.get('category')

  const [products, categories] = await Promise.all([
    sanityFetch<ProductCard[]>(productsQuery),
    sanityFetch<Category[]>(categoriesQuery),
  ])

  const filtered = categorySlug
    ? products.filter((p) => p.category?.slug === categorySlug)
    : products

  return { products: filtered, categories, activeCategory: categorySlug }
}

export function meta() {
  return [{ title: 'Products — Flora Bianca' }]
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, categories, activeCategory } = loaderData

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        Products
      </h1>

      {/* Category filter */}
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

      {/* Grid */}
      {products.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/products/${product.slug}`}
              className="group rounded-(--radius-base) overflow-hidden border transition-shadow hover:shadow-lg"
              style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  className="w-full aspect-square flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-primary-light)' }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>No image</span>
                </div>
              )}
              <div className="p-4">
                {product.category && (
                  <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
                    {product.category.title}
                  </span>
                )}
                <h3 className="font-semibold mt-1" style={{ color: 'var(--color-text)' }}>
                  {product.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
