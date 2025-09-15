CF Hub – Monorepo (Next.js + Express + MongoDB)

## Overview

Full‑stack app for Career Foundation Hub:
- Frontend: Next.js 14 (App Router), React 18, Ant Design
- Backend: Express, MongoDB/Mongoose, JWT, Firebase Admin (token exchange)

Key features:
- Blogs with search, categories (multi-select), tags, and admin publish/unpublish
- Robust image covers with backend fallbacks and Next/Image compatibility
- User 1‑1 consultation requests with admin management
- User blog submissions with admin moderation
- Admin‑managed Mentee Showcase (public list + admin CRUD)

## Quick start

1) Prerequisites
- Node.js 18+
- A MongoDB connection string

2) Environment
- Backend (`backend/.env`):
  - MONGODB_URI=mongodb+srv://...
  - JWT_SECRET=your-strong-secret
  - CORS_ORIGIN=http://localhost:3000 (optional; comma‑separated for multiple)
  - RATE_LIMIT_MAX=1000 (optional)
- Frontend (`frontend/.env.local`):
  - NEXT_PUBLIC_API_URL=http://localhost:8008/api
  - NEXT_PUBLIC_FIREBASE_API_KEY=...
  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
  - NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
  - NEXT_PUBLIC_FIREBASE_APP_ID=...
  - NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

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

- Configure `NEXT_PUBLIC_API_URL` to point at backend (defaults to http://localhost:8008/api).
- Next/Image config allows `localhost` and remote patterns for backend‑served images.
- Navbar search and category picker route into Blogs with filters pre‑applied.
- Blogs page includes search + multi‑category filters (slug or ID supported by API).
- Mentee Showcase (home): dynamically fetches from `/api/mentees`, supports external URLs or `/uploads/...` images, with placeholder fallback.

## Admin

- Visit `/admin` (must be logged in and have role=admin).
- Manage: Blog Posts, Career Stories, Applications, Consultation Requests, User Blog Submissions, and Mentees.

## Troubleshooting

- If images fail to render, ensure:
  - Backend is reachable at `NEXT_PUBLIC_API_URL`.
  - Next.js image config includes `localhost` (provided in repo).
  - For local files, place under `backend/uploads` and reference as `/uploads/...`.
- If 401/403 on admin endpoints, verify JWT and that the user is admin.

## Scripts (root)

```bash
npm run setup         # install deps in backend and frontend
npm run dev           # run both servers concurrently
npm run dev:backend   # run backend only
npm run dev:frontend  # run frontend only
```

## Deploying on Vercel (frontend + backend) with Vercel Blob + MongoDB

This repo can run both the Next.js frontend and the Express API on Vercel. Images are uploaded to Vercel Blob; data lives in MongoDB Atlas.

1) MongoDB Atlas (free)
- Create M0 cluster, DB user, allow network (0.0.0.0/0 for quick start), copy MONGODB_URI and include a DB name.

2) Backend on Vercel
- The serverless entry is `backend/api/index.js` (exports the Express app). No build needed.
- In Vercel: Add New → Project → Import this repo.
- Project settings:
  - Framework Preset: Other
  - Root Directory: `backend`
  - Build Command: (empty)
  - Output Directory: (empty)
- Environment Variables:
  - MONGODB_URI=...
  - JWT_SECRET=...
  - FRONTEND_URL=https://your-frontend.vercel.app
  - ADDITIONAL_ORIGINS=https://your-custom.com
  - API_BASE_PATH=/api (optional)
  - BLOB_READ_WRITE_TOKEN=... (from Vercel Blob)
- Deploy and note the backend URL: https://<backend>.vercel.app (API = + `/api`).

3) Vercel Blob (uploads)
- Vercel dashboard → Storage → Blob → Create store.
- Generate a READ/WRITE server token and set it as `BLOB_READ_WRITE_TOKEN` on the backend project.
- Upload endpoint: POST `/api/uploads` (multipart field: `file`), returns a public `url`.

4) Frontend on Vercel
- Add New → Project → Import this repo → Framework Preset: Next.js.
- Root Directory: `frontend`.
- Environment Variables:
  - NEXT_PUBLIC_API_URL=https://<backend>.vercel.app/api
  - Firebase NEXT_PUBLIC_* keys
- Next/Image config must allow your backend URL and your blob domain; redeploy after edits.

5) Admin and content
- Promote admin via Atlas or `node backend/scripts/createAdmin.js` (using prod MONGODB_URI locally).
- Use `/admin` to manage blogs, stories, consultations, and mentees. For images, upload to Blob (future UI) or via console and paste URLs.

Notes:
- Avoid local filesystem on serverless—use Blob for uploads.
- MongoDB connection is lazy in serverless (`backend/app.js`).
