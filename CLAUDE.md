# AerisClaim — Claude Working Context

## What this repo is
AerisClaim is an operator-first, end-to-end freight claims recovery operating system. It ingests
shipment data and documents, identifies claimable events, assembles evidence packets, supports
filing, tracks claim state through to settlement, and produces recovery reporting.

It is not generic claims software. It is a revenue recovery engine and system of record.

---

## Current repo state (as of 2026-04-21)

| Layer | Status |
|---|---|
| Marketing site | **Complete** — 12 components in `src/components/marketing/` |
| App shell / layout | Not started |
| Supabase project | Not started — no migrations exist |
| Auth (Supabase Auth) | Not started |
| App routes | Not started |
| AI integration (Claude API) | Not started |
| Background jobs (Inngest) | Not started |

The immediate next build phase is: app shell → auth → database schema → core app routes.

---

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2.4 (App Router) | Already installed |
| Language | TypeScript | Already configured |
| Styling | Tailwind CSS v4 | `@import "tailwindcss"` syntax, no config file |
| Fonts | Geist Sans + Geist Mono via `next/font/google` | Already wired in layout.tsx |
| Auth + DB + Storage | Supabase | Not yet installed — add `@supabase/supabase-js` and `@supabase/ssr` |
| Background jobs | Inngest | Not yet installed — add `inngest` |
| AI | Claude API via `@anthropic-ai/sdk` | Not yet installed |
| Deployment | Vercel | |
| Observability | Sentry + PostHog | Not yet installed |

---

## Design system

### Color tokens (defined in `src/app/globals.css` via `@theme inline`)
```
Base background:    #09090B
Surface (raised):   #111115
Elevated surface:   #0E0E12
Subtle surface:     #0B0B0F
Primary border:     #27272F
Subtle border:      #1E1E26
Accent (crimson):   #C01028
Accent hover:       #A00C22
```

### Typography
- Body: Geist Sans (variable weights 300–800)
- Mono / labels: Geist Mono
- Eyebrow labels: `text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-500`
- Section headings: `text-[36px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.08] tracking-[-0.025em] text-white`

### Component patterns
- Buttons: `rounded-sm` everywhere (not `rounded`)
- Borders: `border border-[#27272F]` for panels; `border-b border-[#1E1E26]` for subtle row dividers
- Gap-px grid dividers: `grid gap-px bg-[#27272F]` with cells on `bg-[#09090B]`
- Clean bordered grid: `border-l border-t border-[#27272F]` on container + `border-r border-b border-[#27272F]` per cell
- Focus ring: `:focus-visible { outline: 2px solid rgb(192 16 40 / 0.65); outline-offset: 2px; }`
- Accent (crimson) used ONLY on: hero eyebrow/indicator, Problem eyebrow, primary CTA buttons, MidCTA accent bar, FinalCTA eyebrow

---

## File structure conventions

```
src/
  app/
    globals.css              # Design tokens, base styles, animations
    layout.tsx               # Root layout — fonts, metadata, skip link
    page.tsx                 # Marketing homepage
    (marketing)/             # Public marketing sub-routes (future)
    (app)/                   # Authenticated app shell
      layout.tsx             # App layout — sidebar, topbar, tenant context
      dashboard/page.tsx
      shipments/
        page.tsx             # Shipments list
        [id]/page.tsx        # Shipment detail
      documents/page.tsx     # Documents inbox
      candidates/page.tsx    # Claim candidate queue
      claims/
        page.tsx             # Claims list
        [id]/page.tsx        # Claim workspace
        [id]/draft/page.tsx  # Draft review
      appeals/[id]/page.tsx
      reporting/page.tsx
      settings/
        page.tsx
        carriers/page.tsx
    auth/
      login/page.tsx
      callback/page.tsx      # Supabase OAuth callback
  components/
    marketing/               # 12 marketing section components (complete)
    app/                     # App shell components (to build)
      layout/
        Sidebar.tsx
        Topbar.tsx
        TenantSwitcher.tsx
      ui/                    # Shared primitives
        Badge.tsx
        Button.tsx
        Table.tsx
        Panel.tsx
        StatusPill.tsx
        DeadlineBadge.tsx
    claims/                  # Claim-specific components
    shipments/               # Shipment-specific components
  lib/
    supabase/
      client.ts              # Browser client
      server.ts              # Server client (RSC / Route Handlers)
      middleware.ts          # Session refresh
    types/
      database.types.ts      # Generated from Supabase CLI
      app.types.ts           # Derived/composed types for the app
    utils/
      currency.ts
      dates.ts
      status.ts
  middleware.ts              # Next.js middleware — auth protection
supabase/
  migrations/                # SQL migration files
  seed.sql                   # Dev seed data
```

---

## Dev commands

```bash
npm run dev        # Start dev server at localhost:3000
npm run build      # Production build (verify before committing)
npm run lint       # ESLint
npx supabase start # Start local Supabase (once project is initialized)
npx supabase db push          # Apply migrations to local
npx supabase gen types typescript --local > src/lib/types/database.types.ts
```

---

## Core principles

1. **Multi-tenant from day one.** Every DB row must carry `tenant_id`. RLS policies enforce isolation.
2. **Preserve raw inputs.** Store files as-is in Supabase Storage. Store extracted data separately alongside raw OCR output.
3. **Explicit state transitions.** Every status change is a logged event in `claim_events`. No implicit status drift.
4. **Human in the loop.** No AI output goes to a carrier without operator review. The system prepares; the human approves.
5. **Operator throughput.** Every screen must show the most important action first. Don't make operators hunt.
6. **Auditability.** The audit trail must be complete enough for a compliance review or customer dispute.

---

## Non-negotiables

- RLS enabled on every table — no exceptions
- Raw uploaded files preserved permanently in Storage
- Every AI-generated artifact (draft, extraction) stores its model name, prompt version, and input doc references
- No claim transitions to `submitted` without a human-created `submission` record
- `claim_events` written on every status change, note add, and document add
- All monetary values stored as integer cents

---

## Coding conventions

- Server Components by default. Add `"use client"` only when state, effects, or browser APIs are needed.
- Route Handlers for all API calls (not the pages router API).
- Use Supabase SSR client in Server Components; browser client in Client Components.
- TypeScript strict mode. No `any`. Use generated database types from `database.types.ts`.
- Keep components focused. If a component exceeds ~200 lines, split it.
- No comments explaining what code does. Only comment non-obvious WHY.

---

## What success looks like

**For the customer:**
- Upload shipment data and documents → AerisClaim surfaces what to file
- Review and approve packets without rebuilding evidence from scratch
- See exactly what was filed, what is pending, what was recovered

**For the product:**
- Every claim stores structured evidence, edits, and outcome
- Recovery reports are trustworthy enough for CFO-level review
- The system gets smarter as more claims are processed
