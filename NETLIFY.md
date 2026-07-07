# Deploying to Netlify

This project is ready for Netlify. Two options:

## Option A — Connect your Git repo (recommended)
1. Push this project to GitHub / GitLab / Bitbucket.
2. On https://app.netlify.com click **Add new site → Import an existing project**.
3. Select the repo. Netlify will read `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Nitro preset: `netlify`
4. Click **Deploy site**. Every push auto-deploys.

## Option B — Drag & drop
1. Run `npm install` then `npm run build` locally.
2. Drag the generated `dist` folder onto https://app.netlify.com/drop.

## Environment variables
If you enable backend features, add these in **Site settings → Environment variables**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Custom domain
**Site settings → Domain management → Add custom domain**, then point your DNS to Netlify.
