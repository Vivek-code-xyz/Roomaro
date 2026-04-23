# Roomaro Deployment Ready Guide

This repository is set up for:

- Backend: Render
- Frontend: Vercel

The backend is a Socket.IO server and must run on a host that supports a long-lived Node process. The frontend is a Next.js app that deploys cleanly to Vercel.

## Repository layout

- `server/` = realtime backend
- `client/` = Next.js frontend
- `render.yaml` = Render blueprint for the backend

## 1. Backend deployment on Render

### Option A: Use the Render blueprint

1. Push this repo to GitHub.
2. In Render, create a new Blueprint deployment.
3. Select the repository root.
4. Render will read [render.yaml](render.yaml).
5. Deploy the service.

### Option B: Manual Render setup

If you prefer manual configuration, create a Web Service with:

- Root Directory: `server`
- Runtime: `Node`
- Build Command: `npm ci && npm run build`
- Start Command: `npm run start`
- Health Check Path: `/health`

### Backend environment variables

Set these in Render:

- `CLIENT_ORIGIN` = your Vercel frontend URL
  - Example: `https://your-app.vercel.app`
  - If you also use a custom domain, separate origins with commas
  - Example: `https://your-app.vercel.app,https://www.yourdomain.com`

Notes:

- Do not hardcode localhost in production.
- Render provides `PORT` automatically.
- The server reads `CLIENT_ORIGIN` for both Express CORS and Socket.IO CORS.

### Backend verification

After deploy, open:

- `https://your-render-service.onrender.com/health`

Expected response:

```json
{ "ok": true }
```

## 2. Frontend deployment on Vercel

### Create the Vercel project

1. Open Vercel.
2. Import the same GitHub repository.
3. Set Root Directory to `client`.
4. Framework should auto-detect as Next.js.

### Frontend environment variables

Set this in Vercel:

- `NEXT_PUBLIC_SERVER_URL` = your Render backend URL
  - Example: `https://your-render-service.onrender.com`

Important:

- This value must point to the deployed Render backend, not localhost.
- Redeploy the frontend after changing the env var.

### Frontend verification

After deploy:

1. Open the Vercel URL.
2. Create a room.
3. Open the same room in another tab.
4. Confirm messages sync in real time.

## 3. Local development setup

### Backend local env file

Create `server/.env`:

```env
PORT=3004
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend local env file

Create `client/.env.local`:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3004
```

### Local run commands

Backend:

```bash
cd server
npm install
npm run dev
```

Frontend:

```bash
cd client
npm install
npm run dev
```

## 4. Commands used by deployment platforms

### Render backend

- Build Command: `npm ci && npm run build`
- Start Command: `npm run start`

### Vercel frontend

- Build Command: handled automatically by Next.js
- Start Command: handled automatically by Vercel

## 5. Common deployment errors and fixes

### TS2688: Cannot find type definition file for 'node'

Cause:
- Render installed packages without the Node type package available during build.

Fix:
- This repo now keeps `@types/node` available to the backend build.
- Re-run Render deploy after pulling the latest `main` branch.

### Socket connection fails in production

Cause:
- `NEXT_PUBLIC_SERVER_URL` is missing or points to localhost.

Fix:
- Set the Vercel env var to the Render URL and redeploy.

### CORS or websocket handshake error

Cause:
- `CLIENT_ORIGIN` does not match the Vercel URL.

Fix:
- Set `CLIENT_ORIGIN` in Render to the exact Vercel URL and redeploy backend.

### Backend deploys but frontend cannot connect

Cause:
- Backend and frontend env vars are not wired together.

Fix:
- Render `CLIENT_ORIGIN` must match Vercel URL.
- Vercel `NEXT_PUBLIC_SERVER_URL` must match Render URL.

## 6. Deployment checklist

- Backend pushed to GitHub
- Render blueprint available in the repo
- Render service root is `server`
- Render build command is `npm ci && npm run build`
- Render start command is `npm run start`
- Render `CLIENT_ORIGIN` is set to the Vercel URL
- Vercel project root is `client`
- Vercel `NEXT_PUBLIC_SERVER_URL` is set to the Render URL
- Frontend redeployed after env changes

If all items above are set, Roomaro is deployment ready.
