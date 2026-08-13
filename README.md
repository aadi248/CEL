# CEL — The Six-Piece Hunt

A campus event experience for CEL BITS Goa. Six physical posters each carry a unique QR code. A participant checks in once with their name and BITS ID, then every unique scan locks one startup-themed jigsaw piece into their board. The live leaderboard shows exactly which of pieces 01–06 each player has found.

## Stack

- Next.js App Router, ready for Vercel
- Firebase Firestore through the server-only Firebase Admin SDK
- Signed, HTTP-only session for the protected QR workspace
- Programmatic PNG/SVG generation with `qrcode`
- Local JSON fallback for development only

Node.js 20.9 or newer is required (matching Next.js 16 and Vercel's current Node runtime).

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without Firebase credentials, local development stores data in `data/local-db.json`. When deployed on Vercel the app intentionally requires Firebase credentials; it will not use Vercel's ephemeral filesystem as a database.

## Firebase + Vercel

1. Create a Firebase project and enable Firestore in Native mode.
2. Create a service account in Firebase project settings.
3. Add these Vercel environment variables:

```text
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT_KEY=base64-or-raw-service-account-json
GENERATOR_USERNAME=admin
GENERATOR_PASSWORD=admin@1234
GENERATOR_SESSION_SECRET=a-long-random-secret
ADMIN_PASSWORD=a-separate-control-room-password
```

`FIREBASE_SERVICE_ACCOUNT_KEY` is server-only. Do not expose it with a `NEXT_PUBLIC_` prefix. As an alternative, set `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` separately.

Deploy the included locked-down Firestore rules if you use the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

All browser traffic goes through Vercel server routes, so the rules deny direct client access. BITS IDs are normalized and SHA-256 hashed before being saved.

Seed the fact cards after configuring credentials:

```bash
npm run seed
```

The collections are created automatically: `players`, `puzzle_scans`, `unlocks`, `fun_facts`, `admin_settings`, and `qr_codes`.

## Event QR workspace

Open `/generate` and sign in. Defaults requested for this event:

```text
username: admin
password: admin@1234
```

Override both credentials in Vercel for a public deployment. The workspace provides print-ready PNG/SVG versions of the six poster codes and lets organizers save, download, copy, and delete additional event QR codes. `/admin/qr` redirects to this protected workspace.

The six poster routes always encode:

```text
${NEXT_PUBLIC_APP_URL}/scan/1
...
${NEXT_PUBLIC_APP_URL}/scan/6
```

Static QR assets can also be generated with `npm run qr`.

## Admin

The separate `/admin` control room uses `ADMIN_PASSWORD` and can view event metrics, pause the hunt, hide the leaderboard, export CSV, reset progress, and manage unlock content.
