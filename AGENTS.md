# AerisClaim — AGENTS.md

## Project identity
AerisClaim is a freight claims recovery operating system for shippers, distributors, and brokers.
It ingests shipment and claims documents, identifies claimable freight issues, drafts packets,
supports filing, tracks outcomes, and generates recovery reporting.

It is operator-first, not chatbot-first. The AI is invisible infrastructure, not a UI element.

---

## Canonical docs — read these first

| File | Purpose |
|---|---|
| `CLAUDE.md` | Repo state, stack, design tokens, file structure, coding conventions |
| `PRODUCT.md` | 30-day MVP scope, screen specs, functional requirements |
| `DATA_MODEL.md` | Full schema with RLS policies, enums, storage structure |
| `WORKFLOWS.md` | End-to-end workflows mapped to routes, components, and DB operations |

If code or UI appears to conflict with these files, stop and reconcile before continuing.

`AERISCLAIM_MASTER_ROADMAP.md` is a strategic overview — reference it for phase context,
but treat the four docs above as authoritative for implementation decisions.

---

## Project memory

Use `docs/project_notes/` to record non-obvious decisions. Create or update a note whenever
a meaningful architectural, UX, schema, or workflow decision is made.

| File | Use for |
|---|---|
| `decisions.md` | Architecture, schema, UX, workflow decisions and their rationale |
| `bugs.md` | Known bugs, regressions, and their status |
| `issues.md` | Blockers, open questions, things to revisit |
| `key_facts.md` | Carrier-specific filing rules, domain facts, constraints |

Entry format for `decisions.md`:
```
## [date] — [area]
**Decision:** [what was decided]
**Why:** [rationale]
**Impact:** [what this affects]
```

---

## Custom skills — when to invoke them

| Skill | Invoke when working on |
|---|---|
| `app-design-review` | Any app UI — dashboard, tables, panels, claim workspace, timeline |
| `claim-packet-drafting` | Claim workspace, draft generation, evidence panels, appeal flows |
| `shipment-doc-extraction` | Upload flow, document inbox, OCR integration, extraction review |
| `deadline-and-status` | Claim status transitions, deadline badges, escalation logic, event timeline |

To invoke a skill: `/[skill-name]` in the prompt.

---

## How to approach a new coding task

1. **Read the canonical docs** for the area being built. Don't assume from memory.
2. **Restate the goal** and identify which table(s), route(s), and component(s) are involved.
3. **Check the data model** — use the correct column names, enum values, and relationships from `DATA_MODEL.md`.
4. **Check the workflow** — understand what DB writes happen in what order and what events must be logged.
5. **Invoke the relevant skill** if one applies.
6. **Build in small verifiable steps** — scaffolding → data → UI → edge cases.
7. **Summarize** what changed, what still needs work, and any decisions made.

---

## UX rules

- This is a B2B operator tool, not a consumer app and not a chatbot.
- The AI should feel invisible and operational — a fast, accurate assistant behind the scenes.
- Prioritize operator speed, clarity, trust, and auditability over delight or novelty.
- Show evidence and decisions clearly. Don't hide AI provenance.
- Prefer dense, readable enterprise layouts over oversized cards and empty space.
- Every screen must show the most important action first. Make the next step obvious.
- Status pills and deadline badges must be prominent and consistent.

---

## Design rules

- Follow the design system defined in `CLAUDE.md`. Do not introduce new color values.
- `rounded-sm` on all buttons and badges. Never `rounded` or `rounded-lg`.
- Crimson `#C01028` used ONLY on primary CTAs, the hero eyebrow, and deliberate accent moments. Not on status indicators.
- Status colors: use `emerald` for good/paid, `amber` for at-risk/pending, `red` only for overdue/denied, `zinc` for neutral.
- Tables: left-aligned text, right-aligned numbers, `border-b border-[#1E1E26]` row dividers.
- Panels: `border border-[#27272F] bg-[#111115]` as the standard.
- Motion: subtle only. `transition-colors duration-150` on hover states. No transforms on data tables.
- No gradients, glassmorphism, decorative blobs, generic icon grids, or chatbot UI patterns.
- For app UI, use `app-design-review` skill before finalizing any screen.

---

## Engineering rules

### Multi-tenancy
- Every insert must include `tenant_id`.
- Never write a query without a `tenant_id` filter — even if RLS would catch it, be explicit.
- Resolve `tenant_id` from the session server-side. Never trust client-provided tenant_id.

### Supabase patterns
```typescript
// Server Component — use createServerClient from @supabase/ssr
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Route Handler / Server Action — same pattern
// Client Component — use createBrowserClient from @supabase/ssr
```

- Always use the generated `Database` type from `src/lib/types/database.types.ts`.
- Use `.select()` with explicit column lists — never `select('*')` on large tables.
- Use `.throwOnError()` on writes to surface errors clearly.

### API routes
- All data mutations go through Route Handlers (`src/app/api/`), not inline server actions, except for simple single-field updates.
- Validate inputs with Zod before writing to DB.
- Return consistent response shape: `{ data, error }`.
- Never expose Supabase service role key — use it only in trusted server contexts (Inngest jobs, admin routes).

### Audit log
- Every claim status change must write to `claim_events`. Use a helper function:
  ```typescript
  await logClaimEvent(supabase, { claimId, tenantId, eventType, actorType, actorId, metadata })
  ```
- This is not optional. Missing events are a compliance failure.

### AI integration
- All Claude API calls from server-side only.
- Store `model_name`, `prompt_version`, and `source_doc_ids` with every output.
- Never stream AI output directly to the client in MVP — generate, save, then serve.
- Prompt templates live in `src/lib/prompts/` as versioned TypeScript constants.

### Monetary values
- All amounts stored as integer cents in the DB.
- Format for display: `(cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })`.
- Never do floating-point math on monetary values.

### Dates
- All timestamps stored as UTC in the DB.
- Display in user's local timezone using `Intl.DateTimeFormat` or a thin wrapper.
- Filing deadlines displayed as "N days remaining" relative to `now()`, not as a raw date.

---

## File naming conventions

| Type | Convention | Example |
|---|---|---|
| Page | `page.tsx` | `src/app/(app)/claims/[id]/page.tsx` |
| Layout | `layout.tsx` | `src/app/(app)/layout.tsx` |
| Route Handler | `route.ts` | `src/app/api/claims/[id]/route.ts` |
| UI component | PascalCase | `ClaimStatusPill.tsx` |
| Utility | camelCase | `formatCurrency.ts` |
| DB type | generated | `database.types.ts` |
| Prompt template | camelCase | `claimDraftPrompt.ts` |

---

## Current repo state (as of 2026-04-21)

```
✅ Marketing site — complete (src/components/marketing/)
⬜ App shell / layout — not started
⬜ Auth (Supabase) — not started
⬜ Database schema / migrations — not started
⬜ Shipments list + detail — not started
⬜ Documents inbox + upload — not started
⬜ Claim candidates queue — not started
⬜ Claim workspace — not started
⬜ Draft generation (Claude API) — not started
⬜ Reporting — not started
```

**Next task:** Install Supabase dependencies → create local project → write first migration.

---

## Recommended build order (next 10 tasks)

1. Install deps: `@supabase/supabase-js`, `@supabase/ssr`, `inngest`, `@anthropic-ai/sdk`, `zod`
2. Initialize Supabase project locally; configure `.env.local`
3. Write and apply migrations: Week 1 tables (`tenants`, `users`, `carriers`, `shipments`, `shipment_events`, `documents`, `document_extractions`)
4. Write `src/middleware.ts` — session refresh + auth protection for `/app/*`
5. Build app shell: `(app)/layout.tsx` with `Sidebar.tsx` and `Topbar.tsx`
6. Build auth pages: `/auth/login` and `/auth/callback`
7. Build shipments list + CSV import modal
8. Build shipment detail page
9. Build document upload + inbox
10. Write Week 2 migrations + scaffold claim candidates queue

---

## Delivery checklist (before marking any feature done)

- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] RLS policy written and tested for every new table
- [ ] `tenant_id` present on every insert
- [ ] `claim_events` written for every claim status change
- [ ] Monetary values stored as cents, displayed as formatted dollars
- [ ] No secrets in client-side code
- [ ] `docs/project_notes/decisions.md` updated if a meaningful decision was made
