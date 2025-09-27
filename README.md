CF Hub – Monorepo (Next.js + Express + MongoDB)

## Overview

Full‑stack platform for Career Foundation Hub.

Current deployment stack:
- Frontend: Next.js 14 (App Router) on Netlify
- Backend API: Express + MongoDB (Mongoose) on Fly.io
- Object Storage: Cloudflare R2 (S3‑compatible) for uploaded / persistent assets
- Auth: Firebase (client SDK) + Firebase Admin (token verification) + app‑level JWT roles

Core feature areas:
- Blog & Career Stories (postType classification: `blog`, `success`, others) with publish/unpublish, tags, multi‑category filtering, search
- Inline Admin Post Editing (single create form doubles as edit form; legacy modal removed)
- Paste‑to‑Upload Cover Images (clipboard image pasting supported as base64)
- Resilient cover image resolution (DB binary → local file path → remote absolute URL → placeholder) to avoid broken images / 404 loops
- User blog submissions with moderation workflow
- Consultation & Application requests management
- Mentee Showcase (CRUD + ordered listing)
- Basic Chat / AI helper endpoint (/api/chat) placeholder

## Quick start (Local Dev)

1) Prerequisites
- Node.js 18+
- A MongoDB connection string

2) Environment
Backend (`backend/.env.local` or `.env` – copy from template you create):
  - MONGODB_URI=mongodb://localhost:27017/cf_hub (or Atlas URI)
  - JWT_SECRET=change-me-in-prod
  - PORT=8008
  - API_BASE_PATH=/api
  - FRONTEND_URL=http://localhost:3000
  - ADDITIONAL_ORIGINS=http://localhost:5173
  - LOG_LEVEL=info
  - (Firebase Admin) FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccount.json  (or FIREBASE_SERVICE_ACCOUNT_B64=...)
  - (R2) R2_ACCOUNT_ID=..., R2_ACCESS_KEY_ID=..., R2_SECRET_ACCESS_KEY=..., R2_BUCKET=cf-hub-uploads, R2_PUBLIC_BASE_URL=https://<r2-or-cdn-domain>
  - MAX_UPLOAD_MB=8
  - (Optional) BLOB_READ_WRITE_TOKEN=... (only if using Vercel Blob prototype; treat as secret)

Frontend (`frontend/.env.local`):
  - NEXT_PUBLIC_API_URL=http://localhost:8008/api
  - Firebase NEXT_PUBLIC_* keys

3) Install and run

```bash
npm run setup         # installs backend and frontend deps
npm run dev           # runs backend (http://localhost:8008) and frontend (http://localhost:3000)
```

Open http://localhost:3000.

## Structure

```
backend/   # Express API, Mongo models, routes, auth, image handling
frontend/  # Next.js app (App Router), components, pages, contexts
```

## Backend notes

Image / cover flow (`GET /api/blog/posts/:id/cover`):
1. If binary stored in Mongo (legacy) → stream it.
2. Else if local file path (migrating) → serve from disk.
3. Else if absolute URL (R2 or external) → 302 redirect.
4. Else → tiny inlined PNG placeholder.

Post classification:
- `postType=blog` powers News section.
- `postType=success` powers Career Stories (limited to 3 on homepage).

DELETE endpoint fully removes the post and (if applicable) cleans up local cover file.

Mentees API:
- Public: `GET /api/mentees`
- Admin: `POST /api/mentees`, `PUT /api/mentees/:id`, `DELETE /api/mentees/:id`

Admin promotion utility:
```bash
node backend/scripts/createAdmin.js user@example.com --create
```

Promote an admin (optional utility):

```bash
node backend/scripts/createAdmin.js user@example.com --create
```


## Frontend notes

- All API calls derive from `NEXT_PUBLIC_API_URL`.
- Paste cover image: On `/admin`, when creating/editing a post you can Ctrl/Cmd+V an image from clipboard.
- Inline edit mode: Clicking Edit loads post data into the create form; Save issues PUT; Cancel resets.
- News & Career Stories sections now query with `postType` filters, reducing client filtering.
- Next/Image remotePatterns / domains must include backend host and any R2 public host.
- Homepage Mentee Showcase: pulls from `/api/mentees`; placeholder shown if missing.

## Admin

- Visit `/admin` (must be logged in and have role=admin).
- Manage: Blog Posts, Career Stories, Applications, Consultation Requests, User Blog Submissions, and Mentees.
- Unified post editor (create + edit) reduces duplicated state & code.
- Cover image upload supports file select & paste (base64 converted before send).


## Troubleshooting

- If images fail to render, ensure:
  - Backend is reachable at `NEXT_PUBLIC_API_URL`.
  - Next.js image config includes `localhost` and your backend/blob domains.
  - For local files, place under `backend/uploads` and reference as `/uploads/...`.
- If 401/403 on admin endpoints, verify JWT and that the user is admin.
- If API calls fail locally ("Failed to fetch"), check:
  - Frontend and backend ports match your envs (e.g., 3000/8008 or 3001/8009).
  - Backend `.env` has correct `FRONTEND_URL` and `ADDITIONAL_ORIGINS` for your frontend port.
  - Restart both servers after env changes.

## Scripts (root)

```bash
npm run setup         # install deps in backend and frontend
npm run dev           # run both servers concurrently
npm run dev:backend   # run backend only
npm run dev:frontend  # run frontend only
```


## Deployment (Current Stack – Fly.io + Netlify + R2)

### 1. MongoDB Atlas
Create free M0 cluster → DB user → Network Access (IP allowlist) → grab `MONGODB_URI`.

### 2. Cloudflare R2 (Images)
1. Create an R2 bucket (e.g. `cf-hub-uploads`).
2. Generate an API token (S3 write permissions) and note Access Key / Secret.
3. (Optional) Set up a custom domain or use the default public bucket URL.
4. Populate backend env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` (if custom domain/CDN).

Upload endpoint: `POST /api/uploads` (multipart field: `file`) → response `{ url, pathname, contentType, size }`.

### 3. Backend on Fly.io
1. Install Fly CLI & login.
2. From `backend/`: `fly launch` (already configured if `fly.toml` exists).
3. Set secrets (Fly treats env vars as secrets):
```bash
fly secrets set MONGODB_URI=... JWT_SECRET=... FRONTEND_URL=https://<netlify-app>.netlify.app ADDITIONAL_ORIGINS=https://deploy-preview-**--<netlify-app>.netlify.app API_BASE_PATH=/api FIREBASE_SERVICE_ACCOUNT_B64=... R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... R2_BUCKET=cf-hub-uploads R2_PUBLIC_BASE_URL=https://<cdn-domain> MAX_UPLOAD_MB=8
```
4. `fly deploy`.
5. Note Fly hostname: `https://<app>.fly.dev` (or custom domain). Set `NEXT_PUBLIC_API_URL=https://<app>.fly.dev/api` in Netlify.

### 4. Frontend on Netlify
1. Connect repo → base directory left root; `netlify.toml` handles build.
2. Environment variables (Netlify UI):
  - NEXT_PUBLIC_API_URL=https://<service-name>.onrender.com/api
  - R2_PUBLIC_HOST=<your R2 public host> (optional for image config)
  - Firebase NEXT_PUBLIC_* keys
3. Deploy. Netlify plugin handles Next.js (SSR). Preview URLs auto-add—append them to backend `ADDITIONAL_ORIGINS` if needed.

### 5. Firebase Auth Setup
1. Add Netlify domain + local dev domain to Firebase Auth Authorized Domains.
2. Backend: supply Firebase Admin credentials (B64 or file). For B64: `base64 serviceAccount.json | pbcopy` then paste.

### 6. Admin User Provisioning
Use existing script locally with production `MONGODB_URI`:
```bash
MONGODB_URI=... JWT_SECRET=... node backend/scripts/createAdmin.js admin@example.com --create
```

### 7. Image Handling After Migration
- All new uploads go to R2, returning a stable public URL.
- Existing blog cover fallback chain unchanged.

### 8. CORS Checklist
Backend env:
```
FRONTEND_URL=https://your-site.netlify.app
ADDITIONAL_ORIGINS=https://deploy-preview-123--your-site.netlify.app,http://localhost:3000
```

### 9. Zero-Downtime Updates
Push to main; Fly & Netlify deploy independently. Health endpoint (`/api/health`) exists for monitoring.

## Environment Variable Reference

Backend (Render): MONGODB_URI, JWT_SECRET, FRONTEND_URL, ADDITIONAL_ORIGINS, API_BASE_PATH, FIREBASE_SERVICE_ACCOUNT_B64 or FILE, R2_* vars, MAX_UPLOAD_MB.
Frontend (Netlify): NEXT_PUBLIC_API_URL, NEXT_PUBLIC_FIREBASE_* keys, (optional) R2_PUBLIC_HOST.

Backend (Fly.io) secrets (mirrors above) should be set via `fly secrets set` (never committed).

Security notes:
- Never commit real `JWT_SECRET`, Firebase service account JSON, Blob/R2 credentials, or tokens (rotate immediately if leaked).
- Add `*.env*` to `.gitignore` (confirm already present) and purge any accidentally committed secrets from git history & rotate keys.
- Treat `BLOB_READ_WRITE_TOKEN` as production secret (rotate if it appears in public history).

## Future Enhancements
- Add signed URL generation for private objects.
- Implement image resizing lambda/worker cached via CDN.
- Add health & readiness probes for backend (Render health checks can query `/api/health`).
- Provide admin UI for upload management.
- Add integration tests for critical CRUD flows.
- Migrate residual binary covers in Mongo to R2 with a one‑time script.
- Google Drive Import (new):
  - GOOGLE_OAUTH_CLIENT_ID (OAuth 2.0 Web client)
  - GOOGLE_OAUTH_CLIENT_SECRET
  - GOOGLE_OAUTH_REDIRECT_URL (must exactly match https://<backend-domain>/api/google-oauth)
  - Scopes currently: https://www.googleapis.com/auth/drive.readonly

### Admin Promotion (New UI Feature)
Existing admins can now promote another user directly in the `/admin` dashboard:

1. Navigate to the "Promote Admin" section in the left sidebar.
2. Enter the exact email of an existing account.
3. Submit to elevate their `role` to `admin`.

Notes:
- If the user is already an admin, the API returns a benign message.
- Newly promoted users must re-login (or use `/api/auth/refresh-token`) to receive a JWT reflecting the updated role.
- Endpoint: `POST /api/admin/users/promote` `{ email: string }` (admin-auth protected).

### Admin Demotion & Audit Logging
Admin management actions are now logged:

- Promote: `POST /api/admin/users/promote` → creates an `AdminAudit` document (`action=promote`).
- Demote: `POST /api/admin/users/demote` → sets role back to `user` (cannot demote the only remaining admin) and logs `action=demote`.

`AdminAudit` schema fields: `action`, `targetUser`, `targetEmail`, `performedBy`, `performedByEmail`, `previousRole`, `newRole`, `createdAt`.

Use this for future reporting or exposing an audit trail UI. Retrieval endpoint not yet implemented (add read-only listing if needed).
