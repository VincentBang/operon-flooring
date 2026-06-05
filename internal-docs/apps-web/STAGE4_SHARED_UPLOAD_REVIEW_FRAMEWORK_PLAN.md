# Stage 4 Shared Upload / Review Framework Plan

Date: 2026-06-04

Purpose: define a reusable upload/review pattern for Flooring, Kitchens, and future Operon verticals.

## Goal

Create one safe pattern for:

- Quote uploads
- Floorplan uploads
- OCR/review
- Customer-safe summaries
- Dashboard records
- Customer emails

## Current Flooring Inputs

- Quote-review uploaded quotes
- Quote form customer uploads
- Floorplan uploads
- Future chatbot/operator attachments

## Target Flow

1. Browser uploads through a Netlify Function.
2. Function validates MIME, signature, and size.
3. Function writes private storage object using service-role credentials.
4. Function writes safe file metadata.
5. Browser receives `uploaded_file_id`, status, safe filename/type/size only.
6. Optional OCR/review runs server-side.
7. Browser receives customer-safe summary only.
8. Admin dashboard sees safe metadata and review status.
9. Any file access is protected and short-lived.

## Browser-Safe Response

Allowed:

- `ok`
- `uploaded_file_id`
- `status`
- `safe_filename`
- `file_type`
- `file_size_bytes`
- `metadata_saved`
- `review_status`
- `safe_summary`

Forbidden:

- Storage bucket
- Storage path
- Permanent public URL
- Signed URL by default
- Raw OCR text
- Raw quote text
- Internal extraction prompts
- Service-role config

## Review Output Shape

```json
{
  "status": "reviewed",
  "confidence": "medium",
  "document_quality": "readable",
  "safe_summary": "The document includes product and total price, but area and removal scope need confirmation.",
  "missing_items": [],
  "risk_flags": [],
  "questions_to_ask": []
}
```

## Admin Dashboard Shape

- Lead ID
- Uploaded file ID
- Safe filename
- File type
- Size
- Source
- Review status
- Confidence
- Missing items
- Risk flags
- Next action

## Vertical Reuse

Flooring:

- Quote scope review
- Floorplan measurement review

Kitchens:

- Kitchen plan upload
- Supplier quote review
- Cabinet/benchtop/appliance scope review

Future trades:

- Scope document upload
- Photo/document review

## Non-Goals

- No public file browsing.
- No customer file library.
- No permanent signed URLs.
- No raw OCR display.
- No automatic contractor dispatch.

## Tests Before Implementation

- Upload response does not return bucket/path.
- OCR response does not return raw extracted text.
- Admin file response uses safe metadata.
- Public leak probes pass.
- Storage anon list/read probes fail.
