# Multi-Tenant E-Commerce Platform — Architecture

## Overview

A multi-tenant e-commerce platform built as a Turborepo monorepo. Each tenant (e.g. flower shop, fishing shop) operates on its own domain, has its own Sanity dataset, Stripe account, and isolated user authentication. All tenants share the same codebase and infrastructure but are fully data-isolated.

**Current tenants planned:**
- Flower Shop (`flowershop.com`)
- Fishing Equipment Shop (`fishingshop.com`)

---

## Why This Stack

These decisions were made after evaluating multiple alternatives. The reasoning is documented here so it's clear why each technology was chosen.

### Why React Router v7 (not Next.js)

Next.js was considered and rejected for the following reasons:
- **Vercel lock-in** — Image optimization, ISR, and edge functions are designed for Vercel. Self-hosting Next.js means fighting its architecture.
- **Security** — Multiple critical CVEs (CVSS 10.0) in React Server Components were actively exploited in 2025/2026.
- **DX problems** — Dev server gets progressively slower, confusing caching model, vague error messages.
- **Wrong fit** — Self-hosted, multi-tenant shop is exactly where Next.js performs worst.

React Router v7 (formerly Remix) was chosen because:
- Excellent self-hosting story — runs anywhere Node.js runs
- Clean loader/action model, no caching surprises
- First-class TypeScript support
- Framework mode gives full SSR with file-based routing

### Why Sanity.io (not Strapi, Payload, or others)

Several CMS options were evaluated:

| CMS | Reason rejected |
|---|---|
| **Payload CMS** | Admin panel is built in Next.js — running a Next.js process just for admin while storefront is React Router v7 feels contradictory. Two separate deployments. |
| **Strapi v5** | Good fit technically, but no MCP server integration |
| **Directus** | BSL 1.1 license — not truly open source ("source available") |

Sanity was chosen because:
- **Official MCP server** (released December 2025, 40+ tools) — Claude Code can write GROQ queries with full schema awareness, create/update content directly, and help design schemas interactively. This is a genuine productivity multiplier.
- Content lives in Sanity's cloud (you own it, fully exportable)
- Polished Studio UI that non-developers can use
- Separate datasets per tenant = full content isolation
- GROQ TypeGen is officially GA — automatic TypeScript types from queries

### Why GROQ (not GraphQL)

Sanity supports both but GROQ is clearly primary:

| | GROQ | GraphQL |
|---|---|---|
| Mutations (writes) | Yes | **Not supported** |
| Real-time subscriptions | Yes | No |
| TypeScript TypeGen | Official (GA) | Community tool only |
| Works out of the box | Yes | Requires schema deploy |

GraphQL cannot do mutations or real-time subscriptions in Sanity — a hard blocker for e-commerce (creating orders, updating inventory).

### Why NestJS (not Go or FastAPI)

Go and FastAPI were considered. NestJS wins for this specific stack because:
- **Shared types across the full stack** — TypeScript on both frontend and backend means Zod schemas defined once in `packages/validators` are used by both React Router v7 form validation and NestJS request validation. No sync issues, no duplication.
- Decorator-based architecture maps cleanly to e-commerce domain modules (auth, products, orders, payments)
- Native TypeScript — no cross-language friction

Go/Python would require duplicating all type definitions and validation logic.

### Why Turborepo (not Nx, Moon, or plain pnpm)

Monorepo tooling was evaluated before committing to Turborepo:

| Tool | Verdict |
|---|---|
| **Nx** | Too much ceremony — generators, executors, project graph config. Great for 50+ packages, overkill here. |
| **Moon** | Newer, gaining traction, but smaller ecosystem. Not worth the risk for this project. |
| **pnpm workspaces alone** | No task orchestration or build caching. Fine for tiny repos, not enough here. |
| **Turborepo v2** | Rewritten in Rust — fast. Minimal config (`turbo.json` stays simple). Remote caching free via Vercel or self-hostable. **Winner.** |

The standard approach is **pnpm workspaces + Turborepo together**: pnpm handles package linking, Turborepo handles task orchestration and caching. This is the setup we use.

### Why Sanity Studio in the Monorepo (not Sanity-hosted)

Three options were evaluated:
1. **Sanity-hosted** (`yourproject.sanity.studio`) — free, zero maintenance, but no custom domain or branding
2. **Monorepo + own deployment** — custom domain (`studio.flowershop.com`), full control, consistent with the rest of the stack ✓
3. **Embedded in web app** — adds complexity, mixes concerns

The Studio lives in `apps/studio` (or `packages/sanity`) and is deployed as a static Vite app to Vercel/Netlify per tenant with its own subdomain.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Monorepo | Turborepo + pnpm workspaces | pnpm links packages, Turborepo orchestrates tasks + caching |
| Frontend | React Router v7 (framework mode) | SSR, file-based routing |
| Styling | Tailwind CSS v4 | CSS variable theming per tenant |
| CMS | Sanity.io | Separate dataset per tenant |
| Backend | NestJS | TypeScript-native, modular |
| Database ORM | Prisma | PostgreSQL |
| Validation | Zod | Shared between frontend & backend |
| Payments | Cash only (MVP) | No Stripe — paid in person on pickup/delivery |
| Auth | JWT | Isolated per tenant |
| Payments | Cash on delivery/pickup | No online payment processing (Stripe deferred) |
| Query language | GROQ | Sanity's native query language |

---

## Monorepo Structure

```
e-commerc-shop/
├── apps/
│   ├── web/                  # React Router v7 frontend
│   ├── api/                  # NestJS backend
│   └── studio/               # Sanity Studio (deployed per tenant)
├── packages/
│   ├── db/                   # Prisma schema + generated client
│   ├── validators/           # Zod schemas shared across apps
│   ├── ui/                   # Headless shared UI components
│   ├── config/               # Shared tsconfig, Tailwind base config
│   └── sanity/               # Shared Sanity schema definitions
├── turbo.json
├── package.json
└── ARCHITECTURE.md
```

---

## Multi-Tenancy Strategy

### Domain & Proxy Resolution

Each tenant has its own domain. Both domains point to the same deployed frontend and API. A reverse proxy (Nginx or Cloudflare Workers) maps the incoming domain to a tenant slug, injecting it as a request header.

```
flowershop.com  ──► proxy ──► frontend (X-Tenant: flowers)
                         └──► API      (X-Tenant: flowers)

fishingshop.com ──► proxy ──► frontend (X-Tenant: fishing)
                         └──► API      (X-Tenant: fishing)
```

The frontend reads `X-Tenant` at runtime, fetches tenant config from the API, and applies the correct theme. The API resolves tenant context from the same header on every request.

### Tenant Config in Database

Each tenant's configuration (theme, Sanity credentials) lives in the database:

```prisma
model Tenant {
  id              String   @id @default(cuid())
  slug            String   @unique       // "flowers" | "fishing"
  name            String
  domain          String   @unique       // "flowershop.com"
  theme           String                 // "flower-shop" | "fishing-shop"
  sanityProjectId String
  sanityDataset   String
  createdAt       DateTime @default(now())

  users    User[]
  products Product[]
  orders   Order[]
}
```

---

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String
  password  String                         // hashed
  role      UserRole @default(CUSTOMER)    // CUSTOMER | ADMIN
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  orders    Order[]
  createdAt DateTime @default(now())

  @@unique([email, tenantId])              // same email allowed across tenants
}

model Product {
  id            String         @id @default(cuid())
  sanityId      String                         // reference to Sanity document
  tenantId      String
  tenant        Tenant         @relation(fields: [tenantId], references: [id])
  price         Int                            // current price in cents
  stock         Int                            // current available stock
  active        Boolean        @default(true)
  priceHistory  PriceHistory[]
  stockHistory  StockHistory[]
  orderItems    OrderItem[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@unique([sanityId, tenantId])
}

// Written every time price changes — never deleted
model PriceHistory {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  price     Int                            // price in cents at this point in time
  changedBy String                         // userId of admin who made the change
  createdAt DateTime @default(now())
}

// Written every time stock is adjusted (restock, sale, manual correction)
model StockHistory {
  id        String          @id @default(cuid())
  productId String
  product   Product         @relation(fields: [productId], references: [id])
  delta     Int                            // positive = restock, negative = sold/removed
  reason    StockAdjustReason
  orderId   String?                        // set when reason = SOLD
  changedBy String?                        // userId of admin for manual adjustments
  createdAt DateTime        @default(now())
}

model Order {
  id              String          @id @default(cuid())
  tenantId        String
  tenant          Tenant          @relation(fields: [tenantId], references: [id])
  userId          String
  user            User            @relation(fields: [userId], references: [id])
  status          OrderStatus     @default(PENDING)
  fulfillmentType FulfillmentType
  deliveryAddress String?                       // required when fulfillmentType = DELIVERY
  note            String?                       // optional customer note to the shop
  total           Int                           // total in cents (sum of items at purchase time)
  items           OrderItem[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Int                            // price per unit at time of purchase (never changes)
}

enum UserRole {
  CUSTOMER
  ADMIN
}

enum FulfillmentType {
  PICKUP      // customer comes to shop and pays on arrival
  DELIVERY    // delivered to address, customer pays on arrival
}

enum OrderStatus {
  PENDING           // placed by customer, awaiting shop confirmation
  CONFIRMED         // shop acknowledged the order
  READY             // prepared and ready for pickup (PICKUP orders)
  OUT_FOR_DELIVERY  // on the way to customer (DELIVERY orders)
  COMPLETED         // picked up or delivered — payment collected
  CANCELLED
}

enum StockAdjustReason {
  SOLD        // order completed
  RESTOCK     // admin added stock
  CORRECTION  // manual correction
}
```

---

## Backend — NestJS

### Tenant Middleware

Every incoming request passes through a `TenantMiddleware` that:
1. Reads the `X-Tenant` header (set by proxy)
2. Looks up the tenant in the database by slug
3. Attaches the tenant object to the request context

All guards, services, and Prisma queries downstream automatically use `request.tenant.id` — no manual tenant filtering needed in business logic.

### Module Structure

```
api/src/
├── tenant/           # Tenant middleware + decorator
├── auth/             # JWT auth, isolated per tenant
├── products/         # Product CRUD, price/stock management, history
├── orders/           # Order management, stock decrement on completion
├── webhooks/         # Sanity webhook handler (content sync → Prisma)
└── common/           # Guards, interceptors, pipes (AdminGuard here)
```

### Order Flow

No online payment — orders are placed and fulfilled with cash on arrival:

```
1. Customer places order (PICKUP or DELIVERY)
   → POST /orders { fulfillmentType, items, deliveryAddress?, note? }
   → Validate stock available
   → Create Order (status: PENDING)
   → Decrement stock immediately  (StockHistory: SOLD)

2. Shop admin sees order in admin panel
   → Marks CONFIRMED

3a. PICKUP path:
   → Shop prepares order → marks READY
   → Customer arrives, pays cash → admin marks COMPLETED

3b. DELIVERY path:
   → Shop dispatches → marks OUT_FOR_DELIVERY
   → Delivered, cash collected → admin marks COMPLETED

4. Cancellation (any stage before COMPLETED)
   → Admin or customer cancels → status CANCELLED
   → Stock restored  (StockHistory: CORRECTION)
```

### Price Change Flow

Admin changes price via `/admin/products/:id`:

```
1. PUT /products/:id/price  { price: 2999 }
   → Prisma transaction:
      a. Update Product.price
      b. Insert PriceHistory record (new price + changedBy userId)
```

Price history is append-only — records are never updated or deleted.

### Sanity → Prisma Webhook Sync

When a product is published in Sanity Studio, a webhook fires to NestJS:

```
POST /webhooks/sanity
→ Verify Sanity webhook signature
→ If _type == "product" and event == "publish":
    - Find Product by sanityId (or create if new)
    - Sync: active status
    - Do NOT overwrite: price, stock (managed in Prisma only)
```

This means:
- **Creating a new product**: publish in Sanity Studio → webhook creates the Prisma record with default price/stock (0). Admin then sets price and initial stock via the admin panel.
- **Content edits** (title, images, description): happen freely in Sanity Studio, no Prisma impact.
- **Price and stock**: only ever changed through the admin panel → NestJS API → Prisma.

### Payments

All orders are **cash on delivery or cash on pickup** — no online payment processing. Stripe is intentionally excluded from the current architecture and can be added later as an optional payment method without restructuring the order flow.

### Auth Per-Tenant

JWT tokens include `tenantId` in the payload. Users are scoped to a tenant — the same email can exist in multiple tenants as separate accounts. There is no cross-tenant login.

---

## CMS — Sanity.io

### Separate Datasets

Each tenant has its own Sanity dataset keeping content fully isolated:

| Tenant | Project ID | Dataset |
|---|---|---|
| Flower Shop | `<projectId>` | `flowers-production` |
| Fishing Shop | `<projectId>` | `fishing-production` |

### Studio Deployment

The Sanity Studio (`apps/studio`) is a static Vite app deployed per tenant with its own subdomain:
- `studio.flowershop.com` → points at `flowers-production` dataset
- `studio.fishingshop.com` → points at `fishing-production` dataset

Environment variables control which dataset the Studio connects to at build/deploy time.

### Shared Schemas

Schema definitions live in `packages/sanity` and are shared across all tenant Studio deployments. This ensures all tenants have consistent document structure.

### Product Schema Example

Sanity owns **content only** — price and stock are never stored here.

```ts
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'images', type: 'array', of: [{ type: 'image' }] }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
  ],
})
```

**Content/commerce data split:**

| Data | Where | Who edits it |
|---|---|---|
| Title, slug, description, images, category | Sanity | Sanity Studio |
| Price (current + history) | Prisma | Admin panel |
| Stock (current + history) | Prisma | Admin panel |
| Active/inactive | Prisma | Admin panel |

When a product is first published in Sanity Studio, the webhook creates a Prisma record with `price: 0, stock: 0`. The admin then sets the real price and initial stock via the admin panel before the product goes live.

### GROQ Queries with TypeGen

Sanity TypeGen generates TypeScript types automatically from GROQ queries:

```ts
import { defineQuery } from 'next-sanity'

// TypeGen picks this up and generates types automatically
const productsQuery = defineQuery(`
  *[_type == "product"] {
    _id,
    title,
    slug,
    images,
    category->{ title }
  }
`)
```

**Product data is split:** content (title, description, images) lives in Sanity. Pricing and stock live in Prisma. The `Product` model stores a `sanityId` to link them.

---

## Frontend — React Router v7

### Tenant Context

On app load, a root loader fetches tenant config from the API using the current domain. The config (theme, name, features) is stored in React context and available throughout the app.

```ts
// app/root.tsx
export async function loader({ request }) {
  const tenant = await getTenantConfig(request.headers.get('host'))
  return { tenant }
}
```

### Theming System

Tailwind uses CSS variables scoped to `data-theme` attributes. The root `<html>` element gets `data-theme` set based on the tenant config. All components use semantic color tokens — never hardcoded colors.

```css
/* packages/config/themes.css */

[data-theme="flower-shop"] {
  --color-primary: #f472b6;
  --color-primary-dark: #db2777;
  --color-accent: #86efac;
  --color-background: #fff7f9;
  --color-text: #1f2937;
}

[data-theme="fishing-shop"] {
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-accent: #78716c;
  --color-background: #f0f9ff;
  --color-text: #1f2937;
}
```

```ts
// app/root.tsx
<html data-theme={tenant.theme}>
```

### Route Structure

```
app/
├── root.tsx                        # Theme provider, tenant context
├── routes/
│   ├── _index.tsx                  # Home / product listing
│   ├── products.$slug.tsx          # Product detail
│   ├── cart.tsx                    # Cart
│   ├── checkout.tsx                # Checkout (fulfillment type, address, note)
│   ├── orders.$id.tsx              # Order confirmation + status tracking
│   ├── auth/
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── admin/
│       ├── _layout.tsx             # AdminGuard — redirects non-ADMIN users
│       ├── _index.tsx              # Dashboard (order stats, low stock alerts)
│       ├── products._index.tsx     # Product list (price, stock, active toggle)
│       ├── products.$id.tsx        # Edit price, adjust stock, view price history
│       ├── orders._index.tsx       # Order list (filter by status, fulfillment type)
│       └── orders.$id.tsx          # Order detail — update status, cancel, view items
```

Admin routes are protected by a loader-level guard that checks `user.role === ADMIN`. Non-admin users are redirected to `/`. The admin UI calls the same NestJS API as the storefront — no separate backend needed.

---

## Validation — Zod

Shared Zod schemas live in `packages/validators`. Used on both the frontend (form validation) and backend (NestJS pipes). This is a key advantage of using TypeScript across the full stack — one schema definition, zero duplication.

```ts
// packages/validators/src/product.ts
export const CreateProductSchema = z.object({
  sanityId: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
})

// packages/validators/src/auth.ts
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

---

## Data Flow — Full Request Example

> Customer visits `flowershop.com/products/red-roses`

```
1. flowershop.com
2. Cloudflare/Nginx proxy
   → sets header: X-Tenant: flowers
3. React Router v7 (web app)
   → root loader fetches tenant config from API
   → sets data-theme="flower-shop" on <html>
   → product loader calls API: GET /products/red-roses
4. NestJS API
   → TenantMiddleware reads X-Tenant: flowers
   → resolves Tenant from DB (tenantId attached to request)
   → ProductsService fetches from Prisma (filtered by tenantId)
   → fetches content from Sanity (flowers-production dataset) via GROQ
   → merges and returns product data
5. React Router renders product page with flower shop theme
```

---

## Development Setup

### Prerequisites
- Node.js 20+
- pnpm (workspace manager)
- PostgreSQL (or Docker)
- Sanity account

### Environment Variables

**apps/api/.env**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

**apps/web/.env**
```env
VITE_API_URL=http://localhost:3001
```

**apps/studio/.env (per tenant deployment)**
```env
SANITY_PROJECT_ID=...
SANITY_DATASET=flowers-production
```

Stripe keys and Sanity credentials per tenant are stored in the database (not in env files), loaded at runtime by the API.

### Sanity MCP Server (Development)

The Sanity MCP server can be connected to Claude Code during development. This enables:
- Writing GROQ queries with full schema awareness
- Creating and updating Sanity content directly from Claude Code
- Designing schemas interactively

---

## Development Phases

### Phase 1 — Foundation
- [ ] Turborepo monorepo scaffold
- [ ] `packages/db` — Prisma schema + migrations
- [ ] `packages/validators` — core Zod schemas
- [ ] `packages/config` — tsconfig, Tailwind base + themes
- [ ] `apps/api` — NestJS with tenant middleware, auth, products, orders, webhooks
- [ ] `apps/web` — React Router v7 with tenant context + theme system
- [ ] `packages/sanity` — shared schemas
- [ ] `apps/studio` — Sanity Studio setup

### Phase 2 — Flower Shop
- [ ] Flower shop Sanity dataset + seed content
- [ ] Sanity → Prisma webhook sync (`/webhooks/sanity`)
- [ ] Product catalog with Sanity content + GROQ
- [ ] Admin panel (`/admin/*`) — product price/stock management, price history
- [ ] Cart & checkout with Stripe (with stock reservation)
- [ ] Customer auth (register, login)
- [ ] Order history

### Phase 3 — Fishing Shop
- [ ] New tenant + theme
- [ ] Fishing-specific product variants (e.g. rod length, line weight)
- [ ] Second Sanity dataset + Studio deployment

### Phase 4 — Polish
- [ ] Email notifications (order confirmation)
- [ ] SEO, sitemap, OG images
- [ ] Low stock alerts in admin dashboard
- [ ] Production deployment + proxy config

---

## Key Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| Frontend framework | React Router v7 | No Vercel lock-in, clean self-hosting, no Next.js CVEs |
| CMS | Sanity.io | Official MCP server, separate datasets, GROQ TypeGen |
| CMS query language | GROQ | Mutations + subscriptions — GraphQL lacks both in Sanity |
| Backend | NestJS | Full TypeScript stack enables shared Zod types across apps |
| Monorepo tool | Turborepo + pnpm | Fast (Rust), minimal config, free remote caching |
| Studio deployment | Monorepo + own domain | Custom branding, full control |
| Domain routing | Separate domains + proxy | Clean branding per tenant |
| Auth | Isolated per tenant | No cross-tenant account leakage |
| Payments | Separate Stripe accounts | Separate payouts, accounting per tenant |
| Tenant resolution | HTTP header from proxy | Works for any domain setup, clean separation |
| Product data | Split Sanity + Prisma | Content in CMS, commerce data (price, stock, history) in DB |
| Price/stock management | Admin panel (not Sanity Studio) | Needs audit history, atomic transactions, role-based access |
| Admin UI | Routes in web app (`/admin/*`) | No extra deployment, shares components and API |
| Price history | Append-only `PriceHistory` table | Required for order auditing and analytics |
| Payments | Cash on delivery/pickup | No online payment needed — Stripe can be added later without restructuring |
| Fulfillment | PICKUP or DELIVERY enum on Order | Customer chooses at checkout; different status flow per type |
| Stock decrement | On order placement (not payment) | No payment confirmation event to wait for |
| Max tenants planned | ~10 | Sanity free tier supports multiple projects at this scale |
