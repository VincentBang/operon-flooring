# Stage 3 Lead Data Dictionary

Date: 2026-06-04

Purpose: keep Stage 3 dashboard, function, and report work aligned on field meanings.

## `operon_leads`

- `primary_source`: original lead family: `quote`, `contact`, `quote_review`, `upload`, `floorplan`, `product`, `chatbot`, `operator`, `system`.
- `source_detail`: more specific source path, such as `product_handoff`, `floorplan_handoff`, `quick_check`, `uploaded_quote_review`, or `operator_request`.
- `status`: operator pipeline state.
- `priority`: operational urgency, not pricing value.
- `customer_name`, `email`, `phone`: customer contact details.
- `suburb`, `postcode`: project location.
- `product_category`, `product_name`: customer-facing product selection/category.
- `area_m2`: measured or supplied area.
- `estimated_order_area_m2`: customer-safe order/chargeable area estimate.
- `estimate_total_inc_gst`: customer-safe estimate total only.
- `confidence_score`, `confidence_level`: quote confidence/readiness signals.
- `missing_info_flags`: customer/project details that need follow-up.
- `risk_flags`: project or quote-review risks requiring operator attention.
- `quote_review_status`: `none`, `saved`, `attached`, or future review state.
- `floorplan_status`: `none`, `attached`, or future review state.
- `contact_status`: email/notification state.
- `follow_up_status`: queued/sent/skipped/manual state.
- `next_action`: operator-facing next action.
- `last_activity_at`: latest activity timestamp.
- `metadata`: customer-safe operational metadata only.

## `operon_lead_events`

- `lead_id`: parent lead.
- `event_type`: stable event label for reporting.
- `source`: function or system that created the event.
- `source_table`: linked detail table when applicable.
- `source_id`: linked detail row when applicable.
- `customer_safe`: whether metadata is safe for broad internal display.
- `metadata`: redacted operational context.

## `operon_lead_notes`

- `note`: internal operator note.
- `note_type`: `operator`, `system`, or future controlled labels.
- `created_by`: admin identity once auth exists.
- `metadata`: internal note metadata.

## `operon_lead_files`

- `uploaded_file_id`: linked `operon_uploaded_files` row.
- `file_role`: `quote_attachment`, `quote_review_upload`, `floorplan_upload`, or `customer_upload`.
- `safe_filename`: sanitized display filename.
- `file_type`: MIME type.
- `file_size_bytes`: upload size.
- `storage_status`: storage state, not bucket/path.

## `operon_follow_ups`

- `due_at`: when follow-up is due.
- `status`: `open`, `done`, `snoozed`, or `cancelled`.
- `channel`: `phone`, `email`, `sms`, or `manual`.
- `next_action`: follow-up instruction.
- `assigned_to`: future operator assignment.

## `operon_floorplan_reviews`

- `status`: floorplan review state.
- `estimated_area_m2`: operator-reviewed area.
- `confidence_level`: review confidence.
- `review_summary`: internal summary.
- `missing_items`: details needed to finalize.

## `operon_lead_status_history`

- `from_status`: previous status.
- `to_status`: new status.
- `changed_by`: admin identity once auth exists.
- `reason`: operator reason.

## Explicitly Forbidden In Parent Lead Metadata

- Service-role keys
- API keys
- Storage bucket names
- Storage paths
- Permanent public file URLs
- Raw OCR text
- Raw uploaded quote text
- Full chatbot transcripts
- Supplier costs
- Margins
- Internal rate tables
- Access multipliers
- Private pricing rules
