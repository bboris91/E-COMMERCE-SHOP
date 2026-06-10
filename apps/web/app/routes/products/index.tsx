import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { buildMeta } from '../../lib/meta'
import { productsQuery } from '../../queries/products'
import { categoriesQuery } from '../../queries/categories'
import { CategoryFilter } from './sections/CategoryFilter'
import { ProductGrid } from './sections/ProductGrid'
import { useTranslation } from 'react-i18next'

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
  return buildMeta({
    title: 'Proizvodi',
    description: 'Pogledajte naš asortiman svežeg cveća — buketi, aranžmani, ruže i saksijsko cveće. Flora Bianca cvećara, Vrbas.',
    path: '/products',
  })
}

export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, categories, activeCategory } = loaderData
  const { t } = useTranslation()

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text)' }}>
        {t('products.title')}
      </h1>
      <CategoryFilter categories={categories} activeCategory={activeCategory} />
      <ProductGrid products={products} />
    </main>
  )
}
