# Local Quote Testing

Use one of these local modes depending on what you want to test.

## 1. UI-only local testing

This is best for:

- layout
- mobile responsive checks
- product selection
- floorplan handoff
- quote step flow

Run:

```bash
cd "/Users/daibang/Documents/New project"
npm run dev:static
```

Open:

- `http://localhost:8000/index.html`
- `http://localhost:8000/floorplan.html`
- `http://localhost:8000/products.html`

This mode does **not** save quotes to Supabase.

## 2. Full local quote-save testing

This is best for:

- `Review estimate`
- `Email quote`
- Netlify Functions
- Supabase-backed quote save

### Install the local runtime

Run once:

```bash
cd "/Users/daibang/Documents/New project"
npm install --save-dev netlify-cli
```

### Add local environment variables

Create a file at:

- `/Users/daibang/Documents/New project/.env`

Add:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
OPERON_QUOTE_FROM_EMAIL=quotes@yourdomain.com
OPERON_QUOTE_REPLY_TO=your-email@example.com
```

Notes:

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required for `Review estimate`
- `RESEND_API_KEY` and `OPERON_QUOTE_FROM_EMAIL` are required for `Email quote`
- `OPERON_QUOTE_REPLY_TO` is optional

### Start full local runtime

Run:

```bash
cd "/Users/daibang/Documents/New project"
npm run dev:netlify
```

Open:

- `http://localhost:8888`

### Quick runtime health check

Open:

- `http://localhost:8888/.netlify/functions/runtime-health`

Expected:

- `quoteSaveReady: true` means local quote save is connected
- `emailReady: true` means local quote email is connected

## Recommended workflow

- use `npm run dev:static` for fast UI iteration
- use `npm run dev:netlify` when you need to test save/email behavior
