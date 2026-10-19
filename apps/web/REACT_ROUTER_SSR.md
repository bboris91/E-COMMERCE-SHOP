# React Router v7 SSR — How This App Works

This document explains the SSR (server-side rendering) architecture used in `apps/web`, walking through the full request lifecycle from entry point to a rendered page. The products route (`/products`) is used as the primary example throughout.

---

## What is SSR in React Router v7?

With SSR enabled, every page request hits the **server first**. The server:

1. Matches the URL to a route
2. Runs the route's `loader` function to fetch data
3. Renders the React component tree to HTML
4. Sends the complete HTML to the browser (fast first paint, SEO-friendly)

The browser then **hydrates** — React takes over the already-rendered HTML and attaches event listeners, making the page interactive without re-rendering from scratch.

This is controlled by a single line in [react-router.config.ts](react-router.config.ts):

```ts
export default {
  ssr: true,
} satisfies Config;
```

---

## The Full Request Flow

```
Browser requests GET /products?category=roses
         │
         ▼
  React Router server
         │
         ├─ 1. Match URL → finds "products" route → routes/products/index.tsx
         │
         ├─ 2. Run root loader (root.tsx) in parallel with route loader
         │       root loader: fetches Navbar data, Footer data, Favicon from Sanity
         │       products loader: fetches all products + categories from Sanity,
         │                        filters by ?category query param
         │
         ├─ 3. Render Layout (root.tsx) → wraps everything in <html>, <head>, <body>
         │       inside body: Navbar → <Outlet /> → Footer
         │
         ├─ 4. <Outlet /> renders the matched route component → Products component
         │       receives loaderData as a prop
         │
         ├─ 5. Full HTML sent to browser
         │
         └─ 6. Browser hydrates — React attaches to the HTML, app becomes interactive
```

---

## Layer 1: Route Config — `routes.ts`

[app/routes.ts](app/routes.ts) is the single source of truth for all URL → file mappings:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),           // GET /
  route("products", "routes/products/index.tsx"),         // GET /products
  route("products/:slug", "routes/product/index.tsx"),    // GET /products/roses
  route("cart", "routes/cart/index.tsx"),
  route("blog/:slug", "routes/blog-post/index.tsx"),
  // ...
] satisfies RouteConfig;
```

- `index()` = the root path `/`
- `route("path", "file")` = maps a URL path to a file
- `:slug` = dynamic segment, available in `loader` as `params.slug`

No file-system magic — routes are explicit and easy to trace.

---

## Layer 2: Root Layout — `root.tsx`

[app/root.tsx](app/root.tsx) is the **global shell** that wraps every single page. It has three responsibilities:

### 2a. Root Loader — fetch global data once

```ts
export async function loader() {
  const [nav, footer, faviconData] = await Promise.all([
    sanityFetch<NavbarData>(navbarQuery),
    sanityFetch<FooterData>(footerQuery),
    sanityFetch<{ favicon: string | null }>(faviconQuery),
  ])
  return { nav, footer, favicon: faviconData?.favicon ?? null }
}
```

This runs **on every request**, before any route-specific loader. The data (shop name, footer info, favicon) is available to all routes via `useRouteLoaderData('root')`.

### 2b. Layout component — the HTML shell

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  const [dark, setDark] = useState(false)

  return (
    <html lang="sr" data-theme="flower-shop" data-dark={dark ? 'true' : undefined}>
      <head>
        <Meta />   {/* ← injects <title>, og:tags etc from each route's meta() */}
        <Links />  {/* ← injects <link> tags (stylesheets, preconnects) */}
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          <Navbar shopName={data?.nav?.shopName ?? 'Shop'} ... />
          {children}   {/* ← this is where route content goes */}
          <Footer ... />
          <ScrollRestoration />
          <Scripts />  {/* ← injects React hydration scripts */}
        </I18nextProvider>
      </body>
    </html>
  )
}
```

`<Meta />`, `<Links />`, and `<Scripts />` are React Router magic components — they inject the right `<meta>`, `<link>`, and `<script>` tags that React Router knows about (including per-route meta overrides).

### 2c. App component — renders the matched route

```tsx
export default function App() {
  return <Outlet />
}
```

`<Outlet />` is a placeholder that React Router replaces with whichever route component matched the current URL. This is how `root.tsx` wraps every page without knowing which page it is.

---

## Layer 3: The Products Route — full walkthrough

File: [app/routes/products/index.tsx](app/routes/products/index.tsx)

### Step 1 — Type-safe props via generated types

```ts
import type { Route } from './+types/index'
```

React Router auto-generates `./+types/index.ts` during build. It knows the shape of `loaderData`, `params`, and `request` based on your `loader` function — no manual typing needed.

### Step 2 — Loader: fetch data on the server

```ts
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const categorySlug = url.searchParams.get('category')  // e.g. "roses"

  const [products, categories] = await Promise.all([
    sanityFetch<ProductCard[]>(productsQuery),
    sanityFetch<Category[]>(categoriesQuery),
  ])

  const filtered = categorySlug
    ? products.filter((p) => p.category?.slug === categorySlug)
    : products

  return { products: filtered, categories, activeCategory: categorySlug }
}
```

Key points:
- `loader` only runs **on the server** — never in the browser
- `request` is a standard Web API `Request` object — you read query params from it with `new URL(request.url)`
- `Promise.all` fetches products and categories in parallel
- The returned object becomes `loaderData` in the component
- Filtering by category happens server-side (no client JS needed for this logic)

### Step 3 — Meta: per-page SEO tags

```ts
export function meta() {
  return buildMeta({
    title: 'Proizvodi',
    description: 'Pogledajte naš asortiman svežeg cveća...',
    path: '/products',
  })
}
```

`meta()` returns an array of meta tag objects. React Router's `<Meta />` in `root.tsx` injects them into `<head>`. Each route can override the global defaults set in `buildMeta`.

### Step 4 — Component: render with loader data

```tsx
export default function Products({ loaderData }: Route.ComponentProps) {
  const { products, categories, activeCategory } = loaderData
  const { t } = useTranslation()

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <h1>{t('products.title')}</h1>
      <CategoryFilter categories={categories} activeCategory={activeCategory} />
      <ProductGrid products={products} />
    </main>
  )
}
```

- `loaderData` is typed automatically — TypeScript knows exactly what's in it
- No `useEffect` + `fetch` pattern needed — data arrives already loaded
- `useTranslation()` provides i18n (Serbian strings from `sr.json`)
- The component just renders — no async logic here

---

## Layer 4: Section Components

Route files stay clean by delegating rendering to section components in a `sections/` subfolder.

### CategoryFilter — [app/routes/products/sections/CategoryFilter.tsx](app/routes/products/sections/CategoryFilter.tsx)

```tsx
export function CategoryFilter({ categories, activeCategory }) {
  return (
    <div className="flex gap-2 flex-wrap mb-10">
      <Link to="/products">All Products</Link>          {/* clears filter */}
      {categories.map((cat) => (
        <Link key={cat._id} to={`/products?category=${cat.slug}`}>
          {cat.title}
        </Link>
      ))}
    </div>
  )
}
```

Clicking a category link triggers a **full navigation** — React Router fetches from the server again with the new `?category=` param. No client-side filter state needed.

### ProductGrid — [app/routes/products/sections/ProductGrid.tsx](app/routes/products/sections/ProductGrid.tsx)

```tsx
export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product._id} to={`/products/${product.slug}`}>
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
        </Link>
      ))}
    </div>
  )
}
```

A simple presentational component — receives data as props, renders it. No data fetching, no side effects.

---

## Layer 5: Data — GROQ Queries and Sanity

Queries live in [app/queries/products.ts](app/queries/products.ts):

```ts
export const productsQuery = defineQuery(`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    "image": images[0].asset->url,
    category->{ title, "slug": slug.current }
  }
`)
```

This is **GROQ** — Sanity's query language. Think of it like GraphQL but simpler:
- `*[_type == "product"]` = fetch all documents of type "product"
- `| order(...)` = sort them
- `{ ... }` = projection — pick only the fields you need
- `"slug": slug.current` = rename + unwrap a nested field
- `images[0].asset->url` = follow a reference (`->`) to get the image URL
- `category->{ ... }` = follow the category reference and project its fields

`sanityFetch<T>(query)` is a thin wrapper around `@sanity/client`:

```ts
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {})
}
```

---

## How It All Fits Together

```
routes.ts               — URL → file mapping
    │
    ▼
root.tsx                — runs root loader, renders <html> shell with Navbar/Footer
    │
    └─ loader()         — fetches nav + footer data from Sanity (every request)
    └─ Layout           — <html> + <head> + <body> + <Outlet />
    └─ App              — returns <Outlet /> (placeholder for matched route)
         │
         ▼
routes/products/index.tsx   — matched for GET /products
    │
    └─ loader()         — reads ?category param, fetches products + categories from Sanity
    └─ meta()           — returns SEO meta tags for this page
    └─ Products()       — receives loaderData, renders <CategoryFilter> + <ProductGrid>
         │
         ├─ sections/CategoryFilter.tsx   — renders filter links (navigates with ?category=)
         └─ sections/ProductGrid.tsx      — renders product cards linking to /products/:slug
```

---

## Key Concepts Summary

| Concept | What it does | Where |
|---|---|---|
| `ssr: true` | Enables server-side rendering | `react-router.config.ts` |
| `routes.ts` | Maps URLs to route files | `app/routes.ts` |
| `loader()` | Fetches data on the server before render | Every route file |
| `loaderData` | Typed prop with data from `loader` | Route component props |
| `<Outlet />` | Renders the matched child route | `root.tsx` |
| `<Meta />` / `<Links />` / `<Scripts />` | Inject head tags and hydration scripts | `root.tsx` Layout |
| `meta()` | Per-route SEO tags injected into `<head>` | Route files |
| `+types/` | Auto-generated TypeScript types | Build output |
| `sanityFetch()` | Fetches data from Sanity CMS | `app/lib/sanity.ts` |
| GROQ | Query language for Sanity | `app/queries/*.ts` |
| `useTranslation()` | i18n hook for Serbian strings | Components |
