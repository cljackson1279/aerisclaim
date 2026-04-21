# AerisClaim — Data Model

## Modeling principles
1. **Multi-tenant everywhere.** Every row carries `tenant_id`. RLS enforces isolation.
2. **Preserve raw inputs.** Store files as-is in Storage. Store extracted text and structured output separately.
3. **Separate source documents from extracted facts.** `documents` holds file metadata; `document_extractions` holds AI output.
4. **Capture state transitions as events.** `claim_events` is the audit log — never delete, never mutate.
5. **Store monetary values as integer cents.** Display layer does formatting.
6. **Make every claim outcome reusable for learning.** `model_feedback` and `outcomes` compound over time.

---

## MVP table priority

**Week 1 (auth + shipments + documents):**
`tenants`, `users`, `carriers`, `shipments`, `shipment_events`, `documents`, `document_extractions`

**Week 2 (claims core):**
`carrier_profiles`, `claim_candidates`, `claims`, `claim_events`, `claim_evidence`, `claim_drafts`

**Week 3 (submission + appeals + reporting):**
`submissions`, `carrier_responses`, `appeals`, `outcomes`, `tasks`, `model_feedback`

---

## Enums

```sql
-- User roles
create type user_role as enum ('operator', 'claims_manager', 'finance', 'admin');

-- Freight modes
create type freight_mode as enum ('ltl', 'ftl', 'parcel', 'intermodal', 'other');

-- Document types
create type document_type as enum (
  'bol', 'pod', 'invoice', 'photo', 'inspection', 'tariff',
  'email', 'carrier_response', 'appeal', 'other'
);

-- Parsing status
create type parsing_status as enum ('pending', 'processing', 'complete', 'failed');

-- Claim candidate status
create type candidate_status as enum ('new', 'reviewed', 'converted', 'dismissed');

-- Claim types
create type claim_type as enum ('damage', 'shortage', 'loss', 'delay', 'os_and_d');

-- Claim status — ordered lifecycle
create type claim_status as enum (
  'draft', 'ready', 'submitted', 'acknowledged',
  'partial_paid', 'paid', 'denied', 'appealed', 'closed'
);

-- Submission methods
create type submission_method as enum ('email', 'portal', 'api', 'mail', 'fax', 'phone', 'manual');

-- Draft types
create type draft_type as enum ('initial_claim', 'follow_up', 'appeal', 'escalation');

-- Draft review status
create type draft_review_status as enum ('generated', 'edited', 'approved', 'sent');

-- Carrier response types
create type carrier_response_type as enum (
  'acknowledgement', 'request_for_info', 'denial', 'partial_offer', 'approval'
);

-- Appeal status
create type appeal_status as enum ('draft', 'ready', 'submitted', 'resolved');

-- Outcome types
create type outcome_type as enum ('paid', 'partial_paid', 'denied', 'write_off');

-- Settlement methods
create type settlement_method as enum ('check', 'ach', 'credit', 'offset', 'unknown');

-- Task status
create type task_status as enum ('open', 'in_progress', 'done', 'cancelled');

-- Model feedback types
create type feedback_type as enum ('accepted', 'edited', 'rejected');
```

---

## Tables

### tenants
```sql
create table tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,           -- URL-safe identifier
  vertical    text,                           -- e.g. 'distributor', '3pl', 'shipper'
  plan        text not null default 'trial',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- No RLS needed — tenants table accessed via service role or security-definer functions only
```

### users
```sql
create table users (
  id          uuid primary key references auth.users(id) on delete cascade,
  tenant_id   uuid not null references tenants(id),
  email       text not null,
  full_name   text,
  role        user_role not null default 'operator',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index users_tenant_id_idx on users(tenant_id);

-- RLS
alter table users enable row level security;
create policy "users: tenant isolation"
  on users for all
  using (tenant_id = (select tenant_id from users where id = auth.uid()));
```

**Note on JWT claims:** `tenant_id` is resolved via the `users` table. Use a security-definer
function `get_my_tenant_id()` that returns `tenant_id` for `auth.uid()` to keep RLS policies fast.

### carriers
```sql
create table carriers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  scac        text unique,                    -- Standard Carrier Alpha Code
  mode        freight_mode not null default 'ltl',
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- Global reference table — no RLS, readable by all authenticated users
```

Seed data for common LTL carriers: FedEx Freight, Old Dominion, XPO Logistics, Estes Express,
ABF Freight, Saia, Southeastern Freight Lines, R+L Carriers, NEMF, TForce.

### carrier_profiles
```sql
create table carrier_profiles (
  id                      uuid primary key default gen_random_uuid(),
  tenant_id               uuid references tenants(id),  -- NULL = global default
  carrier_id              uuid not null references carriers(id),
  submission_method       submission_method not null default 'manual',
  submission_endpoint     text,            -- email address or portal URL
  submission_instructions text,            -- markdown
  required_documents      text[] not null default '{}',  -- array of document_type values
  required_fields         jsonb not null default '{}',   -- field name → description
  internal_notes          text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique(tenant_id, carrier_id)
);
create index carrier_profiles_tenant_idx on carrier_profiles(tenant_id);

-- RLS
alter table carrier_profiles enable row level security;
create policy "carrier_profiles: tenant or global"
  on carrier_profiles for select
  using (tenant_id is null or tenant_id = get_my_tenant_id());
create policy "carrier_profiles: tenant write"
  on carrier_profiles for all
  using (tenant_id = get_my_tenant_id());
```

### shipments
```sql
create table shipments (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             uuid not null references tenants(id),
  external_reference    text,               -- customer's internal ref
  carrier_id            uuid references carriers(id),
  bol_number            text,
  pro_number            text,
  origin_name           text,
  origin_city           text,
  origin_state          char(2),
  destination_name      text,
  destination_city      text,
  destination_state     char(2),
  ship_date             date,
  delivery_date         date,
  freight_mode          freight_mode not null default 'ltl',
  commodity_description text,
  nmfc_class            text,
  packaging_type        text,
  invoice_value_cents   integer,            -- declared value
  freight_charges_cents integer,
  status                text not null default 'active',
  import_batch_id       text,               -- groups rows from same CSV upload
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index shipments_tenant_idx on shipments(tenant_id);
create index shipments_carrier_idx on shipments(carrier_id);
create index shipments_pro_number_idx on shipments(tenant_id, pro_number);

-- RLS
alter table shipments enable row level security;
create policy "shipments: tenant isolation"
  on shipments for all
  using (tenant_id = get_my_tenant_id());
```

### shipment_events
```sql
create table shipment_events (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id),
  shipment_id  uuid not null references shipments(id) on delete cascade,
  event_type   text not null,  -- 'damage' | 'shortage' | 'loss' | 'delay' | 'exception' | 'note'
  event_source text not null,  -- 'pod_note' | 'email' | 'manual' | 'photo_review' | 'import'
  occurred_at  timestamptz,
  summary      text not null,
  severity     text,           -- 'low' | 'medium' | 'high'
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);
create index shipment_events_shipment_idx on shipment_events(shipment_id);

-- RLS
alter table shipment_events enable row level security;
create policy "shipment_events: tenant isolation"
  on shipment_events for all
  using (tenant_id = get_my_tenant_id());
```

### documents
```sql
create table documents (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             uuid not null references tenants(id),
  shipment_id           uuid references shipments(id),
  claim_id              uuid,               -- FK added after claims table created
  document_type         document_type not null default 'other',
  original_document_type document_type,    -- AI-classified type before operator override
  file_name             text not null,
  storage_path          text not null,      -- Supabase Storage path
  mime_type             text not null,
  file_size_bytes       integer,
  checksum              text,               -- SHA-256 of file contents
  uploaded_by           uuid references auth.users(id),
  uploaded_at           timestamptz not null default now(),
  parsing_status        parsing_status not null default 'pending',
  extraction_confidence numeric(4,3),       -- 0.000–1.000
  created_at            timestamptz not null default now()
);
create index documents_tenant_idx on documents(tenant_id);
create index documents_shipment_idx on documents(shipment_id);
create index documents_claim_idx on documents(claim_id);
create index documents_parsing_status_idx on documents(tenant_id, parsing_status);

-- RLS
alter table documents enable row level security;
create policy "documents: tenant isolation"
  on documents for all
  using (tenant_id = get_my_tenant_id());
```

**Storage bucket:** `documents` (private)
Path format: `{tenant_id}/{shipment_id|'inbox'}/{document_id}/{original_filename}`

### document_extractions
```sql
create table document_extractions (
  id                uuid primary key default gen_random_uuid(),
  document_id       uuid not null references documents(id) on delete cascade,
  extractor_name    text not null,       -- 'claude-3-5-sonnet' | 'tesseract' | etc.
  extractor_version text not null,
  prompt_version    text,                -- semver of the prompt template used
  raw_text          text,               -- full OCR / extracted text
  structured_data   jsonb not null default '{}',  -- typed fields extracted
  extraction_status text not null default 'complete',
  token_count       integer,
  created_at        timestamptz not null default now()
);
create index document_extractions_document_idx on document_extractions(document_id);
-- No RLS — accessed via documents join with tenant check in app layer
```

`structured_data` schema (varies by document_type):
```json
{
  "bol_number": "string",
  "pro_number": "string",
  "carrier": "string",
  "shipper_name": "string",
  "consignee_name": "string",
  "ship_date": "date string",
  "delivery_date": "date string",
  "declared_value_cents": "integer",
  "pieces": "integer",
  "weight_lbs": "number",
  "damage_noted": "boolean",
  "damage_description": "string",
  "shortage_noted": "boolean",
  "shortage_description": "string",
  "driver_signature": "boolean",
  "exceptions_noted": "string[]"
}
```
Not all fields present on every extraction — depends on document type.

### claim_candidates
```sql
create table claim_candidates (
  id                          uuid primary key default gen_random_uuid(),
  tenant_id                   uuid not null references tenants(id),
  shipment_id                 uuid not null references shipments(id),
  source_event_id             uuid references shipment_events(id),
  candidate_type              claim_type not null,
  confidence_score            numeric(4,3) not null,  -- 0.000–1.000
  estimated_claim_value_cents integer,
  evidence_completeness_score numeric(4,3),
  missing_evidence            text[] not null default '{}',
  recommendation_summary      text,
  status                      candidate_status not null default 'new',
  dismissed_reason            text,
  converted_to_claim_id       uuid,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);
create index candidates_tenant_status_idx on claim_candidates(tenant_id, status);
create index candidates_shipment_idx on claim_candidates(shipment_id);

-- RLS
alter table claim_candidates enable row level security;
create policy "candidates: tenant isolation"
  on claim_candidates for all
  using (tenant_id = get_my_tenant_id());
```

### claims
```sql
create table claims (
  id                      uuid primary key default gen_random_uuid(),
  tenant_id               uuid not null references tenants(id),
  shipment_id             uuid not null references shipments(id),
  source_candidate_id     uuid references claim_candidates(id),
  carrier_id              uuid references carriers(id),
  claim_number            text,                   -- carrier-assigned number
  claim_type              claim_type not null,
  filing_basis            text,                   -- narrative summary of why this is claimable
  claim_amount_cents      integer not null,
  settlement_amount_cents integer,
  status                  claim_status not null default 'draft',
  priority_score          numeric(5,2) not null default 50,
  claim_deadline_at       timestamptz,            -- carrier's filing deadline
  legal_deadline_at       timestamptz,            -- Carmack Amendment / tariff deadline
  submitted_at            timestamptz,
  acknowledged_at         timestamptz,
  settled_at              timestamptz,
  denied_at               timestamptz,
  owner_user_id           uuid references auth.users(id),
  created_by              uuid not null references auth.users(id),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index claims_tenant_status_idx on claims(tenant_id, status);
create index claims_tenant_deadline_idx on claims(tenant_id, claim_deadline_at);
create index claims_shipment_idx on claims(shipment_id);

-- Backfill FK on documents
alter table documents add constraint documents_claim_id_fk
  foreign key (claim_id) references claims(id);

-- RLS
alter table claims enable row level security;
create policy "claims: tenant isolation"
  on claims for all
  using (tenant_id = get_my_tenant_id());
```

### claim_events
```sql
create table claim_events (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id),
  claim_id    uuid not null references claims(id) on delete cascade,
  event_type  text not null,
  -- Values: created | status_changed | draft_generated | draft_approved |
  --         submitted | acknowledged | denied | appealed | paid | note_added |
  --         document_added | task_created
  actor_type  text not null,  -- 'user' | 'system'
  actor_id    uuid,           -- auth.users.id if actor_type = 'user'
  metadata    jsonb not null default '{}',
  -- metadata examples:
  --   status_changed: { "from": "draft", "to": "ready" }
  --   note_added:     { "note": "Called carrier, ref #12345" }
  --   submitted:      { "submission_id": "uuid", "method": "email" }
  created_at  timestamptz not null default now()
);
create index claim_events_claim_idx on claim_events(claim_id, created_at desc);

-- RLS
alter table claim_events enable row level security;
create policy "claim_events: tenant isolation"
  on claim_events for all
  using (tenant_id = get_my_tenant_id());
```

`claim_events` is append-only. Never update or delete rows.

### claim_evidence
```sql
create table claim_evidence (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id),
  claim_id      uuid not null references claims(id) on delete cascade,
  document_id   uuid references documents(id),
  evidence_type text not null,  -- matches document_type enum values
  required      boolean not null default false,
  present       boolean not null default false,
  notes         text,
  created_at    timestamptz not null default now(),
  unique(claim_id, evidence_type)
);

-- RLS
alter table claim_evidence enable row level security;
create policy "claim_evidence: tenant isolation"
  on claim_evidence for all
  using (tenant_id = get_my_tenant_id());
```

Evidence checklist is seeded from the carrier profile's `required_documents` when a claim is created.

### claim_drafts
```sql
create table claim_drafts (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants(id),
  claim_id          uuid not null references claims(id) on delete cascade,
  draft_type        draft_type not null default 'initial_claim',
  model_name        text not null,          -- e.g. 'claude-sonnet-4-6'
  prompt_version    text not null,          -- e.g. '1.0.0'
  source_doc_ids    uuid[] not null default '{}',  -- document_ids used as input
  content_markdown  text not null,
  content_json      jsonb,                  -- structured sections if applicable
  review_status     draft_review_status not null default 'generated',
  reviewed_by       uuid references auth.users(id),
  reviewed_at       timestamptz,
  created_by_type   text not null default 'system',  -- 'system' | 'user'
  created_by_id     uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index claim_drafts_claim_idx on claim_drafts(claim_id, created_at desc);

-- RLS
alter table claim_drafts enable row level security;
create policy "claim_drafts: tenant isolation"
  on claim_drafts for all
  using (tenant_id = get_my_tenant_id());
```

### submissions
```sql
create table submissions (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references tenants(id),
  claim_id            uuid not null references claims(id),
  carrier_profile_id  uuid references carrier_profiles(id),
  submission_method   submission_method not null,
  submitted_by_type   text not null,  -- 'user' | 'system'
  submitted_by_id     uuid references auth.users(id),
  submitted_at        timestamptz not null default now(),
  reference_id        text,           -- carrier confirmation number
  destination         text,           -- email or portal URL used
  claim_draft_id      uuid references claim_drafts(id),
  payload_snapshot    jsonb,          -- snapshot of what was sent
  notes               text,
  confirmation_doc_id uuid references documents(id)
);
create index submissions_claim_idx on submissions(claim_id);

-- RLS
alter table submissions enable row level security;
create policy "submissions: tenant isolation"
  on submissions for all
  using (tenant_id = get_my_tenant_id());
```

### carrier_responses
```sql
create table carrier_responses (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id),
  claim_id      uuid not null references claims(id),
  submission_id uuid references submissions(id),
  response_type carrier_response_type not null,
  received_at   timestamptz not null default now(),
  summary       text,
  raw_content   text,
  parsed_data   jsonb not null default '{}',
  document_id   uuid references documents(id),  -- uploaded response document
  created_at    timestamptz not null default now()
);
create index carrier_responses_claim_idx on carrier_responses(claim_id);

-- RLS
alter table carrier_responses enable row level security;
create policy "carrier_responses: tenant isolation"
  on carrier_responses for all
  using (tenant_id = get_my_tenant_id());
```

### appeals
```sql
create table appeals (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id),
  claim_id      uuid not null references claims(id),
  denial_id     uuid references carrier_responses(id),
  basis         text,                       -- operator-written appeal justification
  status        appeal_status not null default 'draft',
  submitted_at  timestamptz,
  resolved_at   timestamptz,
  outcome       text,                       -- 'won' | 'partial' | 'lost'
  outcome_notes text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- RLS
alter table appeals enable row level security;
create policy "appeals: tenant isolation"
  on appeals for all
  using (tenant_id = get_my_tenant_id());
```

### outcomes
```sql
create table outcomes (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             uuid not null references tenants(id),
  claim_id              uuid not null references claims(id),
  outcome_type          outcome_type not null,
  recovered_amount_cents integer not null default 0,
  settlement_method     settlement_method not null default 'unknown',
  outcome_reason        text,
  recorded_by           uuid not null references auth.users(id),
  recorded_at           timestamptz not null default now()
);
create index outcomes_tenant_idx on outcomes(tenant_id, recorded_at desc);

-- RLS
alter table outcomes enable row level security;
create policy "outcomes: tenant isolation"
  on outcomes for all
  using (tenant_id = get_my_tenant_id());
```

### tasks
```sql
create table tasks (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id),
  claim_id     uuid references claims(id),
  shipment_id  uuid references shipments(id),
  assigned_to  uuid references auth.users(id),
  title        text not null,
  description  text,
  task_type    text,  -- 'follow_up' | 'upload_document' | 'submit_claim' | 'review' | 'custom'
  due_at       timestamptz,
  status       task_status not null default 'open',
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index tasks_tenant_status_idx on tasks(tenant_id, status);
create index tasks_claim_idx on tasks(claim_id);

-- RLS
alter table tasks enable row level security;
create policy "tasks: tenant isolation"
  on tasks for all
  using (tenant_id = get_my_tenant_id());
```

### model_feedback
```sql
create table model_feedback (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants(id),
  claim_id          uuid references claims(id),
  claim_draft_id    uuid references claim_drafts(id),
  model_name        text not null,
  model_version     text not null,
  feedback_type     feedback_type not null,
  edit_distance     integer,  -- character-level edit distance from original to approved
  notes             text,
  created_by        uuid not null references auth.users(id),
  created_at        timestamptz not null default now()
);
-- RLS
alter table model_feedback enable row level security;
create policy "model_feedback: tenant isolation"
  on model_feedback for all
  using (tenant_id = get_my_tenant_id());
```

---

## Helper function

```sql
-- Security-definer function used in RLS policies
create or replace function get_my_tenant_id()
returns uuid
language sql
security definer
stable
as $$
  select tenant_id from users where id = auth.uid()
$$;
```

---

## Key relationships

```
tenants 1──* users
tenants 1──* shipments
tenants 1──* claims
tenants 1──* documents
shipments 1──* shipment_events
shipments 1──* documents (via shipment_id)
shipments 1──* claim_candidates
shipments 1──* claims
claims 1──* claim_events        (append-only audit log)
claims 1──* claim_evidence      (evidence checklist)
claims 1──* claim_drafts
claims 1──* submissions
claims 1──* carrier_responses
claims 1──1 appeals
claims 1──1 outcomes
documents 1──1 document_extractions
carriers 1──* carrier_profiles
carrier_profiles 1──* submissions
```

---

## Derived reporting queries (not materialized views in MVP)

```sql
-- Recovery summary by tenant
select
  count(*) filter (where status = 'paid') as paid_count,
  sum(settlement_amount_cents) filter (where status in ('paid','partial_paid')) as recovered_cents,
  sum(claim_amount_cents) as total_claimed_cents,
  count(*) filter (where status in ('draft','ready','submitted','acknowledged')) as open_count
from claims
where tenant_id = get_my_tenant_id();

-- By carrier
select
  c.name as carrier_name,
  count(cl.*) as claims_filed,
  sum(cl.settlement_amount_cents) as recovered_cents,
  avg(extract(epoch from (cl.settled_at - cl.submitted_at))/86400) as avg_cycle_days
from claims cl
join carriers c on c.id = cl.carrier_id
where cl.tenant_id = get_my_tenant_id()
  and cl.submitted_at is not null
group by c.name;
```

---

## Future analytics (not MVP)
- Carrier denial rate by `claim_type`
- Appeal win rate by carrier + commodity
- Evidence completeness vs settlement amount correlation
- AI draft edit distance trend (measures draft quality improvement over time)
- Time-to-submit by operator (measures throughput)
