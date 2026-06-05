# Stage 3 Admin Read Function Contract

Date: 2026-06-04

Purpose: define the server-side API shape for the internal dashboard before implementing admin reads.

Implementation checkpoint:

- `netlify/functions/lead-dashboard.js` implements the protected read-only API for `operon_leads`.
- It is not wired to the static `/admin` shell yet.
- It supports `action=list`, `action=detail`, and `action=summary`.
- It must keep file responses to safe metadata only and must not return storage bucket/path, signed URLs, raw OCR text, internal rates, supplier costs, margins, or pricing tables.

## Principles

- Admin UI reads through protected Netlify Functions only.
- Browser must not use direct Supabase `anon` selects for lead tables.
- Functions must validate admin access before querying.
- Responses should be enough for operations, but not expose private pricing internals.
- File responses should use safe metadata only; bucket/path hidden unless a future short-lived signed URL action is explicitly approved.

## `admin-leads-list`

Current endpoint:

- `/.netlify/functions/lead-dashboard?action=list`

Method:

- `GET`

Query params:

- `status`
- `source`
- `priority`
- `product_category`
- `suburb`
- `created_from`
- `created_to`
- `limit`
- `cursor`

Expected source coverage:

- `quote`
- `contact`
- `quote_review`
- `floorplan`
- `chatbot`

Expected source details for MVP fixtures:

- `direct_quote_submit`
- `product_handoff`
- `quick_check`
- `contact_form`
- `floorplan_handoff`
- `operator_request`

Response:

```json
{
  "ok": true,
  "leads": [
    {
      "id": "uuid",
      "created_at": "iso",
      "last_activity_at": "iso",
      "primary_source": "quote",
      "source_detail": "product_handoff",
      "status": "New",
      "priority": "normal",
      "customer_name": "Customer",
      "suburb": "Auburn",
      "postcode": "2144",
      "product_category": "hybrid",
      "area_m2": 60,
      "estimate_total_inc_gst": 3850,
      "confidence_level": "medium",
      "missing_info_count": 2,
      "risk_flag_count": 1,
      "next_action": "Review quote request"
    }
  ],
  "next_cursor": null
}
```

Do not include:

- Full raw payloads
- Raw OCR text
- Full chatbot transcript
- Storage paths
- Internal pricing/rate fields

## `admin-lead-detail`

Current endpoint:

- `/.netlify/functions/lead-dashboard?action=detail&lead_id=<uuid>`

Method:

- `GET`

Query params:

- `lead_id`

Response:

```json
{
  "ok": true,
  "lead": {
    "id": "uuid",
    "primary_source": "quote",
    "status": "Needs review",
    "priority": "high",
    "customer": {
      "name": "Customer",
      "email": "customer@example.com",
      "phone": "0400000000"
    },
    "project": {
      "suburb": "Auburn",
      "postcode": "2144",
      "product_category": "hybrid",
      "product_name": "Selected range",
      "area_m2": 60,
      "estimated_order_area_m2": 66
    },
    "quote": {
      "estimate_total_inc_gst": 3850,
      "confidence_score": 72,
      "confidence_level": "medium",
      "missing_info_flags": [],
      "risk_flags": []
    },
    "floorplan": {
      "status": "none",
      "area_method": "",
      "confidence_level": "",
      "missing_info_flags": []
    },
    "statuses": {
      "quote_review_status": "none",
      "floorplan_status": "none",
      "contact_status": "customer_and_internal_email_sent",
      "follow_up_status": "queued"
    },
    "next_action": "Confirm flooring quote and follow up"
  },
  "events": [],
  "notes": [],
  "files": []
}
```

## `admin-lead-events`

Method:

- `GET`

Query params:

- `lead_id`
- `limit`

Returns:

- Event type
- Created date
- Source
- Source table/id
- Customer-safe metadata

## `admin-lead-files`

Method:

- `GET`

Query params:

- `lead_id`

Returns:

- Safe filename
- File role
- Type
- Size
- Created date
- Storage status

Does not return:

- Bucket
- Path
- Public URL
- Signed URL by default

## `admin-reports-summary`

Current endpoint:

- `/.netlify/functions/lead-dashboard?action=summary`

Method:

- `GET`

Returns:

- Lead count by status
- Lead count by source
- Lead count by product category
- Lead count by suburb
- Quote-review count
- Floorplan/upload count
- Open high-priority count

## Error Contract

Unauthenticated:

```json
{ "ok": false, "error": "Admin authentication required." }
```

Unauthorized:

```json
{ "ok": false, "error": "Admin access denied." }
```

Server unavailable:

```json
{ "ok": false, "error": "Dashboard data is temporarily unavailable." }
```

## Test Requirements Before Coding

- Unauthenticated function call returns 401/403.
- Authenticated function call returns only allowed fields.
- Fixture coverage follows `STAGE3_ADMIN_LIST_DETAIL_FIXTURE_PLAN.md`.
- Response field scan blocks storage paths, OCR text, pricing internals, and service tokens.
- Existing public website functions remain unaffected.
