<p align="center">
  <h1 align="center">🎓 Unimarky — Campus Hub</h1>
  <p align="center">
    <strong>The all-in-one platform for Indian university students</strong><br/>
    Social feed · Marketplace · Lost & Found · Food · Housing · Study Materials
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Hono-E36002?style=flat-square&logo=hono&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black" />
  <img src="https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **🛒 Marketplace** | Buy and sell items within your university — textbooks, electronics, furniture, and more. |
| **🔍 Lost & Found** | Report and discover lost or found items on campus with image uploads and status tracking. |
| **🍔 Food** | Browse nearby restaurants, view menus with prices, ratings, and dietary tags. |
| **🏠 Housing** | Explore PGs, hostels, and hotels near campus — with amenities, pricing, and reviews. |
| **📚 Study Materials** | Share and access notes, past papers, and resources for your courses. |
| **👤 Profiles** | User profiles with university verification, role requests, and onboarding flow. |

> The legacy Unimedia feed and Announcements page are retired. Their endpoints
> now return `410 Gone` for writes and serve the old content read-only as an
> archive.

---

## 🏗️ Tech Stack

### Frontend (`apps/web`)
- **React 19** + **Vite 7** — blazing-fast SPA
- **TailwindCSS v4** — utility-first styling with glassmorphism theme
- **Framer Motion** — smooth animations and page transitions
- **shadcn/ui** + **Radix UI** — accessible component primitives
- **Supabase Auth** — Google OAuth + email/password authentication
- **React Router v7** — client-side routing with lazy loading

### Backend (`apps/api`)
- **Hono** — ultra-fast web framework on Node (`@hono/node-server`, run with `tsx`)
- **Drizzle ORM** — type-safe SQL with PostgreSQL
- **Supabase** — hosted PostgreSQL database + Auth + Storage
- **Zod** — request validation
- **JWT** — Supabase JWKS-based authentication middleware
- **Policy layer** — scoped permissions (`user_permissions`) + admin (`userX`) checks, with an `audit_log` trail

---

## 📁 Project Structure

```
unmarky/
├── apps/
│   ├── api/                    # Backend API server
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts   # Drizzle database schema
│   │   │   │   ├── seed.ts     # Sample data seeder
│   │   │   │   └── index.ts    # DB connection
│   │   │   ├── routes/         # API route handlers
│   │   │   │   ├── social.ts       # Unimedia feed & posts
│   │   │   │   ├── marketplace.ts  # Buy/sell items
│   │   │   │   ├── lostfound.ts    # Lost & found
│   │   │   │   ├── food.ts         # Restaurants & menus
│   │   │   │   ├── accommodation.ts # Housing
│   │   │   │   ├── study.ts        # Study materials
│   │   │   │   ├── profiles.ts     # User profiles
│   │   │   │   ├── dashboard.ts    # Dashboard stats
│   │   │   │   └── roleRequests.ts # Role management
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT auth + onboarding gate
│   │   │   │   ├── policies.ts     # isAdmin / canModify / hasPermission
│   │   │   │   └── permission.ts   # requireAdmin / requirePermission
│   │   │   └── index.ts       # Server entry point
│   │   └── drizzle/            # Generated migrations
│   │
│   └── web/                    # Frontend SPA
│       └── src/
│           ├── components/
│           │   ├── layout/     # Navbar, Footer, Sidebar, MainLayout
│           │   ├── ui/         # shadcn/ui primitives
│           │   └── auth/       # Auth form components
│           ├── features/
│           │   ├── campus/     # Lost & Found (legacy feed is archived)
│           │   ├── marketplace/ # Marketplace pages
│           │   ├── lifestyle/  # Food & Housing pages
│           │   ├── landing/    # Landing page
│           │   ├── dashboard/  # Dashboard
│           │   ├── superuser/  # Superuser management pages
│           │   ├── admin/      # Admin dashboard
│           │   ├── profile/    # User profile page
│           │   ├── study/      # Study materials
│           │   └── onboarding/ # User onboarding flow
│           ├── hooks/          # Custom React hooks
│           ├── lib/            # API client, Supabase config, utils
│           └── App.tsx         # Routes & app entry
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) and npm (the API is a Node service — there is no Flutter app)
- **PostgreSQL** database (or a [Supabase](https://supabase.com) project)

### 1. Clone the repo
```bash
git clone https://github.com/jatin-yadav-sekwal/UniMARKY-campus-hub.git
cd UniMARKY-campus-hub
```

### 2. Install dependencies (from the repo root)
This is an npm workspaces monorepo — one install covers both web and API.
```bash
npm install
```

### 3. Configure the backend (`apps/api/.env`)
```bash
cp apps/api/.env.example apps/api/.env
# Fill in DATABASE_URL and SUPABASE_URL
```
- `DATABASE_URL` — Supabase Postgres. Runtime may use the pooled URL (port `6543`).
- `SUPABASE_URL` — project URL; the API derives the JWKS endpoint from it.

### 4. Run database migrations
```bash
# Point DATABASE_URL at the DIRECT connection (port 5432) first.
# Collapse duplicate post_likes so the new unique index applies:
psql "$DATABASE_URL" -f apps/api/scripts/pre-migrate.sql

npm run db:generate
npm run db:migrate
# Lock down RLS + the auth trigger (idempotent):
psql "$DATABASE_URL" -f apps/api/scripts/security-hardening.sql
npm run db:seed --workspace api   # Optional: sample data
```

**Storage.** Community post images upload to the public `post-images` bucket.
Create it in Supabase → Storage (public bucket, authenticated INSERT).

### 5. Configure the frontend (`apps/web/.env`)
```bash
cp apps/web/.env.example apps/web/.env
# VITE_API_URL=/api                       # same-origin; Vite proxies to :3000 in dev
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_WEB_URL=http://localhost:5173
```

### 6. Start development servers
```bash
# Terminal 1 — Backend  → http://localhost:3000
npm run dev:api

# Terminal 2 — Frontend → http://localhost:5173
npm run dev:web
```

---

## 🔐 Environment Variables

### Backend (`apps/api/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (pooled `6543` at runtime; direct `5432` for migrations) |
| `SUPABASE_URL` | Supabase project URL — used to fetch the JWKS for token verification |
| `PORT` | Server port (default: `3000`; Render sets this) |
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API directly (not needed for the same-origin `/api` rewrite) |

### Frontend (`apps/web/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base. Use `/api` (same-origin via the Vercel rewrite / Vite dev proxy) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_WEB_URL` | Public web origin, used for OAuth redirects |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Normal** | Access all features, create posts, buy/sell, report items |
| **Superuser** | Add/edit restaurants, accommodations, study materials |
| **UserX (Admin)** | Full admin dashboard, manage role requests, moderate content |

---

## 🌐 Deployment

| Layer | Platform |
|-------|----------|
| Frontend | [Vercel](https://vercel.com) — static SPA |
| Backend | [Render](https://render.com) — Node web service |
| Database | [Supabase](https://supabase.com) |

**Frontend (Vercel).** `apps/web/vercel.json` rewrites `/api/:path*` to the
Render API and falls back to `index.html` for the SPA. The browser therefore
talks to a single origin and CORS is not exercised. Set the `VITE_*` variables
in the Vercel project.

**Backend (Render).** `render.yaml` at the repo root defines the service:
root install, `npm run start --workspace api`, health check `/healthz`. Set
`DATABASE_URL`, `SUPABASE_URL` and (optionally) `CORS_ORIGINS` in the Render
dashboard.

**Migrations.** Run `apps/api/scripts/pre-migrate.sql` once against the direct
`DATABASE_URL`, then `npm run db:migrate` before deploying. Finally apply the
idempotent `apps/api/scripts/security-hardening.sql` (RLS + auth trigger) and,
optionally, `apps/api/scripts/optional-indexes.sql` (pg_trgm fuzzy search).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Indian university students
</p>
