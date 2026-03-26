# E-Commerce Shop — Monorepo

A multi-tenant e-commerce platform built as a Turborepo monorepo. Currently hosts **Flora Bianca** (flower shop) with the fishing equipment shop planned as the second tenant.

## Architecture overview

```
apps/
  web/        — React Router v7 (SSR) storefront
  studio/     — Sanity Studio (content editor)
  api/        — NestJS REST API (planned)

packages/
  sanity/     — Sanity schemas + seed scripts (shared between studio and future tenants)
  db/         — Prisma schema + client (PostgreSQL)
  validators/ — Zod validation schemas
  ui/         — Shared UI components (planned)
  config/     — Shared TypeScript / tooling config
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React Router v7 (framework mode, SSR) |
| CMS | Sanity.io (GROQ queries, Studio v3) |
| Styling | Tailwind CSS v4 + CSS variables per tenant |
| Backend | NestJS (planned) |
| Database | PostgreSQL via Prisma 7 |
| Monorepo | Turborepo + pnpm workspaces |
| Language | TypeScript throughout |

## Multi-tenancy

Tenants are resolved by **domain/hostname** at the server level. Each tenant gets:
- Its own `data-theme` attribute on `<html>` driving a full CSS variable theme
- Its own Sanity project + dataset (separate `projectId` per tenant)
- Its own rows in the PostgreSQL `tenants` table
- Tenant context passed via `X-Tenant` header from proxy to API

Current themes:
- `flower-shop` — green + pink, soft backgrounds, light/dark mode
- `fishing-shop` — navy + amber (CSS vars defined, UI not yet built)

## Content model (Sanity)

Schemas live in `packages/sanity/src/schemas/`:

**Documents**
- `product` — flower/product listings
- `category` — product categories
- `post` — blog posts
- `author` — blog authors
- `page` — generic pages (unused, about page is now dedicated)
- `heroSection` — homepage hero (singleton)
- `siteSettings` — favicon, default SEO (singleton)
- `navbar` — shop name + logo (singleton)
- `footer` — tagline, contact, hours, social links (singleton)

**Objects**
- `seo` — title + description
- `cta` — label + href
- `richText` — portable text block

## Web app pages

| Route | File | Description |
|---|---|---|
| `/` | `routes/home.tsx` | Hero + product grid |
| `/products` | `routes/products.tsx` | Product listing with category filter |
| `/products/:slug` | `routes/product.tsx` | Product detail |
| `/blog` | `routes/blog.tsx` | Blog listing with featured post |
| `/blog/:slug` | `routes/blog-post.tsx` | Full blog post |
| `/o-nama` | `routes/about.tsx` | About page (rich layout) |
| `/cart` | `routes/cart.tsx` | Cart (stub) |
| `/checkout` | `routes/checkout.tsx` | Checkout (stub) |
| `/orders/:id` | `routes/order.tsx` | Order confirmation (stub) |
| `/auth/login` | `routes/auth/login.tsx` | Login (stub) |
| `/auth/register` | `routes/auth/register.tsx` | Register (stub) |

## Order model

**No online payment** — customers choose:
- Order online → pick up in store and pay on arrival
- Order online → delivery and pay on delivery (COD)

Payment integration (Stripe etc.) is planned for a later phase.

## Data split

| Data | Where |
|---|---|
| Content (text, images, SEO) | Sanity CMS |
| Prices, stock levels | PostgreSQL (Prisma) |
| Orders, order history | PostgreSQL (Prisma) |
| Tenants, users | PostgreSQL (Prisma) |

Products are linked by a `sanityId` field in the DB — the web app fetches content from Sanity and enriches it with price/stock from the API.

## Getting started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL database
- Sanity account + project

### Install dependencies

```bash
pnpm install
```

### Environment variables

**`apps/web/.env`**
```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

**`packages/sanity/.env`**
```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_write_token
```

**`packages/db/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
```

### Run in development

```bash
# Start web app (port 5173)
pnpm --filter web dev

# Start Sanity Studio (port 3333)
pnpm --filter studio dev

# Run both in parallel
pnpm dev
```

### Seed Sanity content

```bash
# Seed everything at once
pnpm --filter @repo/sanity seed:all

# Or individually
pnpm --filter @repo/sanity seed          # products, categories, hero, about page
pnpm --filter @repo/sanity seed:blog     # blog posts + author
pnpm --filter @repo/sanity seed:layout   # navbar + footer
```

After seeding, open Sanity Studio and **publish** the draft documents to make them live.

### Database migrations

```bash
pnpm --filter @repo/db migrate:dev
```

## Future plans

- [ ] Fishing equipment shop tenant (second Sanity project + theme)
- [ ] NestJS API with tenant middleware
- [ ] Price + stock management via API/admin panel
- [ ] Order management (create, track, fulfill)
- [ ] Authentication (customer accounts)
- [ ] Online payment (Stripe)
- [ ] English language support (i18n)
- [ ] Domain-based tenant resolution in the web app
