# E-Commerce — Full-Stack Storefront (Next.js + Prisma)

A complete full-stack e-commerce app: public storefront with search / filters / cart / checkout, JWT auth, customer account, and a full admin dashboard (products, categories, orders, customers, settings).

Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, **Prisma 7**, **PostgreSQL**, **JWT + bcrypt**, **Stripe-ready orders**, **Zod**, **Lucide icons**.

## Features

### Storefront
- Homepage with hero slider, category pills, price filters, sorting, pagination
- Product listing + product detail page with variants and reviews
- Cart page, checkout flow, orders history
- Multi-currency display, dynamic site settings (title, logo, banners, footer)
- Static content pages: about, contact, FAQ, shipping, payments, privacy, terms, cancellation & returns

### Auth & Account
- Register / login / logout / refresh / me (`/api/v1/auth/*`)
- JWT access + refresh tokens in httpOnly cookies
- Customer account page + addresses CRUD (`/api/v1/addresses`)

### Admin (`/admin`)
- Dashboard overview
- Products CRUD + variants (`/api/v1/admin/products`)
- Categories CRUD (`/api/v1/admin/categories`, public read at `/api/v1/categories`)
- Orders management (`/api/v1/admin/orders`)
- Customers management (`/api/v1/admin/customers`)
- Site settings editor + image upload (`/api/v1/admin/settings`, `/api/v1/settings`, `/api/v1/upload`)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router, React 19 |
| Styling | Tailwind CSS 4, PostCSS |
| DB / ORM | PostgreSQL + Prisma 7 (`prisma/schema.prisma`, client in `generated/prisma`) |
| Auth | bcryptjs + jsonwebtoken (access / refresh) |
| Validation | Zod |
| Payments | Stripe package + `stripePaymentIntentId` on orders (intent metadata stored as JSON) |
| Email | Resend (dependency ready) |
| Icons | lucide-react |
| Language | TypeScript |

## Project Structure

```
src/
  app/
    page.tsx                 # storefront home + catalog
    products/[slug]/page.tsx # product detail
    cart/ checkout/ orders/  # buying flow
    login/ register/ account/
    admin/                   # layout, dashboard, products, categories, orders, customers, settings
    api/v1/
      auth/ products/ categories/ orders/ addresses/ settings/ upload/
      admin/products/ admin/categories/ admin/orders/ admin/customers/ admin/settings/
  components/  # Header, Footer, HeroSlider, ProductCard, ProductInteractiveDetails, ContactForm, FAQAccordion
  context/AuthContext.tsx
  lib/  # prisma.ts, auth.ts, settings.ts, currency.ts, currencies.ts
  middleware.ts
prisma/
  schema.prisma  # User, Address, Category, Product, ProductVariant, Cart, CartItem, Order, OrderItem, Review, Settings...
  seed.ts        # 20 products, 3 categories, admin + customer, reviews, default settings
generated/prisma # Prisma client output (committed)
public/          # icons, banner, uploads/
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Neon / Supabase)

### 1. Install
```bash
npm install
```

### 2. Env
Create `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecomm?schema=public"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
```

> Only `DATABASE_URL` is required to boot. JWT secrets fall back to dev defaults — set them in production.

### 3. Database
```bash
npx prisma migrate dev
npm run build   # or: npx prisma generate
npx prisma db seed
```

Seeded accounts:
| Role | Email | Password |
|---|---|---|
| Admin | `admin@ecommerce.com` | `admin123` |
| Customer | `customer@ecommerce.com` | `customer123` |

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000 — admin at http://localhost:3000/admin

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## API Overview

```
POST /api/v1/auth/register, /login, /logout, /refresh, GET /me
GET /api/v1/products, GET /api/v1/products/[slug]
GET /api/v1/categories
GET/POST /api/v1/orders
GET/POST /api/v1/addresses, PATCH/DELETE /api/v1/addresses/[id]
GET /api/v1/settings
POST /api/v1/upload
GET/POST/PATCH/DELETE /api/v1/admin/products...
GET/POST/PATCH/DELETE /api/v1/admin/categories...
GET /api/v1/admin/orders, GET/PATCH /api/v1/admin/customers...
GET/PUT /api/v1/admin/settings
```

Admin routes require `role = ADMIN` (enforced via middleware + JWT).

## Data Model (Prisma)

`User` → `Address[]`, `Cart[]`, `Order[]`, `Review[]` · `Category` (self-nested) → `Product[]` → `ProductVariant[]` · `Cart` → `CartItem[]` · `Order` → `OrderItem[]` (price/name snapshots keep history) · `Setting` (key/value store for CMS-like config).

## Deployment

1. Set `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` on your host (Vercel, etc.)
2. Run migrations against prod DB: `npx prisma migrate deploy`
3. Seed once if needed: `npx prisma db seed`
4. `npm run build && npm run start`

## License

Private project — all rights reserved.
