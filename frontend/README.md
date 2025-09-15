CF Hub Frontend (Next.js 14)

## Setup

Environment file: `frontend/.env.local`

Required vars:
- NEXT_PUBLIC_API_URL (e.g., http://localhost:8008/api)
- NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Features

- Navbar search and category selector route into Blogs page with filters pre-applied
- Blogs page search and multi-category filtering (slugs or IDs supported by API)
- Image cover handling with safe fallbacks (uses backend /cover endpoint only when data exists)
- Dynamic Mentee Showcase on the homepage via `/api/mentees` with image placeholder fallback
- Auth flows via Firebase; app state via Auth Context
- Admin-only dashboard at `/admin`

## Images

- Absolute image URLs are allowed
- Local uploads are served from backend `/uploads` and accepted by Next/Image (localhost domain and remotePatterns configured)
- Missing images fall back to `/assets/blank-profile-picture.jpg`

## Scripts

```bash
npm run dev     # start Next.js dev server
npm run build   # build
npm run start   # start production
```
