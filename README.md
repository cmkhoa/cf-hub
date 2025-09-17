CF Hub – Monorepo (Next.js + Express + MongoDB)

## Overview

Full‑stack app for Career Foundation Hub using a multi‑service deployment stack:
- Frontend: Next.js 14 (App Router) deployed on Netlify
- Backend: Express + MongoDB (Mongoose) deployed on Koyeb (container/node service)
- Storage: Cloudflare R2 (S3 compatible) for uploaded images/assets
- Auth: Firebase (client) + Firebase Admin (backend token verification) + JWT roles

Key features:
- Blogs with search, multi‑category filter, tags, admin publish/unpublish
- Resilient blog cover image pipeline (DB binary → local file → external URL → placeholder)
- 1‑1 consultation requests with admin management UI
- User blog submissions with admin moderation workflow
- Admin‑managed Mentee Showcase (CRUD + public listing)

## Quick start (Local Dev)

1) Prerequisites
- Node.js 18+
- A MongoDB connection string

2) Environment
Backend (`backend/.env` – copy from `.env.example`):
  - MONGODB_URI=mongodb+srv://...
  - JWT_SECRET=your-strong-secret
  - FRONTEND_URL=http://localhost:3000
  - ADDITIONAL_ORIGINS=http://localhost:5173
  - API_BASE_PATH=/api
  - (Firebase) FIREBASE_SERVICE_ACCOUNT_B64=... or FIREBASE_SERVICE_ACCOUNT_FILE=...
  - (R2) R2_ACCOUNT_ID=..., R2_ACCESS_KEY_ID=..., R2_SECRET_ACCESS_KEY=..., R2_BUCKET=cf-hub-uploads, R2_PUBLIC_BASE_URL=https://<your-cdn-domain>
  - MAX_UPLOAD_MB=8

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

- Image covers: GET /api/blog/posts/:id/cover
  - Serves DB binary if present, or local file from `/uploads`, or redirects to absolute URL.
  - Final fallback is a tiny PNG placeholder to avoid 404/429 image optimizer errors.
- Rate limiting: configured and excludes the cover endpoint.
- Mentees API:
  - Public: GET `/api/mentees` (sorted by `order`, then `createdAt`)
  - Admin: POST `/api/mentees`, PUT `/api/mentees/:id`, DELETE `/api/mentees/:id`
  - Requires Authorization: Bearer <JWT> with admin role.

Promote an admin (optional utility):

```bash
node backend/scripts/createAdmin.js user@example.com --create
```


## Frontend notes

- Configure `NEXT_PUBLIC_API_URL` to point at backend (defaults to http://localhost:8008/api). All API calls now use this env.
- Next/Image config allows `localhost` plus optional Cloudflare R2 public host (set `R2_PUBLIC_HOST` at build time for Netlify if needed).
- Navbar search and category picker route into Blogs with filters pre‑applied.
- Blogs page includes search + multi‑category filters (slug or ID supported by API).
- Mentee Showcase (home): dynamically fetches from `/api/mentees`, supports external URLs or `/uploads/...` images, with placeholder fallback.
- Header: Sign Up button removed.
- Footer: Now only Brand and Recent News columns (categories/tags removed).

## Admin

- Visit `/admin` (must be logged in and have role=admin).
- Manage: Blog Posts, Career Stories, Applications, Consultation Requests, User Blog Submissions, and Mentees.


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


## Deployment (Current Stack)

### 1. MongoDB Atlas
Create free M0 cluster → DB user → Network Access (IP allowlist) → grab `MONGODB_URI`.

### 2. Cloudflare R2 (Images)
1. Create an R2 bucket (e.g. `cf-hub-uploads`).
2. Generate an API token (S3 write permissions) and note Access Key / Secret.
3. (Optional) Set up a custom domain or use the default public bucket URL.
4. Populate backend env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL` (if custom domain/CDN).

Upload endpoint: `POST /api/uploads` (multipart field: `file`) → response `{ url, pathname, contentType, size }`.

### 3. Backend on Koyeb
1. Create new Service → GitHub repo → select `backend/` directory.
2. Build & run (Koyeb auto-detects Node). Ensure Start command: `node server.js` (or provided in package.json scripts).
3. Set Environment Variables (from `.env.example`). Include CORS `FRONTEND_URL` once Netlify domain known.
4. Deploy; note the public base URL (e.g. `https://cf-hub-api-<hash>.koyeb.app`). Set frontend `NEXT_PUBLIC_API_URL` to `${BASE}/api`.

### 4. Frontend on Netlify
1. Connect repo → base directory left root; `netlify.toml` handles build.
2. Environment variables (Netlify UI):
  - NEXT_PUBLIC_API_URL=https://cf-hub-api-<hash>.koyeb.app/api
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
Push to main; Koyeb & Netlify deploy independently. Add health endpoint (`/api/health`) if desired (future enhancement).

## Environment Variable Reference

Backend (Koyeb): MONGODB_URI, JWT_SECRET, FRONTEND_URL, ADDITIONAL_ORIGINS, API_BASE_PATH, FIREBASE_SERVICE_ACCOUNT_B64 or FILE, R2_* vars, MAX_UPLOAD_MB.
Frontend (Netlify): NEXT_PUBLIC_API_URL, NEXT_PUBLIC_FIREBASE_* keys, (optional) R2_PUBLIC_HOST.

## Future Enhancements
- Add signed URL generation for private objects.
- Implement image resizing lambda/worker cached via CDN.
- Add health & readiness probes for backend.
- Provide admin UI for upload management.
