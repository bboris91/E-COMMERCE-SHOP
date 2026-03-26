import { defineQuery } from 'groq'

export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(featured desc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    featured,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "author": author->{ name, "image": image.asset->url },
    "categories": categories[]->{ title, "slug": slug.current }
  }
`)

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    featured,
    tags,
    body,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "author": author->{ name, "slug": slug.current, "image": image.asset->url, bio },
    "categories": categories[]->{ title, "slug": slug.current },
    seo
  }
`)
