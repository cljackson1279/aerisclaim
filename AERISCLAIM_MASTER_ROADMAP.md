# AerisClaim Master Build Roadmap

AerisClaim should be built as an end-to-end freight claims recovery operating system, not as a thin SaaS dashboard. The platform’s core value is handling the claims workflow from ingestion through recovery while compounding structured operating data that improves drafting, routing, submission, response handling, appeals, and reporting over time.

This document is the master reference for what AerisClaim must include, in what order it should be built, and how each phase contributes to the long-term moat and product quality.

## Product objective
AerisClaim exists to recover freight claim dollars that shippers, distributors, and brokers currently miss because their claims process is fragmented across email, spreadsheets, PDFs, portals, and tribal knowledge. The finished product should feel like a premium operations system: high-trust, highly structured, fast for operators, and financially legible for claims managers, logistics leaders, and finance stakeholders.

## Phase map
- Foundation Phase
- V1 Operator-first MVP
- Phase 2 Operational Scale and Automation
- Phase 3 Intelligence Moat and System-of-Record Maturity
- Phase 4 Platform Expansion and Category Leadership
- Final State

## Build order by priority
### Tier 1 — Build first
- canonical docs and memory structure
- design system and visual direction
- marketing landing page
- app shell
- auth and multi-tenant setup
- base schema and migrations
- shipments list/detail
- document upload and inbox
- claim candidate queue
- claim detail workspace
- deadlines / status engine
- draft generation
- event timeline and notes
- reporting basics

### Tier 2 — Build next
- submission records
- carrier profiles admin
- manual/email submission flows
- appeal workflow
- customer summary dashboard
- exportable reports
- alerts and daily digest
- bulk operator tools

### Tier 3 — Build after pilots
- response parsing
- richer automation adapters
- browser automation for select carriers
- advanced reporting
- operator workload balancing
- better onboarding and approval flows

### Tier 4 — Build once data starts compounding
- carrier intelligence dashboards
- predictive scoring
- tariff version intelligence
- claim quality evaluations
- finance reconciliation depth
- pre-shipment risk scoring

### Tier 5 — Expansion
- parcel workflows
- detention/accessorial modules
- dock capture mobile experience
- insurer/data products
- broker-specific workflow version

## Immediate next steps
1. Keep this roadmap in the repo root or `/docs/strategy/`.
2. Use it alongside CLAUDE.md, PRODUCT.md, DATA_MODEL.md, and WORKFLOWS.md.
3. Build in this order:
   - marketing site + app shell
   - auth + schema
   - shipment/document ingestion
   - claim candidate queue
   - claim detail and drafting
   - deadlines/status/events
   - reporting
   - submission/appeals
