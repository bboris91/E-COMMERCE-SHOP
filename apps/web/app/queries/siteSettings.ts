import { defineQuery } from 'groq'

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    shopName,
    "logo": logo.asset->url,
    defaultSeo
  }
`)

export const navbarQuery = defineQuery(`
  *[_type == "navbar"][0] {
    shopName,
    "logo": logo.asset->url
  }
`)

export const faviconQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    "favicon": favicon.asset->url
  }
`)

export const footerQuery = defineQuery(`
  *[_type == "footer"][0] {
    tagline,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    openingHours,
    copyrightText
  }
`)
