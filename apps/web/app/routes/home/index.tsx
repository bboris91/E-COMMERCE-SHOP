import type { Route } from './+types/index'
import { sanityFetch } from '../../lib/sanity'
import { buildMeta } from '../../lib/meta'
import { heroQuery } from '../../queries/hero'
import { productsQuery } from '../../queries/products'
import { aboutPageQuery } from '../../queries/about'
import { siteSettingsQuery } from '../../queries/siteSettings'
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

type SiteSettings = {
  shopName: string | null
  defaultSeo: { title: string | null; description: string | null } | null
}

export async function loader() {
  const [hero, products, about, siteSettings] = await Promise.all([
    sanityFetch<HeroData>(heroQuery),
    sanityFetch<ProductCard[]>(productsQuery),
    sanityFetch<AboutTeaserData>(aboutPageQuery),
    sanityFetch<SiteSettings>(siteSettingsQuery),
  ])
  return { hero, products, about, siteSettings }
}

export function meta({ loaderData }: Route.MetaArgs) {
  return buildMeta({
    title: loaderData?.siteSettings?.defaultSeo?.title ?? 'Flora Bianca — Cvećara Vrbas',
    description: loaderData?.siteSettings?.defaultSeo?.description ?? 'Flora Bianca — cvećara u Vrbasu. Sveži buketi, aranžmani i saksijsko cveće za svaku priliku. Posetite nas na M. Tita 125, Vrbas.',
    path: '/',
  })
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
