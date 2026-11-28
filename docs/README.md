# UniMARKY documentation

This folder is the complete documentation set for the UniMARKY campus platform. Start with the SRS if you need the product definition, or the user manual if you want to use the app.

| Document | Audience | Purpose |
|---|---|---|
| [SRS](srs.md) | Product, academic reviewers | Scope, actors, functional and non-functional requirements |
| [System architecture](architecture.md) | Engineers, reviewers | Context, containers, auth flow, deployment and decisions |
| [Database schema](database-schema.md) | Engineers, DB reviewers | Tables, relationships, indexes, RLS and migrations |
| [API guide](api.md) | Frontend/integration developers | Auth, pagination, errors and endpoint reference |
| [OpenAPI spec](openapi.yaml) | Tooling (Swagger, Postman) | Machine-readable API contract |
| [Swagger UI](api.html) | Reviewers | In-browser API explorer |
| [Wireframes](wireframes.md) | Design, product | Low-fidelity screens and design system |
| [Deployment guide](deployment.md) | Operators | Supabase, Render, Vercel, CI and rollback |
| [Test plan](test-plan.md) | QA, reviewers | Strategy, automated coverage and manual cases |
| [Security](security.md) | Engineers, reviewers | Threat model, controls, gaps and incident response |
| [User manual](user-manual.md) | Students, moderators, admins | Step-by-step usage and troubleshooting |
| [Design system](../design.md) | Design, frontend | Visual language, tokens and component rules |

## Documentation conventions

- Values such as `https://<ref>.supabase.co`, `<anon-key>` and `<project-id>` are placeholders. Never commit real secrets.
- Diagrams use Mermaid and render on GitHub, GitLab and many Markdown viewers.
- API examples use the production base URL. For local work replace it with `http://localhost:3000`.
- The app is a single-page React client with a separate Hono API. "Page" links are client-side routes unless marked as static.

## Current deployment

| Service | URL |
|---|---|
| Web | https://unimarky.runs-on.dev |
| API | https://unimarky-campus-hub.onrender.com |
| Data / auth / storage | Supabase project |

## Opening the Swagger UI

The API explorer loads `openapi.yaml` with a relative request, so serve the folder over HTTP:

```bash
npx serve docs -l 4173
# open http://localhost:4173/api.html
```

You can also import `docs/openapi.yaml` into [editor.swagger.io](https://editor.swagger.io), Postman or Insomnia.
