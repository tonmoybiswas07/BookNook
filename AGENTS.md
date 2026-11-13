<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook

Next.js 16 (App Router) frontend for a library / book-borrowing app. Single package, npm (`package-lock.json` — not pnpm/yarn).

## Commands

- `npm run dev` — dev server (Turbopack); auto-loads `.env`.
- `npm run lint` — ESLint flat config (`eslint.config.mjs`), whole project. It may report pre-existing errors (unescaped entities, `react-hooks/set-state-in-effect`) in files you didn't touch; don't assume you caused them.
- `npx tsc --noEmit` — typecheck (no npm script for it).
- `npm run build` — see "Build status" below before trusting the result.
- **No test suite and no CI exist** — don't waste time searching for one.

## Build status (re-verify; may change)

`next build` currently fails during static prerender, independent of your changes:

- `/` fails on an unstable `new Date()` inside a client component — it comes from Swiper (autoplay in `node_modules/swiper/shared/swiper-core.mjs`), used by the home page's Banner/NewArrivals.
- Pages that fetch `http://localhost:8000/...` log prerender fetch errors unless the backend is running (below).

## Backend dependency (required for real data)

Book/borrow data comes from a **separate repo**: `../booknook-server` (Express + MongoDB, port 8000).

- Start it: `cd ../booknook-server && npm run dev` (it needs its own `.env` with `MONGODB_URI`).
- The frontend hardcodes `http://localhost:8000` in ~6 files — `API_URL` consts in `app/my-books/`, `app/myBorrow/`, `app/allBooks/[id]/BookDetailsClient.tsx`; bare literals in `app/allBooks/page.tsx`, `app/add-books/page.tsx`, `app/Components/Home/newArrivals/newArrivals.tsx`.
- Without it, pages render empty states: fetch errors are caught and `[]` is returned, so the failure is silent.

## Next.js 16 specifics

- `cacheComponents: true` + `partialPrefetching: true` in `next.config.ts` change prerender/caching rules vs. older Next. Data fetches use `cache: "no-store"`.
- `export const instant = false` in `app/allBooks/` pages is a **real Next 16 route-segment config** (instant-navigation validation), not a typo — don't remove it.
- Tailwind 4 is wired via a Turbopack loader rule in `next.config.ts` (`@tailwindcss/turbopack`). There is intentionally no `postcss.config`/`tailwind.config` — styling is CSS-first (`@import "tailwindcss"` in `app/globals.css`). Don't add one.
- `experimental.agentFeedback: true` makes `next dev` write a second managed block into this file. Commit `AGENTS.md` with your work to keep the tree clean.

## Auth

better-auth + MongoDB adapter, email/password + Google OAuth:

- Server: `app/lib/auth.tsx`; client: `app/lib/auth-client.ts`; handler: `app/api/auth/[...all]/route.ts`.
- `.env` (gitignored, already present locally) must define: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Never commit it.

## Conventions

- Path alias `@/*` → repo root (e.g. `@/app/lib/auth`).
- Pages that need interactivity are `"use client"` components; data fetching happens directly in page components — there is no app-level API layer besides better-auth.
- User feedback via `react-toastify`: `ToastContainer` is already mounted in `app/layout.tsx` — just call `toast.*`.
- `next.config.ts` allows **any** https hostname in `images.remotePatterns`.
