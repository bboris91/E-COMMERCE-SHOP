import { Link } from 'react-router'

type ProductCard = {
  _id: string
  title: string
  slug: string
  image: string | null
  category: { title: string; slug: string } | null
}

export function ProductsSection({ products }: { products: ProductCard[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        Our Products
      </h2>
      {products.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>
          No products yet — add some in Sanity Studio.
        </p>
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
                  <span
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: 'var(--color-accent)' }}
                  >
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
    </section>
  )
}
