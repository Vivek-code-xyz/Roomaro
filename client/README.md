# Roomora Client

Roomora is a Next.js frontend for anonymous, real-time room-based chat.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create env file from template:

```bash
cp .env.example .env.local
```

3. Set your realtime server URL in `.env.local`:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3004
```

4. Run the frontend:

```bash
npm run dev
```

## Deploy to Vercel

This frontend is Vercel-ready.

### If you deploy from this `client` folder

1. Import project in Vercel.
2. Framework preset: Next.js (auto-detected).
3. Build command: `npm run build`.
4. Output: default Next.js output.
5. Add environment variable:

`NEXT_PUBLIC_SERVER_URL=https://your-realtime-server.example.com`

6. Deploy.

### If you deploy from monorepo root

Set Vercel project Root Directory to `client` in Project Settings.

## Important runtime note

The realtime socket backend is not hosted by this Next.js app. You must deploy the backend separately and provide:

`NEXT_PUBLIC_SERVER_URL`

If this variable is missing in production, the app will not initialize socket connections (to avoid broken localhost fallbacks).

## Mobile optimization status

The UI includes mobile-first refinements for:

1. Landing page content flow and card sizing
2. Rooms list spacing and modal sizing
3. Chat room safe-area spacing and compact controls
