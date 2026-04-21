# AerisClaim — Core Workflows

Each workflow maps to specific routes, components, DB operations, and background jobs.
Where AI or automation is involved, the human review step is called out explicitly.

---

## Workflow 0: Tenant and user setup (internal, not self-serve)

**Who:** Founder / operator (internal)

**Steps:**
1. Create `tenants` record manually (Supabase Studio or seed script).
2. Create `users` record linking to `auth.users` entry — set `role`.
3. Seed global `carriers` table if not already populated.
4. Optionally configure `carrier_profiles` for the tenant's top carriers.

**No UI required in MVP.** Done via SQL or Supabase Studio during onboarding.

**DB writes:** `tenants`, `users`, `carrier_profiles` (optional)

---

## Workflow 1: Auth — login and session

**Route:** `/auth/login` → `/auth/callback` → `/app/dashboard`

**Steps:**
1. User visits `/auth/login`.
2. Enters email → Supabase sends magic link (or email + password login).
3. User clicks link → Supabase calls `/auth/callback` with session tokens.
4. `@supabase/ssr` exchanges code for session, writes cookie.
5. `middleware.ts` reads cookie, verifies session on every `/app/*` request.
6. Middleware resolves `tenant_id` from `users` table, stores in request headers.
7. Redirect to `/app/dashboard`.

**Edge cases:**
- Expired magic link → redirect to `/auth/login` with error param
- User not in `users` table (no tenant) → redirect to `/auth/login` with "Account not found" message
- Session expired mid-session → middleware catches 401, redirects to login

**Components:** `src/app/auth/login/page.tsx`, `src/app/auth/callback/page.tsx`, `src/middleware.ts`

---

## Workflow 2: Shipment import via CSV

**Route:** `/app/shipments` → upload modal

**Steps:**
1. Operator clicks "Import CSV" on the shipments list.
2. File picker or drag-drop — uploads CSV to browser memory (no server storage).
3. System reads CSV headers and auto-maps columns to shipment fields.
4. Operator reviews + corrects column mapping in a mapping UI.
5. System shows preview table with validation results (missing required fields, duplicate PRO numbers).
6. Operator confirms → POST to `/api/shipments/import` Route Handler.
7. Route Handler parses rows, deduplicates by `(tenant_id, pro_number)`, writes `shipments` records.
8. Returns count of created / skipped / errored rows.
9. Toast notification + list refreshes.

**DB writes:** `shipments` (bulk insert)

**Validation rules:**
- PRO or BOL number required (at least one)
- Carrier name matched to `carriers` table by name or SCAC (fuzzy match acceptable)
- Duplicate check: same `pro_number` + `tenant_id` → skip with warning
- `invoice_value_cents` must be numeric; reject non-numeric with row error

**Components:** `src/components/shipments/CsvImportModal.tsx`

---

## Workflow 3: Manual shipment creation

**Route:** `/app/shipments/new` or slide-over on `/app/shipments`

**Steps:**
1. Operator opens "New Shipment" form.
2. Fills: PRO/BOL, carrier (select from `carriers`), ship/delivery dates, origin, destination, invoice value.
3. POST to `/api/shipments` → creates `shipments` record.
4. Redirect to `/app/shipments/[id]`.

**DB writes:** `shipments`

---

## Workflow 4: Document upload and processing

**Route:** `/app/documents` (inbox) or `/app/shipments/[id]` (linked upload)

**Steps:**
1. Operator uploads files (PDF, JPEG, PNG, EML). Multi-file supported.
2. For each file:
   a. POST to `/api/documents/upload` Route Handler.
   b. Route Handler uploads file to Supabase Storage: `{tenant_id}/{shipment_id|'inbox'}/{doc_id}/{filename}`.
   c. Creates `documents` record with `parsing_status: pending`.
   d. Returns document record.
3. Inngest event `document/uploaded` fired with `{ document_id }`.
4. Inngest job `processDocument`:
   a. Downloads file from Storage.
   b. Extracts text (PDF text extraction or Tesseract OCR for images).
   c. Calls Claude API with extracted text + classification prompt.
   d. Saves raw text + structured fields to `document_extractions`.
   e. Updates `documents.document_type` (AI suggestion) and `parsing_status: complete`.
5. UI polls or uses Supabase Realtime subscription to show updated status.

**DB writes:** `documents`, `document_extractions`
**Storage writes:** `documents` bucket

**Operator review (after processing):**
- For inbox documents: operator sees classified type, can override, can link to a shipment.
- Link action: PATCH `/api/documents/[id]` with `{ shipment_id }`.

**Edge cases:**
- Extraction fails → `parsing_status: failed`, operator can re-trigger or manually classify
- Password-protected PDF → mark failed, prompt operator to upload unlocked version
- EML files → extract text body and attachments; create child document records for attachments

---

## Workflow 5: Claim candidate generation

**Trigger:** Automatically after document processing completes, or on-demand by operator.

**Steps:**
1. Inngest job `candidates/scan` fires for a shipment when:
   - A new document is processed for that shipment, or
   - Operator clicks "Scan for Candidates" on shipment detail.
2. Job loads shipment + all `document_extractions` for linked documents.
3. Calls Claude API with a candidate detection prompt.
4. Claude returns: candidate type (damage/shortage/loss), confidence score, estimated value, missing evidence list.
5. If confidence > 0.4 and no existing `new` or `converted` candidate for this shipment: creates `claim_candidates` record.
6. Operator sees candidate appear in `/app/candidates` queue.

**DB writes:** `claim_candidates`

**Candidate queue sort order:** `(claim_deadline_at ASC NULLS LAST, estimated_claim_value_cents DESC)`

**Note:** The candidate scan is a suggestion, not an action. It never creates a claim automatically.

---

## Workflow 6: Convert candidate to claim

**Route:** `/app/candidates` → review → convert

**Steps:**
1. Operator opens candidate from queue.
2. Sees: shipment details, document evidence, confidence breakdown, missing evidence.
3. Clicks "Convert to Claim".
4. System pre-fills claim creation form: type, estimated amount, carrier.
5. System seeds `claim_evidence` records from carrier profile's `required_documents`.
6. Operator adjusts claim amount if needed, confirms.
7. POST `/api/claims` → creates `claims` record with `status: draft`.
8. Writes `claim_events` entry: `{ event_type: 'created', actor_type: 'user' }`.
9. Updates `claim_candidates.status: converted`.
10. Redirect to `/app/claims/[id]`.

**DB writes:** `claims`, `claim_events`, `claim_evidence`

---

## Workflow 7: Claim preparation (claim workspace)

**Route:** `/app/claims/[id]`

**Purpose:** Operator assembles and approves the claim before filing.

**Steps:**
1. Operator opens claim workspace.
2. Reviews evidence checklist — identifies missing documents.
3. Uploads any missing docs directly from the workspace → triggers Workflow 4.
4. Once evidence is sufficient (no required items missing), "Generate Draft" button activates.
5. Operator clicks "Generate Draft".
6. POST `/api/claims/[id]/drafts` → server action:
   a. Loads claim, shipment, carrier profile, all document extractions.
   b. Calls Claude API with structured prompt (see `claim-packet-drafting` skill).
   c. Saves to `claim_drafts` with `review_status: generated`, `model_name`, `prompt_version`, `source_doc_ids`.
   d. Writes `claim_events` entry: `{ event_type: 'draft_generated' }`.
7. Operator reads draft in the workspace or navigates to `/app/claims/[id]/draft` for full-screen review.
8. Operator edits inline if needed.
9. Clicks "Approve Draft" → PATCH `/api/claims/[id]/drafts/[draft_id]`:
   a. Updates `claim_drafts.review_status: approved`, `reviewed_by`, `reviewed_at`.
   b. Saves `model_feedback` record with `edit_distance` if content changed.
   c. Writes `claim_events` entry: `{ event_type: 'draft_approved' }`.
10. "Mark Ready" button activates → PATCH `/api/claims/[id]` with `{ status: 'ready' }`.
    a. Writes `claim_events`: `{ event_type: 'status_changed', metadata: { from: 'draft', to: 'ready' } }`.

**DB writes:** `claim_drafts`, `claim_events`, `model_feedback`, `claims`

**Blocking rules:**
- "Generate Draft" requires: at least one `approved` document extraction, no `required: true` evidence items with `present: false`.
- "Mark Ready" requires: at least one `approved` draft exists.

---

## Workflow 8: Manual submission recording

**Route:** `/app/claims/[id]` → "Record Submission" modal

**Purpose:** Record that a claim was submitted (manually by operator via email/portal/mail).

**Steps:**
1. Operator clicks "Record Submission" (enabled when claim status = `ready`).
2. Modal: submission method, destination (email/portal), reference number, date, notes, optional confirmation doc.
3. Operator fills and submits.
4. POST `/api/claims/[id]/submissions`:
   a. Creates `submissions` record with `submitted_by_type: user`.
   b. If confirmation doc uploaded, creates `documents` record linked to claim.
   c. PATCH claim: `{ status: 'submitted', submitted_at: now() }`.
   d. Writes `claim_events`: `{ event_type: 'submitted', metadata: { submission_id, method } }`.

**DB writes:** `submissions`, `claims`, `claim_events`, `documents` (if confirmation uploaded)

---

## Workflow 9: Carrier response recording

**Route:** `/app/claims/[id]` → "Add Response" action

**Steps:**
1. Operator receives carrier response (email, mail, portal).
2. Uploads response document and/or types summary.
3. Selects response type: `acknowledgement | request_for_info | denial | partial_offer | approval`.
4. POST `/api/claims/[id]/responses`:
   a. Creates `carrier_responses` record.
   b. Updates claim status accordingly:
      - `acknowledgement` → `acknowledged`
      - `denial` → `denied`, sets `denied_at`
      - `approval` / `partial_offer` → prompts to record outcome
   c. Writes `claim_events` entry.

**DB writes:** `carrier_responses`, `claims`, `claim_events`

---

## Workflow 10: Appeal

**Route:** `/app/appeals/[id]` (created from claim workspace on denial)

**Steps:**
1. Claim status is `denied`. Operator clicks "Start Appeal" in claim workspace.
2. POST `/api/claims/[id]/appeals` → creates `appeals` record with `status: draft`.
3. Writes `claim_events`: `{ event_type: 'appealed' }`.
4. Claim status → `appealed`.
5. Operator navigates to `/app/appeals/[id]`.
6. Fills in appeal basis (why the denial was incorrect, new evidence).
7. Clicks "Generate Appeal Draft" → same draft generation flow as Workflow 7 but with `draft_type: appeal`.
8. Operator approves appeal draft.
9. Records appeal submission (same pattern as Workflow 8).
10. When resolved, operator records outcome: Won / Partial / Lost + amount.
11. Outcome updates `appeals.status: resolved`, `outcomes` record created, claim closed.

**DB writes:** `appeals`, `claim_events`, `claim_drafts`, `submissions`, `outcomes`, `claims`

---

## Workflow 11: Outcome recording

**Route:** `/app/claims/[id]` → "Record Settlement" modal

**Steps:**
1. Operator receives payment or credit.
2. Clicks "Record Settlement" in claim workspace.
3. Modal: outcome type, recovered amount, settlement method, notes.
4. POST `/api/claims/[id]/outcomes`:
   a. Creates `outcomes` record.
   b. PATCH claim: `settlement_amount_cents`, `settled_at`, `status: paid | partial_paid | denied`.
   c. Writes `claim_events`.

**DB writes:** `outcomes`, `claims`, `claim_events`

---

## Workflow 12: Recovery reporting

**Route:** `/app/reporting`

**Data source:** Direct Supabase queries from Server Components (no separate aggregation table in MVP).

**Views:**
1. **Summary panel** — total claimed, total recovered, recovery rate, open exposure (all from `claims`).
2. **By carrier** — group by `carrier_id`, join `carriers`, aggregate `settlement_amount_cents`.
3. **By period** — group by month using `date_trunc('month', submitted_at)`.
4. **Claims detail export** — CSV download of all closed claims with amounts and outcomes (Route Handler).

**Refresh strategy:** Server Components re-render on page load. No real-time needed for reporting in MVP.

---

## Workflow 13: Deadline tracking

**Not a workflow in the user-facing sense — this is a system concern.**

**How deadlines are set:**
- When a claim is created, operator enters `claim_deadline_at` manually (from carrier profile guidance).
- In the future, the system will calculate this from `delivery_date` + carrier-specific rules.

**How deadlines surface:**
- Claim workspace: `DeadlineBadge` component shows days remaining. Red < 14 days, amber < 30.
- Dashboard (Week 2): "At-risk deadlines" panel shows claims with < 30 days remaining.
- Candidate queue: sorted by deadline urgency.

**Inngest job (future):** `deadlines/check` runs daily, identifies at-risk claims, creates `tasks` and optionally sends email alerts.

---

## AI prompt conventions

All Claude API calls must:
1. Be made from server-side code only (Route Handlers or Inngest jobs).
2. Store `model_name`, `prompt_version`, and `source_doc_ids` alongside output.
3. Never expose API keys to the client.
4. Include the claim and shipment context as structured JSON in the system prompt.
5. Return structured output (ask for JSON when extracting; markdown for drafts).

Draft generation prompt inputs (minimum):
- Shipment metadata (PRO, BOL, carrier, dates, commodity, value)
- Claim type and amount
- All `document_extractions.raw_text` for linked documents
- Carrier profile submission instructions
- Carrier name and SCAC

---

## Operator-first principle

Even where automation is incomplete, AerisClaim must make the operator faster by:
- Centralizing all evidence in one place
- Reducing drafting work to review-and-edit rather than write-from-scratch
- Surfacing the next action for every claim explicitly
- Preserving a complete audit trail without any manual logging
- Making the reporting view trustworthy enough to hand to a CFO
