import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { productBySlugQuery } from '../../queries/products'
import { ProductImages } from './sections/ProductImages'
import { ProductInfo } from './sections/ProductInfo'

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

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData?.product?.seo?.title ?? loaderData?.product?.title ?? 'Product'
  const description = loaderData?.product?.seo?.description ?? ''
  return [{ title: `${title} — Flora Bianca` }, { name: 'description', content: description }]
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImages images={product.images} title={product.title} />
        <ProductInfo title={product.title} category={product.category} />
      </div>
    </main>
  )
}
