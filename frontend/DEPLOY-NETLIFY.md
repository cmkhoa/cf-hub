# Netlify Deployment (Frontend Only)

1. Connect repo in Netlify.
2. Base directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `.next`
5. Plugin: add `@netlify/plugin-nextjs` (package.json devDependencies)
6. Node version: 18
7. Env vars (Site settings → Environment):
   - `NEXT_PUBLIC_API_URL` = `https://<backend-domain>/api`
   - `R2_PUBLIC_HOST` (optional)
8. Clear cache & deploy after changes.

Troubleshooting:
- If Netlify says "No config file defined", ensure netlify.toml is inside `frontend/` when Base is also `frontend`.
- Avoid `next export`. Keep `output: 'standalone'`.
