# Hapuppy UI

Front-end only copy of the Hapuppy dashboard, intended for **UI/UX redesign work**. All backend logic is replaced with local stubs and fake data — there is no real user data, no real credentials, no real network calls.

## What's in here

- Next.js 15 + React 19 + Tailwind v4
- All pages: landing, pricing, credits, models, status, privacy, terms, login/register/forgot/reset, dashboard (overview, keys, models, vault, redeem, referral, billing, settings)
- Mock API routes under `app/api/` returning fake data
- Stub Supabase client (`lib/supabase/client.ts`) — persists a fake "signed-in" flag in localStorage so the dashboard is accessible after clicking login
- Stub data lives in `lib/mock-data.ts` — tweak to see different UI states

## What's **not** in here

- Real API keys, secrets, or environment configuration
- Real pricing (all prices are `$0` placeholders in `lib/constants.ts`)
- Auth is faked — any email/password combination "works"

## Getting started

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>. Use any email/password to "log in" — the fake session is stored in localStorage (clear it to sign out).

## Tasks

The current UI is grey/cursor-style. The goal is a visual refresh. Focus on:

- Landing page (`app/[locale]/page.tsx`, `components/landing/*`)
- Dashboard overview (`app/[locale]/dashboard/page.tsx`, `components/dashboard/*`)
- Pricing / billing / vault / redeem / referral pages
- Shared primitives in `components/ui/*`

Feel free to restructure components, add new ones, change the design system. Keep the shape of mock data (`lib/mock-data.ts`) compatible so real backend can be wired in later.

## Commands

```bash
pnpm dev          # localhost:3000
pnpm build        # production build
pnpm lint         # eslint
```

## Notes for the redesign

- Dark theme (`bg-[#09090b]`) is the current baseline — feel free to change
- Primary font and icon set: Lucide React
- Toast notifications use `sonner`
- i18n: edit `messages/en.json` / `messages/zh.json` for copy
