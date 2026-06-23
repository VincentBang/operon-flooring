# Operon Flooring Floorplan Phase 2 Internal Review Console Plan

Date: 2026-06-23

Scope: plan only. No code, migration, deploy, or production setting change is included here.

## Objective

Build an admin-only internal console for reviewing floorplan uploads and measured areas before Operon relies on them operationally.

The public `/floorplan.html` tool already lets customers measure an area and hand it to the quote form. Phase 2 turns that customer-side measurement into a private, reviewable, versioned operating workflow.

## Why This Comes Before Detection

Automatic or semi-automatic detection should not be the next production step. The next value step is reviewer control:

- humans need to see the uploaded plan
- humans need to inspect rooms and included/excluded zones
- humans need to correct scale or geometry
- the system needs a history of what changed and why
- quote handoff needs a reviewed measurement version, not only browser-local state

Detection can then become a suggestion source inside the console, not an unreviewed customer-facing truth.

## Proposed User Flow

1. Customer uploads a floorplan or uses `/floorplan.html`.
2. Public upload stores the file privately and returns `uploaded_file_id`.
3. Customer may trace rooms and send area into quote as today.
4. Save/quote/contact flow links the upload and quote lead where context exists.
5. Internal operator opens the floorplan review queue.
6. Operator opens a measurement session.
7. Operator views the plan through a short-lived signed internal URL.
8. Operator reviews scale, rooms, included/excluded areas and confidence.
9. Operator creates a reviewed measurement version.
10. Reviewed version can be linked to the lead, quote request, or follow-up task.

## Route Proposal

Preferred short-term route:

- `/admin.html` module or tab: `Floorplan reviews`

Reason:

- existing admin token gate already exists
- avoids a public-looking `/internal/...` route during early stage
- keeps admin UX in one place

Future route after stronger admin auth:

- `/admin/floorplan-measurements.html`

Do not create an indexable public route. Any static admin page must be protected by server-side function access and should not expose data in generated HTML.

## Admin Console MVP

### Queue Table

Fields:

- created time
- lead reference
- customer name if available
- suburb
- source page
- uploaded file safe name
- file type
- measurement status
- confidence
- estimated area
- reviewed area
- next action

Filters:

- status
- source
- confidence
- file type
- date range
- needs review

### Detail View

Show:

- private plan preview via admin-only signed URL
- uploaded file safe metadata
- customer floorplan rooms if available
- quote request link if matched
- lead timeline
- current measurement status
- current reviewed version
- reviewer notes
- follow-up recommendation

Never show:

- storage bucket
- raw storage path
- service-role data
- private pricing/rates
- raw uploaded file contents in logs

### Reviewer Tools

MVP tools:

- view plan
- set or correct scale
- add room polygon
- edit polygon points
- include/exclude room
- label room
- record confidence
- create reviewed version
- mark session reviewed

Not Phase 2 MVP:

- auto-detection model
- customer-visible reviewed report
- automatic follow-up messages
- automatic quote recalculation from internal version without explicit workflow approval

## Data Model Draft

All tables should be additive, RLS enabled, and service-role/admin-only.

### `operon_floorplan_measurement_sessions`

Purpose: one measurement workflow for one uploaded floorplan/lead context.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `lead_id uuid null references public.operon_leads(id)`
- `quote_request_id uuid null`
- `uploaded_file_id uuid null references public.operon_uploaded_files(id)`
- `floorplan_review_id uuid null references public.operon_floorplan_reviews(id)`
- `source text not null default 'floorplan_tool'`
- `status text not null default 'new'`
- `customer_handoff_area_m2 numeric`
- `current_reviewed_area_m2 numeric`
- `confidence_level text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `metadata jsonb not null default '{}'::jsonb`

Status values:

- `new`
- `needs_review`
- `reviewing`
- `reviewed`
- `sent_to_quote`
- `archived`

### `operon_floorplan_measurement_pages`

Purpose: page/image metadata, especially for PDFs.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade`
- `page_index integer not null default 0`
- `page_label text`
- `source_width_px integer`
- `source_height_px integer`
- `render_width_px integer`
- `render_height_px integer`
- `rotation_degrees numeric`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

### `operon_floorplan_measurement_versions`

Purpose: immutable snapshots of reviewer/customer measurement state.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade`
- `version_number integer not null`
- `source text not null`
- `status text not null default 'draft'`
- `total_included_area_m2 numeric not null default 0`
- `scale_status text`
- `scale_confidence text`
- `reviewer_id text`
- `reviewer_notes text`
- `created_at timestamptz not null default now()`
- `metadata jsonb not null default '{}'::jsonb`

Source values:

- `customer_trace`
- `operator_review`
- `quick_room_suggestion`
- `detection_candidate`

Status values:

- `draft`
- `reviewed`
- `approved`
- `superseded`

Unique index:

- `(session_id, version_number)`

### `operon_floorplan_measurement_sections`

Purpose: room/zone geometry for a version.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `version_id uuid not null references public.operon_floorplan_measurement_versions(id) on delete cascade`
- `page_id uuid null references public.operon_floorplan_measurement_pages(id)`
- `section_type text not null default 'room'`
- `label text`
- `include_in_quote boolean not null default true`
- `area_m2 numeric not null default 0`
- `confidence_level text`
- `geometry jsonb not null`
- `created_at timestamptz not null default now()`
- `metadata jsonb not null default '{}'::jsonb`

Geometry shape:

```json
{
  "type": "polygon",
  "coordinate_space": "normalized_page",
  "points": [
    { "x": 0.12, "y": 0.22 },
    { "x": 0.41, "y": 0.22 },
    { "x": 0.41, "y": 0.45 },
    { "x": 0.12, "y": 0.45 }
  ],
  "scale": {
    "pixels_per_metre": 100,
    "known_distance_m": 4.4,
    "status": "verified"
  }
}
```

Use normalized page coordinates for persisted geometry. Avoid storing only canvas pixel coordinates because future preview sizes, rendered PDF pages and device sizes will vary.

### `operon_floorplan_review_events`

Purpose: audit trail.

Suggested columns:

- `id uuid primary key default gen_random_uuid()`
- `session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade`
- `version_id uuid null references public.operon_floorplan_measurement_versions(id)`
- `event_type text not null`
- `actor_type text not null default 'system'`
- `actor_id text`
- `created_at timestamptz not null default now()`
- `metadata jsonb not null default '{}'::jsonb`

Event examples:

- `session_created`
- `file_linked`
- `customer_handoff_received`
- `review_started`
- `scale_updated`
- `section_added`
- `section_removed`
- `version_created`
- `version_approved`
- `sent_to_quote`
- `archived`

## API / Function Plan

### `floorplan-measurement-session.js`

Purpose:

- create or upsert internal session for floorplan upload/quote context
- record customer handoff area and sanitized room list
- no public storage path in response

Public website use:

- allowed only with safe payload and existing upload/lead context
- returns only `ok`, `session_id`, `status`

### `admin-floorplan-measurements.js`

Purpose:

- protected read endpoint for queue and detail data
- requires admin token/auth
- returns safe operational rows

Must not return:

- storage path
- bucket
- service role values
- private pricing data

### `admin-floorplan-file-url.js`

Purpose:

- generate short-lived signed URL for the private uploaded file
- admin-only
- log safe event, not the raw path

Response:

- `ok`
- `url`
- `expires_in`

### `admin-floorplan-version.js`

Purpose:

- create measurement version
- validate geometry
- recalculate area server-side
- save immutable version and sections

### `admin-floorplan-status.js`

Purpose:

- update session status
- add review event
- optionally create dry-run follow-up task

## Server-Side Geometry Validation

Before approving any reviewed measurement version:

1. Validate geometry type and coordinate space.
2. Require at least three polygon points per included section.
3. Clamp normalized coordinates between 0 and 1.
4. Reject self-intersections if utility exists, otherwise flag for manual review.
5. Recalculate area server-side from normalized coordinates and scale.
6. Compare client area versus server area.
7. Flag differences beyond tolerance.
8. Store server-calculated area as authoritative for reviewed versions.

## RLS And Permission Model

Default:

- enable RLS on all new tables
- revoke all from `anon`
- revoke all from `authenticated` until real admin auth is implemented
- grant service-role access for Netlify Functions

Public users can:

- upload via function
- submit quote/floorplan metadata via safe function endpoints
- receive customer-safe IDs/status only

Public browser must never receive:

- storage bucket
- storage path
- permanent URL
- service-role token
- raw uploaded file contents
- private pricing/rate/margin/cost fields

Admin can see:

- safe lead/contact context
- uploaded plan through short-lived signed URL
- measurement geometry
- reviewed versions
- notes and status

Admin access should be through protected server functions. Do not directly expose Supabase tables to the browser.

## Rollout Plan

### Step 1 - Read-Only Queue

- add schema draft
- build admin endpoint
- list sessions/reviews using existing uploads/leads where possible
- no editing yet

### Step 2 - Detail View

- admin signed file view
- safe metadata panel
- customer handoff rooms if available
- lead/quote links

### Step 3 - Version Creation

- allow operator to create a reviewed version
- store sections
- server-calculate area
- add audit event

### Step 4 - Quote Linkage

- reviewed area can be marked ready for quote
- do not auto-change quote pricing
- operator explicitly uses reviewed version in internal workflow

### Step 5 - Follow-Up Dry Run

- if area missing or low confidence, create internal follow-up recommendation
- no automatic email/SMS

## Tests

Add tests for:

- public access denied to admin endpoints
- admin token required
- no bucket/path in admin queue list
- signed URL endpoint returns short-lived URL only after admin auth
- valid geometry accepted
- malformed geometry rejected
- server recalculation matches expected rectangle and L-shape
- version numbers increment
- superseded versions remain readable
- quote handoff remains unchanged
- no anon Supabase grants on new tables

## Acceptance Criteria

Phase 2 is complete when:

- operators can see a floorplan review queue
- operators can open a safe detail view
- private file access is admin-only and short-lived
- reviewed measurement versions can be created
- versions store room geometry and area
- server-side area recalculation exists
- quote linkage is explicit and safe
- public floorplan/quote flow still works
- no pricing, storage path, OCR, or uploaded file content leaks to public browser

## Out Of Scope

- production deploy
- auto-detection
- third-party plan AI
- automatic customer emails
- customer account/login
- contractor marketplace
- pricing logic changes
- deleting the current public floorplan tool
