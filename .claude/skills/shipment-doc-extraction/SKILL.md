# Skill: shipment-doc-extraction

## Purpose
Use this skill when building document ingestion, extraction, classification, and manual review flows for shipment-related documents.

## Document families
- bill of lading (BOL)
- proof of delivery / POD
- invoice
- damage photo
- inspection report
- tariff document
- carrier email / correspondence

## Goals
- Preserve raw files
- Extract useful structured data
- Show extraction confidence
- Support human review and correction
- Link documents to shipments and claims

## Principles
1. Raw files are the ground truth.
2. Extraction confidence should be visible.
3. Unmatched docs should be easy to review.
4. Human correction should be fast.
5. Parsing architecture should support multiple providers.
