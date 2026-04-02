import { defineQuery } from 'groq'

export const heroQuery = defineQuery(`
  *[_type == "heroSection"][0] {
    heading,
    subheading,
    "backgroundImages": backgroundImages[].asset->url,
    primaryCta,
    secondaryCta
  }
`)
