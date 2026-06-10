const BASE_URL = 'https://florabianca.rs'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`
const SITE_NAME = 'Flora Bianca'

type MetaOptions = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'product'
}

export function buildMeta({ title, description, path, image = DEFAULT_IMAGE, type = 'website' }: MetaOptions) {
  const url = `${BASE_URL}${path}`
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: url },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:locale', content: 'sr_RS' },
    ...(type === 'article' || type === 'product'
      ? [
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: fullTitle },
          { name: 'twitter:description', content: description },
          { name: 'twitter:image', content: image },
        ]
      : []),
  ]
}
