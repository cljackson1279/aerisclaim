# AerisClaim — Data Model

## Modeling Principles
1. Multi-tenant everywhere.
2. Preserve raw inputs alongside normalized data.
3. Separate source documents from extracted facts.
4. Capture state transitions as events.
5. Make every claim outcome usable for future learning.

## Core Tables

### tenants
- id
- name
- slug
- vertical
- created_at
- updated_at

### users
- id
- tenant_id
- email
- full_name
- role (operator, claims_manager, logistics_manager, finance, admin)
- created_at
- updated_at

### carriers
- id
- name
- scac
- mode
- active
- created_at
- updated_at

### carrier_profiles
- id
- tenant_id (nullable for global default profiles)
- carrier_id
- submission_method (email, portal, api, manual)
- submission_endpoint
- submission_instructions
- required_documents jsonb
- required_fields jsonb
- internal_notes
- created_at
- updated_at

### shipments
- id
- tenant_id
- external_reference
- carrier_id
- bol_number
- pro_number
- origin_name
- origin_city
- origin_state
- destination_name
- destination_city
- destination_state
- ship_date
- delivery_date
- freight_mode
- commodity_description
- nmfc_class
- packaging_type
- invoice_value_cents
- freight_charges_cents
- status
- created_at
- updated_at

### shipment_events
- id
- tenant_id
- shipment_id
- event_type (damage, shortage, loss, delay, exception, customer_complaint)
- event_source (pod_note, email, manual, photo_review, import)
- occurred_at
- summary
- severity
- created_at

### documents
- id
- tenant_id
- shipment_id nullable
- claim_id nullable
- document_type (bol, pod, invoice, photo, inspection, tariff, email, other)
- file_name
- storage_path
- mime_type
- uploaded_by
- uploaded_at
- parsing_status
- extraction_confidence
- checksum

### document_extractions
- id
- document_id
- extractor_name
- extractor_version
- raw_text
- structured_data jsonb
- extraction_status
- created_at

### claim_candidates
- id
- tenant_id
- shipment_id
- source_event_id
- candidate_type (damage, shortage, loss)
- confidence_score
- estimated_claim_value_cents
- evidence_completeness_score
- missing_evidence jsonb
- recommendation_summary
- status (new, reviewed, converted, dismissed)
- created_at
- updated_at

### claims
- id
- tenant_id
- shipment_id
- source_candidate_id nullable
- carrier_id
- claim_number nullable
- claim_type
- filing_basis
- claim_amount_cents
- settlement_amount_cents nullable
- status (draft, ready, submitted, acknowledged, partial_paid, paid, denied, appealed, closed)
- priority_score
- claim_deadline_at nullable
- legal_deadline_at nullable
- submitted_at nullable
- acknowledged_at nullable
- settled_at nullable
- denied_at nullable
- owner_user_id nullable
- created_by
- created_at
- updated_at

### claim_events
- id
- tenant_id
- claim_id
- event_type (created, updated, submitted, acknowledged, denied, appealed, paid, note_added, document_added)
- actor_type (user, system)
- actor_id nullable
- metadata jsonb
- created_at

### claim_evidence
- id
- tenant_id
- claim_id
- document_id
- evidence_type
- required boolean
- present boolean
- notes
- created_at

### claim_drafts
- id
- tenant_id
- claim_id
- draft_type (initial_claim, follow_up, appeal, escalation)
- model_name
- prompt_version
- content_markdown
- content_json nullable
- review_status (generated, edited, approved, sent)
- created_by_type (system, user)
- created_by_id nullable
- created_at
- updated_at

### submissions
- id
- tenant_id
- claim_id
- carrier_profile_id nullable
- submission_method
- submitted_by_type (system, user)
- submitted_by_id nullable
- submitted_at
- reference_id nullable
- destination
- payload_snapshot jsonb
- response_snapshot jsonb
- status

### carrier_responses
- id
- tenant_id
- claim_id
- submission_id nullable
- response_type (acknowledgement, request_for_info, denial, partial_offer, approval)
- received_at
- summary
- raw_content
- parsed_data jsonb
- created_at

### appeals
- id
- tenant_id
- claim_id
- basis
- status (draft, ready, submitted, resolved)
- submitted_at nullable
- resolved_at nullable
- outcome nullable
- created_at
- updated_at

### outcomes
- id
- tenant_id
- claim_id
- outcome_type (paid, partial_paid, denied, write_off)
- recovered_amount_cents
- settlement_method (check, ach, credit, offset, unknown)
- outcome_reason
- recorded_by
- recorded_at

### tasks
- id
- tenant_id
- claim_id nullable
- shipment_id nullable
- assigned_to nullable
- title
- description
- task_type
- due_at
- status
- created_at
- updated_at

### model_feedback
- id
- tenant_id
- claim_id nullable
- claim_draft_id nullable
- model_name
- model_version
- feedback_type (accepted, edited, rejected)
- edit_distance_metric nullable
- notes
- created_by
- created_at

## Relationships
- tenant has many users, shipments, claims, documents, tasks
- shipment belongs to tenant and carrier
- shipment has many shipment_events and documents
- claim belongs to tenant, shipment, carrier
- claim has many claim_events, claim_evidence, claim_drafts, submissions, carrier_responses, appeals, outcomes
- document may belong to shipment and/or claim
- carrier_profile belongs to carrier and may be tenant-specific

## Derived / Future Analytics
- carrier denial rate by claim_type
- response time by carrier
- appeal success rate by carrier + commodity
- evidence completeness vs settlement outcome
- claim cycle time by carrier
- recovered amount vs claim amount

## Notes on Learning Layer
Store enough structured context so future models can learn from:
- carrier behavior
- document completeness
- claim narratives
- appeal language
- time-to-submit
- time-to-response
- settlement outcomes
