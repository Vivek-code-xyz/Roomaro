# Roomaro Deployment Guide (Render + Vercel)

This guide deploys:

- Backend Socket.IO server on Render
- Frontend Next.js app on Vercel

Use this exact order to avoid CORS and connection issues.

## 1. Prerequisites

- GitHub repo pushed with both folders:
  - `server/`
  - `client/`
- Render account
- Vercel account

## 2. Deploy Backend on Render

### Create Web Service

1. Open Render dashboard.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repo.
4. Configure service:
   - Name: `roomaro-server` (or any name)
   - Root Directory: `server`
   - Runtime: `Node`
   - Build Command: `npm install; npm run build`
   - Start Command: `npm run start`

### Add Environment Variables (Render)

Set these in Render -> Environment:

- `PORT` = `10000`
- `CLIENT_ORIGIN` = your Vercel frontend URL, for example:
  - `https://your-app.vercel.app`

If you use a custom domain on Vercel, use that domain instead.

You can allow multiple origins by comma-separating:

`https://your-app.vercel.app,https://www.yourdomain.com`

### Deploy and Verify Backend

After deploy succeeds, copy your Render URL, for example:

`https://roomaro-server.onrender.com`

Check health endpoint in browser:

`https://roomaro-server.onrender.com/health`

Expected response: JSON with `ok: true`.

## 3. Deploy Frontend on Vercel

### Create Project

1. Open Vercel dashboard.
2. Click **Add New** -> **Project**.
3. Import the same GitHub repo.
4. Set **Root Directory** to `client`.
5. Framework should auto-detect as Next.js.

### Add Environment Variables (Vercel)

In Vercel Project Settings -> Environment Variables:

- `NEXT_PUBLIC_SERVER_URL` = your Render backend URL
  - Example: `https://roomaro-server.onrender.com`

Then deploy.

## 4. Final Wiring Check

After both are live:

1. Open frontend URL on Vercel.
2. Create a room.
3. Open same room in another tab/device.
4. Confirm messages sync in real-time.

## 5. Common Errors and Fixes

### Error: Socket not connecting in production

Cause:
- `NEXT_PUBLIC_SERVER_URL` missing in Vercel

Fix:
- Add `NEXT_PUBLIC_SERVER_URL` and redeploy frontend.

### Error: CORS blocked / websocket handshake failed

Cause:
- `CLIENT_ORIGIN` not matching frontend URL exactly

Fix:
- Set `CLIENT_ORIGIN` in Render to exact Vercel URL and redeploy backend.

### Error: Backend works locally but fails on Render

Cause:
- No production start script or wrong root directory

Fix:
- Ensure Render uses:
  - Root Directory: `server`
  - Build: `npm install; npm run build`
  - Start: `npm run start`

### Error: App still points to localhost in production

Cause:
- Old env var value cached

Fix:
- Confirm Vercel env vars, then redeploy frontend.

## 6. Local Development Reference

### Backend (`server/.env`)

```env
PORT=3004
CLIENT_ORIGIN=http://localhost:3000
```

### Frontend (`client/.env.local`)

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3004
```

## 7. Deployment Summary

- Backend host: Render (`server`)
- Frontend host: Vercel (`client`)
- Required env mapping:
  - Render `CLIENT_ORIGIN` -> Vercel app URL
  - Vercel `NEXT_PUBLIC_SERVER_URL` -> Render app URL

If both env variables are set correctly, deployment is seamless.
