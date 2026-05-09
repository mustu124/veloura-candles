# Maison Velora

A Vercel-ready luxury candle e-commerce website built with Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, Prisma, PostgreSQL, and Resend/Nodemailer.

## Features

- Cinematic luxury storefront with motion, parallax, cursor-like glow styling, and responsive mobile-first UI.
- 50 generated luxury fragrance products with filtering, sorting, search, wishlist persistence, quick preview, cart drawer, and product detail pages.
- Custom order inquiry flow: no automatic payment or order confirmation. Requests are stored in PostgreSQL and sent to the owner by email.
- Secure admin login with order dashboard, contacted status updates, analytics, product inventory view, and product creation API.
- Prisma schema and seed script for Neon or Supabase PostgreSQL.
- Production-safe environment variables and Vercel serverless API routes.

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Vercel Deployment

1. Create a PostgreSQL database on Neon or Supabase.
2. Add all variables from `.env.example` in Vercel Project Settings.
3. Set `DATABASE_URL` to the pooled production connection string with SSL enabled.
4. Set `RESEND_API_KEY`, `OWNER_EMAIL`, and `EMAIL_FROM` for inquiry emails. SMTP variables can be used instead.
5. Deploy on Vercel. The build command is `npm run build`.
6. After first deploy, run `npm run db:push && npm run db:seed` locally against the production database or run those commands in your Vercel build pipeline if preferred.

## Order Flow

When a customer submits the inquiry bag:

1. `/api/orders` validates the request.
2. The order and line items are saved in PostgreSQL.
3. The owner receives a styled HTML email with customer, address, phone, products, total, and timestamp.
4. The customer sees: “Thank you for your request. Our team will contact you shortly to confirm your order.”

No payment is captured and no order is auto-confirmed.

## Admin

Visit `/admin` and sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Use a strong `AUTH_SECRET` in production.

For full image uploads, connect the product creation flow to Vercel Blob, S3, or Cloudinary. The API and database structure are already designed for hosted image URLs.
