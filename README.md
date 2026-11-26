# NextStore — Production Headless Shopify eCommerce

A modern, high-performance, and secure Headless eCommerce storefront built with **Next.js 16**, **Shopify Storefront GraphQL API (2026-10)**, **Tailwind CSS v4**, and **TypeScript**.

---

## 🚀 Key Highlights & Architecture

- **Next.js 16 App Router & Cache Components**: Next.js 16 Partial Prerendering (`partialPrefetching`), modern Server Components, streaming with React Suspense, and full TypeScript safety.
- **Shopify Storefront API (`2026-10`)**: Secure, server-side data fetching with retry logic for 502/503/504 gateway responses. Zero credential leakage to browser bundles.
- **Cart & Checkout Architecture**:
  - Persistent shopping cart backed by Shopify's Cart API (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`).
  - Stored via secure HTTP-only cookies (`shopify_cart_id`).
  - Seamless redirection to authentic, Level 1 PCI-DSS compliant Shopify-hosted Checkout.
- **Live Search & Dynamic Filters**:
  - Debounced search modal with live product previews from the Shopify catalog.
  - Sorting (Best Selling, Newest, Price Low-to-High, Price High-to-Low, Alphabetical).
  - Cursor-based pagination.
- **Editorial UX & Accessibility**:
  - Clean, minimal, high-end aesthetics (Primary `#111111`, secondary `#F7F7F5`, Geist font).
  - Multi-image gallery with thumbnail selection and zoom.
  - Dynamic variant resolution (size, color) with availability enforcement.
  - Fully responsive across mobile, tablet, and desktop viewports.
  - JSON-LD structured data and dynamic OpenGraph SEO metadata.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.4.6](https://nextjs.org/) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Commerce**: [Shopify Storefront GraphQL API](https://shopify.dev/docs/api/storefront)

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory (see `.env.example`):

```bash
# Shopify Storefront API Configuration
# Obtained from Shopify Admin -> Sales Channels -> Headless
SHOPIFY_STORE_DOMAIN="next-e-commerce-gsdnngiz.myshopify.com"
SHOPIFY_STOREFRONT_PRIVATE_TOKEN="shpat_xxxxxxxxxxxxxxxxxxxxxxxx"
SHOPIFY_API_VERSION="2026-10"

# Base Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> **Security Note**: Never expose `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` with a `NEXT_PUBLIC_` prefix. All queries and mutations are executed strictly server-side inside `src/lib/shopify/` and Next.js Server Actions.

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

### 3. Verify Code Quality & Type Safety
```bash
npm run lint
```

### 4. Run Production Build
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
├── src/
│   ├── actions/                  # Server Actions for cart & forms
│   │   ├── cart.ts               # Cookie-backed Shopify cart operations
│   │   └── contact.ts            # Server-side contact validation
│   ├── app/                      # Next.js App Router routes
│   │   ├── (informational)/      # About, Contact, FAQ, Policies
│   │   ├── api/search/           # Live search route handler
│   │   ├── cart/                 # Dedicated /cart page
│   │   ├── collections/[handle]/ # Dynamic collection pages
│   │   ├── products/             # Product catalog with filters & sorting
│   │   ├── products/[handle]/    # Dynamic product detail pages
│   │   ├── search/               # Dedicated search results page
│   │   ├── layout.tsx            # Global layout with providers
│   │   ├── page.tsx              # Conversion-focused homepage
│   │   ├── robots.ts             # Search engine crawler instructions
│   │   └── sitemap.ts            # Dynamic XML sitemap generator
│   ├── components/
│   │   ├── cart/                 # CartDrawer, CartItemRow, CartView
│   │   ├── home/                 # HeroBanner, CategoryGrid, EditorialBanner
│   │   ├── layout/               # Header, AnnouncementBar, MobileNav, Footer
│   │   ├── product/              # ProductCard, ProductGrid, ProductGallery, ProductInfo
│   │   └── search/               # SearchModal with debounced live preview
│   ├── context/
│   │   └── cart-context.tsx      # Global cart state provider & drawer controls
│   └── lib/
│       ├── shopify/              # Modular Shopify integration
│       │   ├── client.ts         # Server-only GraphQL client with retry logic
│       │   ├── types.ts          # Complete TypeScript API types
│       │   ├── products.ts       # Product queries & pagination
│       │   ├── collections.ts    # Collection queries
│       │   ├── cart.ts           # Cart mutations & queries
│       │   └── queries/          # GraphQL fragments & queries
│       └── utils.ts              # Price formatting, discounts, class merging
└── next.config.ts                # Next.js 16 Cache Components & image domains
```

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Add the environment variables:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`
   - `SHOPIFY_API_VERSION` (`2026-10`)
   - `NEXT_PUBLIC_SITE_URL` (your custom production domain)
4. Deploy! Vercel automatically runs `next build` with Turbopack and serves static assets and cached routes at the edge.
