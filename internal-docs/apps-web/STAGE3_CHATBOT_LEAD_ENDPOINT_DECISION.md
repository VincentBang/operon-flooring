# Stage 3 Chatbot Lead Endpoint Decision

Date: 2026-06-17

Purpose: prevent confusion between the older chatbot lead handoff endpoint and the newer strict chatbot qualification endpoint.

## Decision

The active browser endpoint for the TSX chatbot is:

- `/.netlify/functions/save-chatbot-lead-event`

The legacy compatibility endpoint is:

- `/.netlify/functions/chatbot-lead-event`

Do not add new browser calls to `chatbot-lead-event` for Stage 3. Keep it only for compatibility tests or until a deliberate cleanup removes it after preview and production safety checks.

## Why

`save-chatbot-lead-event` is the stricter Stage 3 endpoint:

- accepts only structured safe qualification fields
- rejects raw transcript, raw quote text, OCR text, upload content, storage paths, pricing/rate/margin fields and oversized payloads
- writes a parent `operon_leads` row through server-side service-role logic
- writes a safe `operon_lead_events` row
- writes `operon_chatbot_qualifications` when the additive table exists
- treats the qualification-table write as non-blocking while the migration is being rolled out

`chatbot-lead-event` is older:

- writes a chatbot lead/event for route handoffs and prequalification
- does not write the `operon_chatbot_qualifications` table
- should not be the endpoint used by the current browser chatbot

## Browser Contract

Current expected browser files:

- `apps/web-tsx/public/chatbot/chatbot.js`
- `apps/web/chatbot/chatbot.js`

Both should point to:

```text
/.netlify/functions/save-chatbot-lead-event
```

Do not put PII, raw quote text, raw OCR text, uploaded file text, bucket/path, signed URL, internal pricing, rates, margins or supplier costs into the payload.

## Preview Requirements

Before any Stage 3 live use:

- Safe chatbot qualification returns 200.
- Malformed or forbidden payloads return 400.
- Handoff still works if event write fails.
- `operon_leads` gets `primary_source = chatbot`.
- `operon_lead_events` gets a safe chatbot event type.
- `operon_chatbot_qualifications` is created if the migration exists.
- If `operon_chatbot_qualifications` does not exist, the event write remains non-blocking and the dashboard panel is treated as blocked until migration approval.

## Cleanup Rule

Only remove or redirect `chatbot-lead-event` after:

- production logs show no current callers
- preview QA passes with `save-chatbot-lead-event`
- no fallback customer route depends on the old endpoint
- human approves the cleanup
