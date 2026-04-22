-- =============================================================================
-- AerisClaim — Week 1 Foundation Migration
-- Tables: tenants, users, carriers, shipments, shipment_events,
--         documents, document_extractions
--
-- Order matters:
--   1. Enums
--   2. tenants (no deps)
--   3. users table body (no RLS yet — function doesn't exist yet)
--   4. get_my_tenant_id() — now safe because public.users exists
--   5. users RLS policies (function now defined)
--   6. carriers, shipments, shipment_events, documents (all use the function)
--   7. document_extractions (no RLS)
-- =============================================================================

-- ─── Enums ───────────────────────────────────────────────────────────────────

create type user_role as enum (
  'operator',
  'claims_manager',
  'finance',
  'admin'
);

create type freight_mode as enum (
  'ltl',
  'ftl',
  'parcel',
  'intermodal',
  'other'
);

create type document_type as enum (
  'bol',
  'pod',
  'invoice',
  'photo',
  'inspection',
  'tariff',
  'email',
  'carrier_response',
  'appeal',
  'other'
);

create type parsing_status as enum (
  'pending',
  'processing',
  'complete',
  'failed'
);

-- ─── tenants ─────────────────────────────────────────────────────────────────
-- No RLS. Accessed only via service role during onboarding or
-- security-definer functions. Must never be directly readable by end users.

create table tenants (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  vertical   text,               -- 'shipper' | 'distributor' | '3pl' | 'broker'
  plan       text not null default 'trial',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── users — table only, RLS applied after function is defined ───────────────
-- 1:1 extension of auth.users. Created by admin after the auth record exists.
-- on delete cascade ensures no orphan rows if auth user is deleted.

create table users (
  id         uuid primary key references auth.users(id) on delete cascade,
  tenant_id  uuid not null references tenants(id),
  email      text not null,
  full_name  text,
  role       user_role not null default 'operator',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_tenant_id_idx on users(tenant_id);

-- ─── Helper: tenant resolver ──────────────────────────────────────────────────
-- Defined after public.users exists (PostgreSQL validates SQL function bodies
-- at creation time — forward reference would fail).
--
-- security definer runs as the function owner, bypassing RLS on the users
-- table query. This prevents infinite recursion: RLS on users calls this
-- function → function queries users → without definer, that query hits RLS
-- again → infinite loop.

create or replace function get_my_tenant_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select tenant_id from public.users where id = auth.uid()
$$;

-- ─── users — RLS policies (now that the function is defined) ─────────────────

alter table users enable row level security;

create policy "users: read own tenant"
  on users for select
  using (tenant_id = get_my_tenant_id());

create policy "users: update own record"
  on users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ─── carriers ────────────────────────────────────────────────────────────────
-- Global reference table — no tenant_id. All tenants share one carrier list.
-- Authenticated users can read; writes are service-role only (no write policy).

create table carriers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  scac       text unique,         -- Standard Carrier Alpha Code
  mode       freight_mode not null default 'ltl',
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table carriers enable row level security;

create policy "carriers: read by authenticated"
  on carriers for select
  using (auth.role() = 'authenticated');

-- Seed: common LTL carriers (included in migration so the list is
-- always present after first push — no separate seed step required)
insert into carriers (name, scac, mode) values
  ('FedEx Freight',               'FXFE', 'ltl'),
  ('Old Dominion Freight Line',   'ODFL', 'ltl'),
  ('XPO Logistics',               'XPOL', 'ltl'),
  ('Estes Express Lines',         'EXLA', 'ltl'),
  ('ABF Freight',                 'ABFS', 'ltl'),
  ('Saia LTL Freight',            'SAIA', 'ltl'),
  ('Southeastern Freight Lines',  'SEFL', 'ltl'),
  ('R+L Carriers',                'RLCA', 'ltl'),
  ('TForce Freight',              'UPGF', 'ltl'),
  ('Dayton Freight Lines',        'DAFG', 'ltl'),
  ('Forward Air',                 'FWDA', 'ltl'),
  ('Pitt Ohio',                   'PITT', 'ltl'),
  ('AAA Cooper Transportation',   'AACT', 'ltl'),
  ('Averitt Express',             'AVRT', 'ltl'),
  ('Spee-Dee Delivery',           'SPEE', 'ltl');

-- ─── shipments ───────────────────────────────────────────────────────────────

create table shipments (
  id                    uuid primary key default gen_random_uuid(),
  tenant_id             uuid not null references tenants(id),
  external_reference    text,
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
  invoice_value_cents   integer,
  freight_charges_cents integer,
  status                text not null default 'active',
  import_batch_id       text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index shipments_tenant_idx        on shipments(tenant_id);
create index shipments_carrier_idx       on shipments(carrier_id);
create index shipments_pro_number_idx    on shipments(tenant_id, pro_number);
create index shipments_bol_number_idx    on shipments(tenant_id, bol_number);
create index shipments_delivery_date_idx on shipments(tenant_id, delivery_date desc);

alter table shipments enable row level security;

create policy "shipments: tenant isolation"
  on shipments for all
  using (tenant_id = get_my_tenant_id())
  with check (tenant_id = get_my_tenant_id());

-- ─── shipment_events ─────────────────────────────────────────────────────────
-- Append-only signal log. Drives claim candidate generation.
--
-- event_type:   'damage' | 'shortage' | 'loss' | 'delay' | 'exception' | 'note'
-- event_source: 'pod_note' | 'email' | 'manual' | 'photo_review' | 'import'
-- severity:     'low' | 'medium' | 'high'

create table shipment_events (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references tenants(id),
  shipment_id  uuid not null references shipments(id) on delete cascade,
  event_type   text not null,
  event_source text not null,
  occurred_at  timestamptz,
  summary      text not null,
  severity     text,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now()
);

create index shipment_events_shipment_idx  on shipment_events(shipment_id);
create index shipment_events_tenant_ts_idx on shipment_events(tenant_id, created_at desc);

alter table shipment_events enable row level security;

create policy "shipment_events: tenant isolation"
  on shipment_events for all
  using (tenant_id = get_my_tenant_id())
  with check (tenant_id = get_my_tenant_id());

-- ─── documents ───────────────────────────────────────────────────────────────
-- claim_id is a bare uuid with no FK — the claims table does not exist yet.
-- The FK constraint is added in the Week 2 migration via ALTER TABLE.
-- Nullable by design: documents may arrive before a claim is created.

create table documents (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              uuid not null references tenants(id),
  shipment_id            uuid references shipments(id),
  claim_id               uuid,             -- FK added in Week 2
  document_type          document_type not null default 'other',
  original_document_type document_type,    -- AI-classified before any operator override
  file_name              text not null,
  storage_path           text not null,    -- Supabase Storage path (immutable)
  mime_type              text not null,
  file_size_bytes        integer,
  checksum               text,             -- SHA-256 for dedup detection
  uploaded_by            uuid references auth.users(id),
  uploaded_at            timestamptz not null default now(),
  parsing_status         parsing_status not null default 'pending',
  extraction_confidence  numeric(4,3),     -- 0.000–1.000 from AI extractor
  created_at             timestamptz not null default now()
);

create index documents_tenant_idx         on documents(tenant_id);
create index documents_shipment_idx       on documents(shipment_id);
create index documents_claim_idx          on documents(claim_id);
create index documents_parsing_status_idx on documents(tenant_id, parsing_status);
create index documents_uploaded_at_idx    on documents(tenant_id, uploaded_at desc);

alter table documents enable row level security;

create policy "documents: tenant isolation"
  on documents for all
  using (tenant_id = get_my_tenant_id())
  with check (tenant_id = get_my_tenant_id());

-- ─── document_extractions ────────────────────────────────────────────────────
-- Stores AI extraction output. No tenant_id — always accessed through
-- documents join where tenant isolation is already enforced.
--
-- structured_data shape varies by document_type. Representative fields:
--   bol_number, pro_number, carrier, declared_value_cents, pieces,
--   weight_lbs, damage_noted (bool), damage_description, shortage_noted (bool),
--   shortage_description, driver_signature (bool), exceptions_noted (text[])

create table document_extractions (
  id                uuid primary key default gen_random_uuid(),
  document_id       uuid not null references documents(id) on delete cascade,
  extractor_name    text not null,     -- e.g. 'claude-sonnet-4-6'
  extractor_version text not null,     -- model or tool version string
  prompt_version    text,              -- semver of prompt template used
  raw_text          text,              -- full extracted / OCR text
  structured_data   jsonb not null default '{}',
  extraction_status text not null default 'complete',
  token_count       integer,
  created_at        timestamptz not null default now()
);

create index document_extractions_document_idx on document_extractions(document_id);

-- No RLS: no tenant_id column; tenant isolation enforced via documents join.

-- =============================================================================
-- Post-migration checklist (manual steps in Supabase dashboard):
--   1. Create Storage bucket named 'documents' (private)
--      Path: {tenant_id}/{shipment_id|'inbox'}/{document_id}/{filename}
--   2. Add Storage RLS policy:
--      allow authenticated reads where storage.foldername(name)[1] = get_my_tenant_id()::text
-- =============================================================================
