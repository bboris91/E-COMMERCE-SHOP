// Documents
export { aboutPage } from './schemas/documents/aboutPage'
export { product } from './schemas/documents/product'
export { category } from './schemas/documents/category'
export { siteSettings } from './schemas/documents/siteSettings'
export { navbar } from './schemas/documents/navbar'
export { footer } from './schemas/documents/footer'
export { heroSection } from './schemas/documents/heroSection'
export { page } from './schemas/documents/page'
export { author } from './schemas/documents/author'
export { post } from './schemas/documents/post'

// Objects
export { seo } from './schemas/objects/seo'
export { cta } from './schemas/objects/cta'
export { richText } from './schemas/objects/richText'

// All schema types — pass this to the Sanity config
import { aboutPage } from './schemas/documents/aboutPage'
import { product } from './schemas/documents/product'
import { category } from './schemas/documents/category'
import { siteSettings } from './schemas/documents/siteSettings'
import { navbar } from './schemas/documents/navbar'
import { footer } from './schemas/documents/footer'
import { heroSection } from './schemas/documents/heroSection'
import { page } from './schemas/documents/page'
import { author } from './schemas/documents/author'
import { post } from './schemas/documents/post'
import { seo } from './schemas/objects/seo'
import { cta } from './schemas/objects/cta'
import { richText } from './schemas/objects/richText'

export const schemaTypes = [
  // Objects first — documents reference them
  seo,
  cta,
  richText,
  // Documents
  aboutPage,
  category,
  product,
  siteSettings,
  navbar,
  footer,
  heroSection,
  page,
  author,
  post,
]
