import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { heroQuery } from '../../queries/hero'
import { productsQuery } from '../../queries/products'
import { aboutPageQuery } from '../../queries/about'
import { HeroSection } from './sections/HeroSection'
import { ProductsSection } from './sections/ProductsSection'
import { AboutTeaser } from './sections/AboutTeaser'

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

type AboutTeaserData = {
  heading: string
  subheading: string | null
  storyHeading: string | null
  storyParagraphs: string[] | null
  storyImage: string | null
}

export async function loader() {
  const [hero, products, about] = await Promise.all([
    sanityFetch<HeroData>(heroQuery),
    sanityFetch<ProductCard[]>(productsQuery),
    sanityFetch<AboutTeaserData>(aboutPageQuery),
  ])
  return { hero, products, about }
}

export function meta() {
  return [
    { title: 'Flora Bianca' },
    { name: 'description', content: 'Sveže cveće za svaku priliku.' },
  ]
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { hero, products, about } = loaderData

  return (
    <main>
      {hero && <HeroSection hero={hero} />}
      <ProductsSection products={products} />
      {about && <AboutTeaser about={about} />}
    </main>
  )
}
