# AerisClaim — Core Workflows

## Workflow 1: Customer Onboarding
1. Create tenant.
2. Invite internal and customer users.
3. Configure carrier profiles and preferred submission methods.
4. Upload initial shipment history and documents.
5. Review import mapping and create baseline dataset.

## Workflow 2: Shipment & Document Ingestion
1. Operator uploads shipment CSV and/or creates shipment manually.
2. Operator uploads associated documents (BOL, POD, invoice, photos, inspection, emails).
3. System classifies documents and extracts structured fields.
4. Operator reviews unmatched documents and links them to shipments.
5. System updates shipment completeness state.

## Workflow 3: Claim Candidate Identification
1. System scans shipments, events, and document extractions.
2. System generates claim candidate with confidence score and missing evidence list.
3. Operator reviews queue sorted by urgency/value.
4. Operator converts candidate into claim or dismisses it.
5. Claim enters draft state.

## Workflow 4: Claim Preparation
1. Claim workspace shows shipment details, source documents, extracted facts, evidence checklist, and deadlines.
2. System generates draft claim narrative and supporting packet.
3. Operator edits claim amount, narrative, and evidence links.
4. Operator marks claim as ready for approval or filing.
5. Customer reviewer optionally approves.

## Workflow 5: Claim Submission
1. System reads carrier profile for submission instructions.
2. If submission method is automated email/API, system prepares payload and submits.
3. If manual/portal, system prepares packet + instructions and operator or customer completes submission.
4. Submission record is created with method, timestamp, and reference.
5. Claim status moves to submitted.

## Workflow 6: Acknowledgement & Follow-up
1. Carrier acknowledgement or response is uploaded/parsed.
2. System updates claim status and next actions.
3. If carrier requests more information, system creates follow-up task.
4. Operator sends additional evidence or clarification.
5. Claim remains active until resolution.

## Workflow 7: Denial, Appeal, Escalation
1. Carrier denies claim or offers partial settlement.
2. Operator records or uploads denial reason.
3. System generates appeal draft with evidence references.
4. Operator reviews and submits appeal.
5. Appeal outcome is tracked separately but linked to claim.

## Workflow 8: Settlement Recording
1. Customer or operator records payment / credit / offset.
2. Outcome record is created.
3. Claim status moves to partial_paid, paid, denied, or closed.
4. Recovery reports update automatically.

## Workflow 9: Recovery Reporting
1. System aggregates claims by status, carrier, and outcome.
2. Operator/customer views monthly or quarterly recovery report.
3. Report includes recovered dollars, outstanding claims, and fee basis.
4. Data can be exported for finance review.

## Workflow 10: Learning Loop
1. Every draft, edit, submission, response, and outcome is stored.
2. Human edits to AI drafts are captured as feedback.
3. Carrier patterns become analyzable over time.
4. Product evolves toward stronger automation and prediction.

## Operator-First Principle
Even when automation is incomplete, AerisClaim must make the operator dramatically faster by:
- centralizing evidence
- reducing drafting work
- surfacing next actions
- preserving audit trails
- making claims review and reporting simple
