# AerisClaim — Claude Context

## Mission
AerisClaim is an end-to-end freight claims recovery operating system for shippers, distributors, and brokers. It ingests shipment data, bills of lading, PODs, damage photos, invoices, carrier correspondence, and tariff documents; identifies claimable loss/damage/shortage events; drafts and supports submission of claims; tracks deadlines and outcomes; and generates recovery reporting.

AerisClaim is not generic claims software. It is a revenue recovery engine and system of record for freight claims operations.

## Product Positioning
- Primary promise: Recover freight claim dollars customers are currently missing.
- Secondary promise: Remove manual claims admin and deadline risk.
- Strategic promise: Become the default operating system for freight recovery intelligence.

## Core Principles
1. Sell outcomes, not seats.
2. Optimize for operator throughput and claim recovery, not feature breadth.
3. Every workflow must create reusable structured data.
4. Every claim should improve the system.
5. Human-in-the-loop is acceptable in early versions if the customer experience is still end-to-end.
6. Avoid AI slop in both UX and product behavior; the app should feel rigorous, calm, and trustworthy.

## Ideal Customer Profile
### Primary ICP
- US-based mid-market shippers and distributors
- $20M–$500M revenue
- Frequent LTL freight usage
- 1–5 people handling freight claims, logistics exceptions, or customer freight issues
- Sectors: furniture/home goods, flooring/building products, food & beverage distribution, industrial/MRO distribution

### Secondary ICP
- Regional 3PLs and freight brokers who manage claims for multiple customers

## User Roles
### Internal Roles
- Founder / Operator: reviews claim candidates, validates drafts, updates status, handles escalations
- Internal Analyst (future): supports claim review, filing, carrier follow-up

### External Roles
- Claims Manager: reviews claims, approves filing, monitors status
- Logistics Manager / VP Logistics: monitors open exposure and recoveries
- CFO / Finance user: reviews recovered dollars, write-off prevention, and fee reconciliation

## Product Scope
AerisClaim should feel end-to-end from the first serious version. That means:
- ingest shipments and supporting documents
- detect likely claimable events
- create claim packets
- support submission workflows
- track claim state changes
- support appeals/escalations
- record settlement outcomes
- produce customer-facing recovery reports

Early versions may use human-in-the-loop operations behind the scenes where carrier submission methods are inconsistent.

## What Success Looks Like
For the customer:
- They can hand over shipment/doc data and have AerisClaim run the process.
- They can see what was filed, what is at risk, what was recovered, and what is owed.
- They feel the product is faster, more disciplined, and more reliable than their internal process.

For AerisClaim:
- Every claim stores structured evidence, decision rationale, human edits, and outcomes.
- Recovery reports are trustworthy enough for finance review.
- New customer onboarding becomes easier as carrier and document knowledge compounds.

## Product Capabilities
### Required in initial build
- Auth and tenant-aware access
- Shipment import / manual creation
- Document upload and classification
- Claim candidate generation
- Claim workspace with evidence bundle
- Draft claim text generation
- Claim status pipeline
- Appeal/escalation workspace
- Recovery reporting
- Carrier profile management

### Important but can be partially manual initially
- Claim submission routing by carrier
- Carrier response ingestion
- Settlement reconciliation

## Design Direction
AerisClaim should look like an enterprise control system, not generic SaaS.

### Visual goals
- calm, high-trust, premium enterprise aesthetic
- neutral palette, restrained accent usage
- dense but readable layouts
- excellent table/pipeline usability
- left-aligned content, minimal decorative flourish
- no blue-purple gradients, no floating marketing-card template aesthetics

### UX goals
- Fast path to today’s most important claims
- Strong evidence visibility
- Clear deadlines and next actions
- CFO-readable reporting
- Minimal clicks for operators

## Architecture Preferences
- Frontend: Next.js on Vercel
- Backend/data: Supabase Postgres + Storage + Auth
- Background jobs: Inngest preferred initially; Trigger.dev acceptable
- AI layer: Claude via API for extraction, drafting, summarization, and workflow support
- Observability: Sentry, PostHog
- OCR / parsing: support pluggable providers; store raw output + normalized output

## Non-Negotiables
- Multi-tenant from day one
- Auditability of claim actions
- Structured state transitions
- Raw files always preserved
- Every AI-generated artifact traceable to source docs
- No irreversible automation without human review in early versions

## Longer-Term Vision
AerisClaim evolves from freight loss/damage claims into the operating system for freight leakage recovery:
- parcel claims
- OS&D workflows
- detention/accessorial disputes
- carrier scorecards
- claims intelligence data products
- insurance-adjacent analytics
