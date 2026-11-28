# UniMARKY

**One student account for campus life.**

UniMARKY is a campus platform for university students. It brings the useful parts of student life into one place — a marketplace, communities, study material, accommodation, food and lost & found — scoped to the student's university.

Most campus activity is scattered across WhatsApp groups, notice boards, spreadsheets and random social posts. UniMARKY gives each campus one verified student account and one place to buy, sell, join, study, find a stay, eat and recover lost items.

---

## The problem

- Marketplace posts disappear in group chats; there is no search, no price history and no way to know who is real.
- Clubs and batches live in unrelated groups, so new students miss them.
- Notes and previous-year papers are passed around as blurry PDFs.
- PGs and flats are found through brokers or word of mouth.
- Campus food menus are photos on a wall.
- Lost items are posted in five different groups.

## The product

| For students | What it does |
|---|---|
| **Marketplace** | Buy and sell textbooks, electronics, cycles and hostel gear with students at the same university. |
| **Communities** | Join clubs, batches and campus events, post updates and talk in threads. |
| **Study** | Find notes, previous-year papers and resources by department, year and subject. |
| **Accommodation** | Compare PGs, hostels and flats near campus — rent, amenities, distance and contact. |
| **Food** | Browse campus restaurants, menus, prices, ratings and student favourites. |
| **Lost & Found** | Report a lost item or return something found, with photos and locations. |
| **Profile & roles** | One account, university onboarding, role requests and account deletion. |

| For community leads | For campus admins |
|---|---|
| Create and manage a community, moderate posts and members, and publish updates. | Approve role requests, manage listings, review reports and keep the campus directory accurate. |

## How it works

1. **Create an account** with email or Google.
2. **Pick your university** during onboarding — every listing, community and resource is scoped to it.
3. **Use the six services** from one dashboard.

Everyone on the platform is a signed-in student at a university. Listings and communities stay inside that campus.

## Product tour

- `/` — public landing page with the six services and FAQs.
- `/auth` — sign in, sign up, password reset.
- `/onboarding` — choose a university and complete the profile.
- `/dashboard` — activity summary and shortcuts.
- `/marketplace` — browse, list, edit and contact sellers.
- `/communities` — discover, join, post and manage communities.
- `/study`, `/housing`, `/food`, `/lost-found` — the other campus services.
- `/profile` — account details, avatar and account deletion.
- `/admin` / `/superuser` — role-specific management.

Public pages (`/about`, `/contact`, `/terms`, `/privacy`, `/universities`) explain the product and are indexable; the workspace is private.

## Who it is for

College and university students in India first, with support for multiple campuses (Central University of Haryana, MIT, BHU, IIT Bombay are configured). The model is deliberately campus-scoped: verified students, local inventory, local communities.

## Status

Working MVP with:

- email/password + Google authentication, onboarding and role requests;
- all six student services end-to-end;
- community membership, posts and moderation;
- superuser and admin dashboards;
- account deletion, password reset and cookie consent;
- automated API tests and CI.

The product is under active development. See [docs/README.md](docs/README.md) for the full documentation set.

## Tech stack

| Layer | Technology |
|---|---|
| Web | React 19, Vite 7, TypeScript, React Router 7 |
| UI | Tailwind CSS 4, Radix/shadcn primitives, Motion |
| API | Hono 4 on Node, TypeScript, Zod |
| Data | PostgreSQL (Supabase), Drizzle ORM |
| Auth & storage | Supabase Auth (email + Google), Supabase Storage |
| Hosting | Vercel (web), Render (API), Supabase (data) |

## Documentation

| Document | What it covers |
|---|---|
| [SRS](docs/srs.md) | Scope, actors, functional and non-functional requirements |
| [Architecture](docs/architecture.md) | System context, containers, flows and decisions |
| [Database schema](docs/database-schema.md) | Tables, relationships, indexes and RLS |
| [API guide](docs/api.md) | Endpoints, auth and examples |
| [OpenAPI spec](docs/openapi.yaml) | Machine-readable API contract |
| [Wireframes](docs/wireframes.md) | Screen layouts and design system |
| [Deployment guide](docs/deployment.md) | Supabase, Render, Vercel and CI |
| [Test plan](docs/test-plan.md) | Automated and manual test cases |
| [Security](docs/security.md) | Controls, threat model and roadmap |
| [User manual](docs/user-manual.md) | Step-by-step guide for students and admins |
| [Design system](design.md) | Visual language and migration notes |

## Local quick start

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run dev:api      # http://localhost:3000
npm run dev:web      # http://localhost:5173
```

Fill in the Supabase values first. Full setup, migrations and storage buckets are in the [deployment guide](docs/deployment.md).

## Contact

- Product: [unimarky.runs-on.dev](https://unimarky.runs-on.dev)
- Instagram: [@unimarky](https://www.instagram.com/unimarky/)
- Support: use the in-app Contact page or the email on the contact page.

## License

Built as a minor project. Add the license you intend to use before distributing the code.
