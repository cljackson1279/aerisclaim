# AerisClaim — AGENTS.md

## Project identity
AerisClaim is a freight claims recovery operating system for shippers, distributors, and brokers. It ingests shipment and claims documents, identifies claimable freight issues, drafts packets, supports filing, tracks outcomes, and generates recovery reporting.

## Canonical docs
Always treat these files as the primary source of truth:
- CLAUDE.md
- PRODUCT.md
- DATA_MODEL.md
- WORKFLOWS.md
- AERISCLAIM_MASTER_ROADMAP.md

If code or UI appears to conflict with these files, stop and reconcile before continuing.

## Project memory
Use `docs/project_notes/` to record:
- design decisions
- schema decisions
- workflow decisions
- parsing edge cases
- bugs and regressions
- follow-up tasks

Create or update a note whenever a meaningful architectural or UX decision is made.

## Skill usage rules
### Built-in skill
Use `website-building` whenever working on:
- marketing site
- hero section
- app shell
- dashboard layout
- typography
- spacing
- motion
- visual refinement

### Custom skills
Use `app-design-review` when reviewing or refining any AerisClaim UI.
Use `claim-packet-drafting` when building claim workspace, packet views, or draft-generation flows.
Use `shipment-doc-extraction` when building import, upload, OCR, extraction, or document review experiences.
Use `deadline-and-status` when implementing deadlines, reminders, state transitions, escalations, or claim lifecycle logic.

## UX rules
- This is not a chatbot product.
- The AI should feel invisible and operational, not gimmicky.
- Prioritize operator speed, clarity, trust, and auditability.
- Show evidence and decisions clearly.
- Prefer dense, readable enterprise layouts over oversized cards.

## Design rules
- Avoid AI slop.
- Avoid gradients, glassmorphism, neon accents, decorative blobs, generic 3-column startup sections, and centered-everything layouts.
- Use a restrained palette with one accent color.
- Use clear typography and clean data presentation.
- Motion should be subtle, useful, and professional.
- The landing page hero should communicate workflow and control, not abstract AI magic.

## Engineering rules
- Preserve multi-tenant architecture.
- Preserve auditability.
- Store raw files and normalized outputs separately.
- Keep status transitions explicit.
- Do not overbuild speculative features before core workflows are working.

## Delivery rules
When asked to build something substantial:
1. Read the canonical docs.
2. Restate the goal and constraints.
3. Identify which skills apply.
4. Produce a scoped implementation plan.
5. Build in small verifiable steps.
6. Summarize what was changed and what still needs work.
