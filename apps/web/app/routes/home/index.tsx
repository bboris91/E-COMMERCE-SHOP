import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { heroQuery } from '../../queries/hero'
import { productsQuery } from '../../queries/products'
import { HeroSection } from './sections/HeroSection'
import { ProductsSection } from './sections/ProductsSection'

type HeroData = {
  heading: string
  subheading: string | null
  backgroundImages: string[] | null
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
      {hero && <HeroSection hero={hero} />}
      <ProductsSection products={products} />
    </main>
  )
}
