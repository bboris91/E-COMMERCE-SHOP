import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router'
import { useState, useEffect } from 'react'
import { VisualEditing } from '@sanity/visual-editing/react-router'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n/i18n'

import type { Route } from './+types/root'
import { sanityFetch } from './lib/sanity'
import { navbarQuery, footerQuery, faviconQuery } from './queries/siteSettings'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import './app.css'

type NavbarData = {
  shopName: string
  logo: string | null
}

type FooterData = {
  tagline: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  socialLinks: { instagram?: string; facebook?: string; tiktok?: string } | null
  openingHours: { days: string; hours: string }[] | null
  copyrightText: string | null
}

export async function loader() {
  const [nav, footer, faviconData] = await Promise.all([
    sanityFetch<NavbarData>(navbarQuery),
    sanityFetch<FooterData>(footerQuery),
    sanityFetch<{ favicon: string | null }>(faviconQuery),
  ])
  return { nav, footer, favicon: faviconData?.favicon ?? null }
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme-dark')
    if (stored === 'true') setDark(true)
  }, [])

  function toggleDark() {
    setDark((prev) => {
      const next = !prev
      localStorage.setItem('theme-dark', String(next))
      return next
    })
  }

  return (
    <html lang="sr" data-theme="flower-shop" data-dark={dark ? 'true' : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {data?.favicon && (
          <link rel="icon" type="image/png" href={data.favicon} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FloristShop',
              name: data?.nav?.shopName ?? 'Flora Bianca',
              url: 'https://florabianca.rs',
              logo: 'https://florabianca.rs/og-image.jpg',
              image: 'https://florabianca.rs/og-image.jpg',
              description: data?.footer?.tagline ?? undefined,
              ...(data?.footer?.contactPhone && { telephone: data.footer.contactPhone }),
              ...(data?.footer?.contactEmail && { email: data.footer.contactEmail }),
              ...(data?.footer?.address && {
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: data.footer.address,
                  addressCountry: 'RS',
                },
              }),
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 45.5695554,
                longitude: 19.644669,
              },
              ...(data?.footer?.openingHours && data.footer.openingHours.length > 0 && {
                openingHours: data.footer.openingHours.map((r) => `${r.days} ${r.hours}`),
              }),
              sameAs: [
                data?.footer?.socialLinks?.instagram,
                data?.footer?.socialLinks?.facebook,
                data?.footer?.socialLinks?.tiktok,
              ].filter(Boolean),
            }),
          }}
        />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <Navbar
            shopName={data?.nav?.shopName ?? 'Shop'}
            logo={data?.nav?.logo ?? null}
            dark={dark}
            onToggleDark={toggleDark}
          />
          {children}
          <Footer
            shopName={data?.nav?.shopName ?? 'Shop'}
            logo={data?.nav?.logo ?? null}
            tagline={data?.footer?.tagline ?? null}
            contactEmail={data?.footer?.contactEmail ?? null}
            contactPhone={data?.footer?.contactPhone ?? null}
            address={data?.footer?.address ?? null}
            socialLinks={data?.footer?.socialLinks ?? null}
            openingHours={data?.footer?.openingHours ?? null}
            footerText={data?.footer?.copyrightText ?? null}
          />
          <ScrollRestoration />
          <Scripts />
          {typeof document !== 'undefined' && window !== window.parent && <VisualEditing />}
        </I18nextProvider>
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { t } = i18n
  let message = t('error.oops')
  let details = t('error.unexpected')
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? t('error.notFound') : t('error.error')
    details =
      error.status === 404
        ? t('error.pageNotFound')
        : error.statusText || details
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>{details}</p>
      {stack && (
        <pre className="mt-6 p-4 overflow-x-auto rounded-(--radius-base) text-sm" style={{ backgroundColor: 'var(--color-primary-light)' }}>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
