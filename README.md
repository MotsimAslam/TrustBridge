# TrustBridge

TrustBridge is a Next.js 15 SaaS foundation for a multi-role charity verification platform.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component system
- PostgreSQL + Prisma
- Clerk
- Zod
- next-intl
- Sentry

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in PostgreSQL and Clerk credentials.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Apply the migration with your PostgreSQL database.
6. Run `npm run db:seed`.
7. Run `npm run dev`.

## Vercel deployment

Set the same environment variables in Vercel that you use locally, especially:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`
- `STORAGE_PROVIDER`
- `STORAGE_REGION`
- `STORAGE_BUCKET`
- `STORAGE_ENDPOINT`
- `STORAGE_ACCESS_KEY_ID`
- `STORAGE_SECRET_ACCESS_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`

## Included foundation

- Public landing page and campaign discovery shell
- Auth routes and Clerk integration points
- Role-aware donor, beneficiary, and admin dashboards
- Prisma schema, seed script, and initial migration
- Theme, locale, audit log, notification, and storage foundations
