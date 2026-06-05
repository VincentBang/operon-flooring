# Stage 4 Shared Types Package Plan

Date: 2026-06-04

Purpose: define the shared Operon OS schema boundary before creating a shared package.

## Goal

Create reusable types for Flooring first, then Kitchens, without leaking private pricing data to public frontend code.

## Proposed Package

Future location:

- `packages/operon-os-types`

Do not create this package until Stage 3 admin MVP is stable.

## Shared Entities

### `Lead`

Customer/project pipeline parent.

Customer-safe fields:

- `id`
- `vertical`
- `primarySource`
- `sourceDetail`
- `status`
- `priority`
- `customerName`
- `email`
- `phone`
- `suburb`
- `postcode`
- `productCategory`
- `estimateTotalIncGst`
- `confidenceLevel`
- `missingInfoFlags`
- `riskFlags`
- `nextAction`
- `createdAt`
- `updatedAt`
- `lastActivityAt`

Private/internal fields should stay server/admin-only.

### `Customer`

Reusable customer identity shape.

- `name`
- `email`
- `phone`
- `preferredContactMethod`
- `suburb`
- `postcode`

### `Project`

Vertical-specific project facts.

Flooring:

- `propertyType`
- `productCategory`
- `productName`
- `areaM2`
- `estimatedOrderAreaM2`
- `stairs`
- `removal`
- `disposal`
- `floorPrep`

Kitchens future:

- `kitchenType`
- `layout`
- `cabinetScope`
- `benchTopScope`
- `applianceScope`
- `siteMeasureNeeded`

### `Quote`

Customer-safe quote output.

- `quoteId`
- `quoteReference`
- `estimateTotalIncGst`
- `subtotalExGst`
- `gst`
- `lineItems`
- `assumptions`
- `exclusions`
- `confidenceScore`
- `confidenceLevel`
- `reviewFlags`
- `nextStep`

Must not include:

- Internal rates
- Supplier costs
- Margins
- Access multipliers
- Private pricing rules

### `QuoteReview`

- `reviewId`
- `reviewMode`
- `readinessScore`
- `confidenceLevel`
- `clearItems`
- `missingItems`
- `riskFlags`
- `questionsToAsk`
- `safeSummary`
- `handoffStatus`

Must not include raw OCR text in public/browser-safe shapes.

### `Upload`

Customer/admin-safe file metadata.

- `uploadedFileId`
- `safeFilename`
- `fileType`
- `fileSizeBytes`
- `status`
- `source`
- `createdAt`

Must not include:

- Storage bucket
- Raw storage path
- Permanent public URL
- Signed URL by default

### `FollowUp`

- `followUpId`
- `leadId`
- `status`
- `dueAt`
- `channel`
- `nextAction`
- `assignedTo`

### `SourceEvent`

- `eventId`
- `leadId`
- `eventType`
- `source`
- `sourceTable`
- `sourceId`
- `metadata`
- `createdAt`

Metadata must pass the lead writer redaction contract.

## Public vs Admin Type Boundary

Public browser types:

- Customer-safe quote output
- Safe product/category display
- Safe upload status
- Safe quote-review summary

Admin-only types:

- Lead detail
- Timeline
- Notes
- Follow-ups
- File metadata
- Internal source-event metadata

Server-only types:

- Pricing inputs
- Pricing support tables
- Private storage paths
- Raw OCR processing text
- Service-role config

## Implementation Phases

1. Document types and contracts.
2. Add JSON-schema fixtures for public quote, upload, and lead responses.
3. Create shared package only after schemas stabilize.
4. Migrate Netlify Functions to consume shared server-safe schemas.
5. Migrate public UI to consume browser-safe schemas.

## First Guardrail

Before creating a package, keep contract tests in `internal-qa/tests/web` as the source of truth so runtime behavior stays stable.
