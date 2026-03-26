import type { Route } from './+types/product'
import { sanityFetch } from '../lib/sanity'
import { productBySlugQuery } from '../queries/products'

type ProductDetail = {
  _id: string
  title: string
  slug: string
  description: unknown[] | null
  images: string[]
  category: { title: string; slug: string } | null
  seo: { title: string | null; description: string | null } | null
}

export async function loader({ params }: Route.LoaderArgs) {
  const product = await sanityFetch<ProductDetail>(productBySlugQuery, { slug: params.slug })
  if (!product) throw new Response('Not found', { status: 404 })
  return { product }
}

export function meta({ data }: Route.MetaArgs) {
  const title = data?.product?.seo?.title ?? data?.product?.title ?? 'Product'
  const description = data?.product?.seo?.description ?? ''
  return [{ title: `${title} — Flora Bianca` }, { name: 'description', content: description }]
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {product.images.length > 0 ? (
            product.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={product.title}
                className="w-full rounded-(--radius-base) object-cover"
              />
            ))
          ) : (
            <div
              className="w-full aspect-square rounded-(--radius-base) flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-light)' }}
            >
              <span style={{ color: 'var(--color-text-muted)' }}>No image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category && (
            <span className="text-sm font-medium uppercase tracking-wide" style={{ color: 'var(--color-accent)' }}>
              {product.category.title}
            </span>
          )}
          <h1 className="text-3xl font-bold mt-2 mb-6" style={{ color: 'var(--color-text)' }}>
            {product.title}
          </h1>
          {/* Price comes from API (Prisma) — to be added when API is wired */}
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Price available in store
          </p>
          <button
            className="w-full py-3 rounded-(--radius-base) font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </main>
  )
}
