import { defineQuery } from 'groq'
import { sanityFetch } from '../lib/sanity'

const slugsQuery = defineQuery(`{
  "products": *[_type == "product" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`)

const BASE = 'https://florabianca.rs'

const staticRoutes = [
  { url: BASE, priority: '1.0', changefreq: 'weekly' },
  { url: `${BASE}/products`, priority: '0.9', changefreq: 'weekly' },
  { url: `${BASE}/o-nama`, priority: '0.7', changefreq: 'monthly' },
  { url: `${BASE}/blog`, priority: '0.8', changefreq: 'weekly' },
]

function toXmlDate(iso: string | undefined) {
  return iso ? iso.split('T')[0] : new Date().toISOString().split('T')[0]
}

export async function loader() {
  const data = await sanityFetch<{
    products: { slug: string; _updatedAt: string }[]
    posts: { slug: string; _updatedAt: string }[]
  }>(slugsQuery)

  const productUrls = (data?.products ?? []).map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastmod: toXmlDate(p._updatedAt),
    priority: '0.8',
    changefreq: 'monthly',
  }))

  const postUrls = (data?.posts ?? []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastmod: toXmlDate(p._updatedAt),
    priority: '0.7',
    changefreq: 'monthly',
  }))

  const allUrls = [
    ...staticRoutes.map((r) => ({ ...r, lastmod: toXmlDate(undefined) })),
    ...productUrls,
    ...postUrls,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
