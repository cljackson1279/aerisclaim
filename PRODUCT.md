# AerisClaim — Product Requirements (30-Day MVP)

## Product summary
AerisClaim is an operator-first freight claims recovery operating system. The 30-day MVP must cover
the complete end-to-end claim lifecycle in a way that is usable for a real customer — even if some
steps (carrier submission, response parsing) remain partially manual behind the scenes.

The goal is not a thin demo. The goal is a system that a freight team can actually use to run their
claims process from day one.

---

## 30-day MVP scope

### In scope
1. Marketing site (complete)
2. Authenticated app shell with sidebar navigation
3. Auth and multi-tenant basics (Supabase Auth, tenant isolation)
4. Shipment import and shipment detail pages
5. Document upload and document inbox
6. Claim candidate queue
7. Claim workspace (evidence, draft, status)
8. Deadline and status tracking
9. Draft generation (Claude API)
10. Manual submission records
11. Appeals (basic — record denial, generate appeal draft)
12. Reporting basics (recovery summary)

### Out of scope (30 days)
- Automated carrier portal submission
- Real-time carrier response parsing
- TMS integrations beyond CSV import
- Advanced ML scoring
- Customer-facing portal (customer sees operator-prepared reports only)
- Full accounting integrations
- Parcel, detention, accessorial workflows

---

## User roles

| Role | What they do in the MVP |
|---|---|
| `operator` | Full access — ingests docs, manages claims, generates drafts, records submissions |
| `claims_manager` | Reviews claims, approves filing, monitors status — same access as operator for MVP |
| `finance` | Read-only access to reporting section |
| `admin` | Tenant configuration, user management, carrier profiles |

Multi-role support is a DB concern; the UI can treat `operator` and `claims_manager` identically in v1.

---

## Screens and routes

### Public
| Route | Screen | Status |
|---|---|---|
| `/` | Marketing homepage | Complete |
| `/auth/login` | Login (magic link + email/password) | To build |
| `/auth/callback` | Supabase OAuth callback | To build |

### Authenticated app (`/app/*`)
All app routes require an active session and a resolved tenant. Middleware handles redirect to `/auth/login`.

| Route | Screen | Priority |
|---|---|---|
| `/app/dashboard` | Operator dashboard — today's actions, open exposure, deadline alerts | Week 2 |
| `/app/shipments` | Shipments list — filterable, sortable table | Week 1 |
| `/app/shipments/[id]` | Shipment detail — documents, events, linked claims | Week 1 |
| `/app/documents` | Documents inbox — unlinked/unclassified documents | Week 1 |
| `/app/candidates` | Claim candidates queue — ranked by value + urgency | Week 2 |
| `/app/claims` | Claims list — by status, carrier, deadline | Week 2 |
| `/app/claims/[id]` | Claim workspace — evidence, draft, status, events | Week 2 |
| `/app/claims/[id]/draft` | Draft review — full-screen editing and approval | Week 2 |
| `/app/appeals/[id]` | Appeal workspace — denial reason, draft, outcome | Week 3 |
| `/app/reporting` | Recovery reporting — summary, by carrier, by period | Week 3 |
| `/app/settings` | Settings shell | Week 1 |
| `/app/settings/carriers` | Carrier profiles — submission method, instructions | Week 2 |

---

## Screen specifications

### App shell layout
- Left sidebar: 240px fixed, dark (`#09090B`), logo + nav items + user/tenant footer
- Top bar: 56px, tenant name, global search (placeholder), user menu
- Content area: full remaining width, scrollable
- Sidebar sections: Workspace (Dashboard, Shipments, Documents), Claims (Candidates, All Claims), Operations (Reporting, Carriers), Settings

### Shipments list (`/app/shipments`)
**Purpose:** Central record of all shipments for the tenant.

**Table columns:** PRO #, Carrier, BOL #, Ship Date, Delivery Date, Origin → Destination, Status, Invoice Value, Actions

**Filters:** Carrier, Status, Date range, Has open claim (yes/no)

**Actions per row:** View detail, Create claim (if no active claim exists)

**Empty state:** "No shipments yet — import a CSV or add a shipment manually."

**Import flow:**
1. Upload CSV button → modal
2. Column mapping step (map CSV columns to shipment fields)
3. Preview rows with validation warnings
4. Confirm import → creates `shipments` records
5. Toast with count of rows imported / skipped

**Manual creation:** Simple form with required fields: PRO/BOL, carrier, ship date, delivery date, origin, destination, invoice value.

### Shipment detail (`/app/shipments/[id]`)
**Layout:** Two-column. Left (60%): documents panel, events timeline. Right (40%): shipment metadata, linked claim card, actions.

**Documents panel:** List of documents linked to this shipment with type badge, filename, upload date, extraction status. Upload new doc button.

**Events timeline:** `shipment_events` and `claim_events` merged, newest first.

**Linked claim card:** Shows claim status, claim amount, deadline, link to claim workspace. "Create Claim" CTA if none exists.

### Documents inbox (`/app/documents`)
**Purpose:** Catch-all for uploaded documents not yet linked to a shipment or claim.

**Table columns:** Filename, Document Type (classified or "Unclassified"), Uploaded, Linked To, Extraction Status

**Actions:** View/preview, Link to shipment, Reclassify, Delete

**Upload:** Drag-and-drop zone at the top, multi-file support. Accept PDF, JPEG, PNG, EML.

**Document type classification:** Attempted automatically on upload via AI extraction. Operator can override.

### Claim candidates queue (`/app/candidates`)
**Purpose:** Show shipments and events that likely have claimable issues, ranked by urgency and value.

**Card/row contents:** Shipment PRO, Carrier, Candidate type (Damage / Shortage / Loss), Estimated value, Evidence completeness score, Deadline risk, Missing evidence list

**Sort default:** Deadline urgency first, then estimated value.

**Actions per candidate:** Review → Convert to Claim, Dismiss (with reason)

**"Convert to Claim" flow:**
1. Prefill claim creation form from candidate data
2. Show evidence checklist — confirm what's present/missing
3. Create `claim` record in `draft` status → redirect to claim workspace

### Claim workspace (`/app/claims/[id]`)
**Purpose:** The primary operator working surface for a single claim.

**Layout:** Three-column on wide screens.
- Left (280px): Document list + evidence checklist. Documents are clickable to preview.
- Center: Claim details — type, amount, narrative, status, actions.
- Right (280px): Events/timeline, tasks, carrier info, deadlines.

**Claim detail (center):**
- Claim type badge, claim amount (editable)
- Submission status pill + deadline badge (red if < 14 days, amber if < 30)
- Generated draft section (shows latest approved draft or "Generate Draft" CTA)
- "Mark Ready" button → moves status to `ready`
- "Record Submission" button → opens submission record modal

**Evidence checklist:**
- Per carrier profile: list of required document types
- Each item: Present (green) / Missing (amber) / Not applicable
- Missing items surface as a blocking warning before "Mark Ready" is enabled

**Status flow (operator actions):**
`draft` → `ready` → `submitted` → `acknowledged` → `paid / partial_paid / denied` → `closed`

Appeals branch: `denied` → `appealed` (creates appeal record) → `closed`

**Generating a draft:**
1. "Generate Draft" CTA (disabled if evidence checklist has critical gaps)
2. System calls Claude API with shipment data, extracted doc content, and carrier profile
3. Draft saved to `claim_drafts` with `review_status: generated`
4. Operator reads, edits inline, clicks "Approve Draft"
5. Draft status → `approved`. Now "Record Submission" becomes available.

### Draft review (`/app/claims/[id]/draft`)
**Full-screen editing surface.**
- Left: source document preview (PDF viewer or text extraction)
- Right: editable draft text (markdown, rich text editor)
- Top bar: claim context, "Approve" button, "Regenerate" button, version history

### Manual submission record modal
**Fields:**
- Submission method (Email / Portal / Mail / Fax / Phone)
- Submitted to (email address or portal name)
- Reference/confirmation number
- Date submitted
- Notes
- Attach submission confirmation (document upload)

On save: creates `submissions` record, writes `claim_events` entry, moves claim status to `submitted`.

### Appeals workspace (`/app/appeals/[id]`)
**Purpose:** Handle carrier denials.

**Sections:**
- Denial summary: carrier response, date received, stated reason
- Appeal basis input (free text, operator fills in)
- Appeal draft (generated via Claude API using denial reason + original claim evidence)
- Appeal submission record (same as claim submission record pattern)
- Outcome: Resolved (Won / Partial / Lost)

### Recovery reporting (`/app/reporting`)
**Purpose:** Give finance stakeholders a clear picture of recovery performance.

**Views:**
1. Summary: Total claimed, Total recovered, Recovery rate %, Open exposure, Average cycle time
2. By carrier: Table — Carrier, Claims filed, Recovered, Avg settlement %, Avg cycle days
3. By period: Monthly bar chart or table — Claimed, Recovered, Written off
4. Claims detail: Exportable table of all closed claims with amounts and outcomes

**Export:** CSV export of each view. No PDF in MVP.

### Settings / Carrier profiles (`/app/settings/carriers`)
**Per carrier profile:**
- Carrier name + SCAC
- Submission method (Email / Portal / Mail / Manual)
- Submission endpoint (email address or portal URL)
- Submission instructions (markdown textarea)
- Required documents (checklist: BOL, POD, Invoice, Photos, Inspection report, etc.)
- Required fields (markdown notes)

---

## Functional requirements by area

### Auth
- Supabase Auth: magic link email + email/password
- Session stored in cookies via `@supabase/ssr`
- Tenant resolved from `user.tenant_id` after login
- Middleware protects all `/app/*` routes — redirect to `/auth/login` if no session
- No self-serve signup in MVP — users created by admin or founder manually

### Multi-tenancy
- Every DB table has `tenant_id uuid NOT NULL`
- RLS policies enforce `tenant_id = auth.jwt()->>'tenant_id'` on all tables
- `tenant_id` injected into JWT via Supabase Auth custom claims (or resolved via users table lookup in a security-definer function)
- No cross-tenant data access possible at the DB level

### Document storage
- All files stored in Supabase Storage bucket `documents`
- Path: `{tenant_id}/{shipment_id or 'inbox'}/{document_id}/{filename}`
- RLS on storage bucket matches document ownership
- Signed URLs generated server-side for document preview

### Document processing
- On upload: create `documents` record with `parsing_status: pending`
- Queue Inngest job `document.process`
- Job calls Claude API with document text (or Tesseract OCR output for images)
- Store raw extraction output + structured fields in `document_extractions`
- Update `documents.parsing_status` to `complete` or `failed`

### Claim candidate generation
- Inngest job `candidates.scan` runs after document processing or on demand
- Scans `shipment_events` and `document_extractions` for damage/shortage/loss indicators
- Creates `claim_candidates` with confidence score and missing evidence list
- Does not auto-convert — always requires human review

### Draft generation
- Server action or Route Handler calls Claude API
- Input: shipment record, carrier profile, all `document_extractions` for linked docs, claim details
- Prompt version stored with output
- Output saved to `claim_drafts`
- Never sent anywhere automatically

---

## Non-functional requirements
- Desktop-first, responsive down to 1024px minimum
- All monetary values stored as integer cents; displayed as formatted dollars
- Dates stored as ISO UTC; displayed in user's local timezone
- No client-side secret exposure (API keys in env vars, calls via Route Handlers only)
- Supabase RLS on every table — tested
- File uploads max 50MB per file in MVP
