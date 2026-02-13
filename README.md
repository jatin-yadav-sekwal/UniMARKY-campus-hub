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
| **📲 Unimedia** | Social feed with posts, events & announcements. Like, comment, and share campus updates. |
| **🛒 Marketplace** | Buy and sell items within your university — textbooks, electronics, furniture, and more. |
| **🔍 Lost & Found** | Report and discover lost or found items on campus with image uploads and status tracking. |
| **🍔 Food** | Browse nearby restaurants, view menus with prices, ratings, and dietary tags. |
| **🏠 Housing** | Explore PGs, hostels, and hotels near campus — with amenities, pricing, and reviews. |
| **📚 Study Materials** | Share and access notes, past papers, and resources for your courses. |
| **📢 Announcements** | University-wide announcements from admins and superusers. |
| **👤 Profiles** | User profiles with university verification, role requests, and onboarding flow. |

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
- **Hono** — ultra-fast web framework (runs on Bun)
- **Drizzle ORM** — type-safe SQL with PostgreSQL
- **Supabase** — hosted PostgreSQL database + Auth + Storage
- **Zod** — request validation
- **JWT** — Supabase JWKS-based authentication middleware

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
│   │   │   │   ├── auth.ts         # JWT auth middleware
│   │   │   │   └── roleGuard.ts    # Role-based access
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
│           │   ├── campus/     # Unimedia, Announcements, Lost & Found
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
- **Bun** (v1.0+) or **Node.js** (v18+)
- **PostgreSQL** database (or a [Supabase](https://supabase.com) project)

### 1. Clone the repo
```bash
git clone https://github.com/jatin-yadav-sekwal/UniMARKY-campus-hub.git
cd UniMARKY-campus-hub
```

### 2. Set up the backend
```bash
cd apps/api
bun install

# Create .env file
cp .env.example .env
# Fill in your DATABASE_URL and SUPABASE_JWT_SECRET
```

### 3. Run database migrations
```bash
bun run db:generate
bun run db:migrate
bun run db:seed        # Optional: seed sample data
```

### 4. Set up the frontend
```bash
cd ../web
bun install

# Create .env file with your Supabase credentials
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# VITE_API_URL=http://localhost:3000/api   (for production, use deployed URL)
```

### 5. Start development servers
```bash
# Terminal 1 — Backend
cd apps/api && bun dev     # Starts on http://localhost:3000

# Terminal 2 — Frontend
cd apps/web && bun dev     # Starts on http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (`apps/api/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: `3000`) |

### Frontend (`apps/web/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_API_URL` | Backend API URL (default: `http://localhost:3000/api`) |

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Normal** | Access all features, create posts, buy/sell, report items |
| **Superuser** | Add/edit restaurants, accommodations, study materials |
| **UserX (Admin)** | Full admin dashboard, manage role requests, moderate content |

---

## 🌐 Deployment

| Layer | Recommended (Free) |
|-------|-------------------|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | [Supabase](https://supabase.com) (already included) |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for Indian university students
</p>
