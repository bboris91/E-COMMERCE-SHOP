import { defineQuery } from 'groq'

export const productsQuery = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": images[0].asset->url,
    category->{ title, "slug": slug.current }
  }
`)

export const productsByCategoryQuery = defineQuery(`
  *[_type == "product" && category->slug.current == $categorySlug] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": images[0].asset->url,
    category->{ title, "slug": slug.current }
  }
`)

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    "images": images[].asset->url,
    category->{ title, "slug": slug.current },
    seo
  }
`)
