# Repository Guidelines

This is a **UI/UX redesign project** for Hapuppy — a front-end only Next.js application with mock data and stubbed backend. No real credentials, API keys, or user data exist in this repository.

## Project Structure & Module Organization

```
app/
  [locale]/              # Internationalized routes (en, zh)
    page.tsx             # Landing page
    dashboard/           # Dashboard pages (overview, keys, models, vault, etc.)
    models/              # Model listing and details
  api/                   # Mock API routes returning fake data
  globals.css            # Global styles
components/
  landing/               # Landing page components
  dashboard/             # Dashboard-specific components
  ui/                    # Shared UI primitives
  billing/               # Billing and pricing components
  icons/                 # Custom icon components
lib/
  mock-data.ts           # Fake data for all pages
  constants.ts           # App constants (prices are $0 placeholders)
  supabase/client.ts     # Stub Supabase client (localStorage-based fake auth)
messages/
  en.json, zh.json       # i18n translations
```

## Build, Test, and Development Commands

```bash
pnpm install           # Install dependencies
pnpm dev               # Start dev server at localhost:3000
pnpm dev:sit           # Start with APP_ENV=sit
pnpm build             # Production build
pnpm build:sit         # Production build with APP_ENV=sit
pnpm lint              # Run ESLint
pnpm test              # Run Vitest tests (single run)
pnpm test:watch        # Run Vitest in watch mode
```

## Coding Style & Naming Conventions

- **TypeScript**: Strict mode enabled (`strict: true`)
- **Indentation**: 2 spaces (inferred from existing files)
- **Imports**: Use `@/*` path alias for root-level imports
- **Components**: PascalCase file names matching component name (e.g., `ApiKeyDisplay.tsx`)
- **Styling**: Tailwind CSS v4 with utility classes; dark theme baseline (`bg-[#09090b]`)
- **Icons**: Lucide React
- **Linting**: ESLint with Next.js config (`eslint-config-next`)

## Testing Guidelines

- **Framework**: Vitest with React plugin (`@vitejs/plugin-react`)
- **Running tests**: `pnpm test` for single run, `pnpm test:watch` for watch mode
- No existing test files found — add tests as `*.test.ts` or `*.spec.ts` in relevant directories

## Commit & Pull Request Guidelines

- **Commit format**: `feat: <description>` (based on existing history)
- Keep commits focused and atomic
- For PRs: provide clear descriptions of UI changes, include screenshots for visual updates
- Since this is a redesign project, document design decisions and component restructuring

## Architecture Overview

- **Auth**: Fake authentication via localStorage (`lib/supabase/client.ts`) — any email/password works
- **Data**: All data comes from `lib/mock-data.ts` — modify to test different UI states
- **i18n**: Next-intl for internationalization; edit `messages/*.json` for copy changes
- **Routing**: App Router with locale prefix (`[locale]`)

## Redesign Focus Areas

The current UI uses a grey/cursor-style theme. Priority areas for visual refresh:

1. Landing page (`app/[locale]/page.tsx`, `components/landing/*`)
2. Dashboard overview (`app/[locale]/dashboard/page.tsx`, `components/dashboard/*`)
3. Pricing, billing, vault, redeem, and referral pages
4. Shared UI primitives (`components/ui/*`)

Feel free to restructure components and change the design system. Keep mock data shapes compatible for future backend integration.
