# CEL — The Six-Piece Hunt

Production-ready campus activation for CEL BITS Goa induction season. Students scan six physical QR posters, unlock sourced startup facts or dry jokes, see persistent progress, watch a live leaderboard, and receive an eligibility card after completing all six pieces.

## Stack

- Next.js App Router
- Supabase Postgres + Realtime in production
- Local JSON fallback for development when Supabase env vars are absent
- Programmatic QR generation through `qrcode`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env values:

```bash
cp .env.example .env.local
```

3. For production, set:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
ADMIN_PASSWORD=
```

4. Run the Supabase migration in `supabase/migrations/001_initial_schema.sql`.

5. Seed content:

```bash
npm run seed
```

6. Run locally:

```bash
npm run dev
```

Without Supabase credentials the app uses `data/local-db.json`. This is useful for local testing, but the leaderboard is not globally shared. Live campus-wide leaderboard updates require Supabase Realtime.

## QR Codes

Runtime QR routes:

- `/api/qr/1` through `/api/qr/6`
- `/admin/qr` for the contact sheet

Generate static QR assets:

```bash
npm run qr
```

Output goes to `public/generated/qr`.

Each QR encodes `${NEXT_PUBLIC_APP_URL}/scan/{piece}`.

## Admin

Hidden route:

```text
/admin
```

Use `ADMIN_PASSWORD` in production. Admin can view metrics, toggle the hunt, toggle leaderboard visibility, reset progress, export CSV, and manage fact/joke content.

## Supabase Notes

The service role key is used only in server routes and scripts. It is never exposed to the client. Public clients only subscribe to `players` and `puzzle_scans` for leaderboard refreshes. RLS allows public reads for leaderboard/content/settings and relies on server-side API routes for all writes.

## CEL Logo

The app uses `assets/logo.png` through `/api/logo`. Replace that file with the final supplied CEL logo asset before deployment.
