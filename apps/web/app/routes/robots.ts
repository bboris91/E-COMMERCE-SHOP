export function loader() {
  const content = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /orders/',
    'Disallow: /auth/',
    '',
    'Sitemap: https://florabianca.rs/sitemap.xml',
  ].join('\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
