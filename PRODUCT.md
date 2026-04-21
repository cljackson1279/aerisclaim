# AerisClaim — Product Requirements

## Product Summary
AerisClaim is an operator-first, end-to-end freight claims recovery platform. Customers use it to identify, file, track, appeal, and report freight loss/damage/shortage claims. Internally, AerisClaim should support a managed-service operating model in which the founder or team can run claims on behalf of customers while accumulating structured data and workflow intelligence.

## Product Goals
1. Deliver a no-brainer end-to-end claims experience for customers.
2. Reduce claim leakage from missed documentation and missed deadlines.
3. Make claim recovery measurable in dollars, cycle time, and success rate.
4. Build the data foundation for carrier-specific intelligence.

## Primary Users
### Claims Manager
Needs:
- queue of claims requiring approval or review
- visibility into evidence completeness
- confidence that deadlines are being tracked
- appeal help when claims are denied

### Logistics / Operations Manager
Needs:
- insight into open exposure and stuck claims
- understanding of carrier problems
- less time spent on admin

### CFO / Finance
Needs:
- monthly recovered dollars report
- fee reconciliation
- confidence that claims process is being handled rigorously

### Internal Operator
Needs:
- ability to ingest and triage a large number of documents quickly
- claim creation workflow with minimal friction
- ability to store notes, tasks, statuses, and follow-ups
- visibility into what needs action today

## Core Jobs To Be Done
- Find claimable freight issues before they are missed.
- Assemble complete claim packets from fragmented documents.
- Move each claim through a disciplined workflow.
- Surface the next best action for every claim.
- Prove financial value to customers.

## Initial Product Scope
### Included
- customer + user auth
- shipment import (CSV/manual)
- document upload (PDF/image/email artifact)
- shipment detail pages
- claim candidate queue
- claim creation and editing
- evidence checklist / evidence panel
- draft claim generation
- claim status tracking
- appeal drafting
- carrier profiles and submission metadata
- recovery reports and exports
- internal notes and tasking

### Excluded from first serious build
- full self-serve onboarding
- automated integrations with every TMS
- universal automated carrier portal submission
- advanced ML scoring trained on live outcomes
- full accounting integrations

## Core Screens
1. Marketing / landing page
2. Login / tenant selection
3. Operator dashboard
4. Shipments list
5. Shipment detail
6. Documents inbox
7. Claim candidates queue
8. Claim detail workspace
9. Appeals / escalations workspace
10. Carrier profiles admin
11. Recovery reports
12. Customer-facing summary dashboard

## Functional Requirements
### Shipment ingestion
- upload CSV of shipments
- parse and map fields
- deduplicate or flag possible duplicates
- create shipment records

### Document ingestion
- upload PDF/image/email artifacts
- classify by type (BOL, POD, invoice, photo, inspection, tariff, correspondence)
- extract text and key metadata
- link to shipment/claim where possible

### Claim candidate generation
- create candidate claims from exceptions or document evidence
- track missing fields/evidence
- allow manual override/editing

### Claim workspace
- view source docs and extracted data
- edit claim amount, claim type, narrative
- generate claim draft
- track approval state and filing readiness

### Submission support
- store carrier submission method and instructions
- mark claims as prepared, submitted, acknowledged
- store submission evidence / references
- enable system to evolve toward automation later

### Appeals / escalations
- record declination reason
- generate appeal draft language
- track appeal submission and outcome

### Reporting
- monthly/quarterly recovery summary
- totals by carrier, customer, claim status
- exported report suitable for finance review

## Non-Functional Requirements
- strong multi-tenant isolation
- responsive UI, desktop-first
- robust audit log for claim actions
- secure document storage
- clear AI provenance where relevant
- high-trust design

## Success Metrics
- time from document upload to claim-ready packet
- % of claims filed before deadlines
- recovery dollars by customer
- claim cycle time
- operator throughput per day
- number of claims handled per customer

## Commercial Support Requirements
The product must support a contingency-based business model by making it easy to show:
- which claims AerisClaim handled
- recovered amounts
- fees due
- timeline of recovery
