# Bvflow — Personal Funnel Builder

A private, single-user visual funnel builder for creating multi-step lead funnels and landing pages. Build, brand, preview, publish, and collect submissions — all from a local app.

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Copy environment config
cp .env.example .env

# 3. Start development (Fastify server + Vite frontend)
npm run dev
```

- Frontend: http://localhost:5173
- API server: http://localhost:3001

The SQLite database is created automatically at `./data/funnels.db` on first start.

---

## Production

```bash
npm run build          # build frontend to dist/client/
npm start              # run server (serves frontend + API)
```

Open http://localhost:3001 in a browser.

---

## Publishing Funnels

1. Build your funnel in the editor
2. Click **Publish & Export** in the builder header
3. A standalone `.html` file downloads to your machine
4. Open it in any browser — it's fully self-contained

**Submission capture:** The published HTML POSTs submissions to `http://localhost:3001`. The server must be running for submissions to be stored. If you deploy the server, change `submitEndpoint` to your server's public URL at export time.

---

## Data Location

All data is stored in a single SQLite file:
```
./data/funnels.db
```

Back this file up regularly. Delete it to start fresh.

---

## Funnel Schema (Developer Note)

A funnel is a JSON object with this shape:

```
Funnel
  ├── id, title, description, slug, status
  ├── branding: { primaryColor, fontFamily, borderRadius, ... }
  ├── settings: { thankYouMessage, redirectAfterSubmit, ... }
  └── steps[]
        ├── id, title, order
        ├── blocks[]       ← The actual page content
        │     ├── id, type, hidden, styles
        │     └── config   ← Type-specific settings
        ├── logicRules[]   ← Conditional logic
        └── settings       ← Navigation labels, autoAdvance, etc.
```

**Block types** (24 total):
- Content: `heading`, `paragraph`, `image`, `video`, `divider`, `spacer`, `button`
- Form: `text_input`, `email_input`, `phone_input`, `number_input`, `textarea`, `select`, `radio_group`, `checkbox_group`, `checkbox_single`, `date_picker`, `rating`, `slider`, `file_upload`, `name_fields`, `opinion_scale`, `picture_choice`, `legal_consent`

**Logic rules** fire when a condition is met on a step and trigger an action (jump to step, show/hide block, end funnel). Evaluated in order — first match wins per action type.

**Submissions** are stored with full field data keyed by `fieldName` from each block's config.

---

## Starter Templates

Six built-in templates accessible from "New Funnel":

| Template | Category | Steps |
|---|---|---|
| Lead Generation | Marketing | 3 |
| Quote Request | Sales | 5 |
| Service Qualification | Sales | 6 |
| Contact Form | Utility | 5 |
| Booking Request | Scheduling | 6 |
| Product Waitlist | Marketing | 4 |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `DB_PATH` | `./data/funnels.db` | SQLite database path |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin in production |
| `NODE_ENV` | `development` | Set to `production` for prod |
