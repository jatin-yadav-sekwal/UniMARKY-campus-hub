# Deployment Guide

**Stack:** Vercel (web) · Render (API) · Supabase (PostgreSQL, Auth, Storage) · GitHub Actions (CI)

---

## 1. Prerequisites

- Node.js from `.nvmrc` and npm 11+
- A Supabase project (PostgreSQL 17)
- A Render account (or any Node host)
- A Vercel account
- This repository pushed to GitHub

## 2. Supabase setup

### 2.1 Project and keys

From Supabase → Project Settings → API / Database, collect:

| Value | Used by |
|---|---|
| Project URL (`https://<ref>.supabase.co`) | API + web |
| Anon/publishable key | Web (`VITE_SUPABASE_ANON_KEY`) |
| Database URL (pooled, port 6543) | API runtime |
| Direct database URL (port 5432) | Migrations |

Never expose the database password or a service-role key in the frontend.

### 2.2 Auth

- Enable Email and Google providers.
- Set the Site URL to the web origin (`https://unimarky.runs-on.dev`).
- Add redirect URLs:
  - `http://localhost:5173/**`
  - `https://unimarky.runs-on.dev/**`
  - specifically `/reset-password` for password recovery.
- Configure SMTP if you want signup confirmation and password-reset email. Without SMTP, Supabase's default mailer is rate-limited.

### 2.3 Storage buckets

Create public buckets (authenticated insert/update, public read):

| Bucket | Used for |
|---|---|
| `profile-avatars` | Profile photos |
| `marketplace-images` | Marketplace listings |
| `lostfound-images` | Lost & found photos |
| `restaurant-images` | Restaurant covers |
| `menu-images` | Dish photos |
| `post-images` | Community post images |
| `accommodation-images` | Stay photos (if used) |

Set allowed MIME types to JPG/PNG/WebP/GIF and a 10 MB object limit to match the client.

### 2.4 Database

From the repo root, with `DATABASE_URL` pointing at the **direct** connection:

```bash
psql "$DATABASE_URL" -f apps/api/scripts/pre-migrate.sql
npm run db:generate
npm run db:migrate
psql "$DATABASE_URL" -f apps/api/scripts/security-hardening.sql
# optional
psql "$DATABASE_URL" -f apps/api/scripts/optional-indexes.sql
npm run db:seed --workspace api
```

Review generated SQL before applying. Never edit an applied migration.

## 3. API on Render

Create a Web Service from the repo. The committed `render.yaml` already defines it.

| Setting | Value |
|---|---|
| Service | `unimarky-campus-hub` (Node) |
| Root directory | repository root (the blueprint lives there) |
| Build command | `npm ci --include=dev --no-audit --no-fund` |
| Start command | `npm run start --workspace api` |
| Health check path | `/healthz` |
| Node version | 22 |
| Region | Singapore |
| Auto-deploy | after the GitHub Actions **CI** workflow passes |

Environment variables:

```text
DATABASE_URL=postgresql://postgres.<ref>:<password>@<host>:6543/postgres
SUPABASE_URL=https://<ref>.supabase.co
CORS_ORIGINS=https://unimarky.runs-on.dev
CORS_ORIGIN_PATTERNS=
```

Notes:

- `PORT` is provided by Render; do not hardcode it.
- Use the pooled connection at runtime; direct for migrations.
- Keep `CORS_ORIGINS` to the production web origin; add preview patterns only if needed.
- `--include=dev` is required because `tsx` is a devDependency and starts the server.
- The API is stateless; do not rely on local files.

## 4. Web on Vercel

Project root: `apps/web`.

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` (repo root recommended) |

Environment variables:

```text
VITE_API_URL=/api
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_WEB_URL=https://unimarky.runs-on.dev
```

`apps/web/vercel.json`:

- rewrites `/api/:path*` to the Render API;
- rewrites public pages to the generated static HTML;
- rewrites every app route so a refresh does not 404;
- returns a real 404 for unknown paths;
- sets CSP, HSTS, frame, referrer and permissions headers;
- caches `/assets/*` immutably.

The build runs `tsc -b`, `vite build`, the SEO page generators and a route-coverage check. If the Vercel project overrides the build command with `vite build`, the static pages and route checks are skipped and public pages may 404. Keep `npm run build`.

## 5. Domains

- Point the web domain at Vercel and set it as the Supabase Site URL.
- Point the API at Render (or a custom `api.` subdomain).
- Update `apps/web/vercel.json` if the API host changes.
- Update `docs/README.md`, `sitemap.xml`, `robots.txt`, `index.html` and `RouteMeta` if the web domain changes.

## 6. CI

`.github/workflows/ci.yml` runs on pushes/PRs:

1. `npm ci`
2. `npm run typecheck`
3. `npm test` (API, 12 tests)
4. `npm run build:web`

`.github/workflows/deploy.yml` runs after CI on `main`:

- waits for `GET /healthz`;
- asserts `GET /api/communities` returns `401` without a token.

## 7. Post-deploy verification

```bash
curl -fsS https://unimarky-campus-hub.onrender.com/healthz
# {"ok":true}

curl -s -o /dev/null -w "%{http_code}\n" https://unimarky-campus-hub.onrender.com/api/communities
# 401

curl -I https://unimarky.runs-on.dev/
# 200, CSP + HSTS headers

curl -s https://unimarky.runs-on.dev/about | grep "<title>"
# About UniMARKY — One Account for Campus Life

curl -s -o /dev/null -w "%{http_code}\n" https://unimarky.runs-on.dev/does-not-exist
# 404
```

Also check:

- signup → onboarding → dashboard (no loop);
- password reset email link lands on `/reset-password`;
- a marketplace/food/accommodation page loads seeded data;
- assets return `cache-control: public, max-age=31536000, immutable`.

## 8. Rollback

- **Web:** Vercel → Deployments → promote the previous deployment.
- **API:** Render → Deploys → roll back to the previous successful deploy.
- **Database:** migrations are forward-only. Restore from a Supabase backup/PITR if a migration is destructive; otherwise add a corrective migration.
- **Config:** revert the commit; Vercel/Render redeploy automatically.

## 9. Troubleshooting

| Symptom | Check |
|---|---|
| `/api/*` 404 in production | `vercel.json` rewrite target; Render service health |
| 401 on every API call | Supabase URL/JWT; token present; clock skew |
| Login works but onboarding loops | `/profiles/me` response and `onboardingCompleted` |
| Password-reset link goes to home | Supabase Site URL + redirect allow-list |
| Images missing | Bucket exists, public read, correct URL |
| Seed data not visible | Signed-in profile's `university_name` matches the seed |
| Build fails on Vercel | Build command must be `npm run build` (SEO + route checks) |
| CSP blocks an integration | Add the origin to `connect-src`/`img-src` in `vercel.json` |

## 10. Backups and operations

- Enable Supabase daily backups/PITR for production.
- Keep secrets in Vercel/Render env vars, never in git.
- Rotate database passwords and Supabase keys if leaked.
- Monitor Render logs (JSON requests) and Supabase Auth/DB logs.
- Add an uptime monitor on `/healthz` and the web root.
