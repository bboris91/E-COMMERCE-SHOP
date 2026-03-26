import type { Route } from './+types/home'
import { Link } from 'react-router'
import { sanityFetch } from '../lib/sanity'
import { heroQuery } from '../queries/hero'
import { productsQuery } from '../queries/products'

type HeroData = {
  heading: string
  subheading: string | null
  backgroundImage: string | null
  primaryCta: { label: string; href: string } | null
  secondaryCta: { label: string; href: string } | null
}

type ProductCard = {
  _id: string
  title: string
  slug: string
  image: string | null
  category: { title: string; slug: string } | null
}

export async function loader() {
  const [hero, products] = await Promise.all([
    sanityFetch<HeroData>(heroQuery),
    sanityFetch<ProductCard[]>(productsQuery),
  ])
  return { hero, products }
}

export function meta() {
  return [
    { title: 'Flora Bianca' },
    { name: 'description', content: 'Fresh flowers for every occasion.' },
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { hero, products } = loaderData

  return (
    <main>
      {/* Hero */}
      {hero && (
        <section
          className="relative min-h-[70vh] flex items-center justify-center text-center px-4"
          style={
            hero.backgroundImage
              ? { backgroundImage: `url(${hero.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
              : { backgroundColor: 'var(--color-primary-light)' }
          }
        >
          {hero.backgroundImage && <div className="absolute inset-0 bg-black/30" />}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h1
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ color: hero.backgroundImage ? '#fff' : 'var(--color-primary)' }}
            >
              {hero.heading}
            </h1>
            {hero.subheading && (
              <p
                className="text-lg md:text-xl mb-8 opacity-90"
                style={{ color: hero.backgroundImage ? '#fff' : 'var(--color-text-muted)' }}
              >
                {hero.subheading}
              </p>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              {hero.primaryCta && (
                <Link
                  to={hero.primaryCta.href}
                  className="px-6 py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                >
                  {hero.primaryCta.label}
                </Link>
              )}
              {hero.secondaryCta && (
                <Link
                  to={hero.secondaryCta.href}
                  className="px-6 py-3 rounded-(--radius-base) font-semibold border transition-opacity hover:opacity-80"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', backgroundColor: 'var(--color-surface)' }}
                >
                  {hero.secondaryCta.label}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Product grid */}
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
    </main>
  )
}
