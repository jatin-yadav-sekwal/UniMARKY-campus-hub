# Security Documentation

**Scope:** UniMARKY web app, Hono API, Supabase (Auth, PostgreSQL, Storage), Vercel/Render deployment.

---

## 1. Security objectives

1. Only authenticated students can access campus data.
2. A user can only read and change content they are allowed to (owner, member, moderator, admin, same university).
3. Personal data (mobile number, ID card URL, auth identity) is never exposed publicly.
4. Account deletion is real, not cosmetic.
5. Abuse is limited: rate limits, payload caps, upload restrictions.
6. The browser cannot be tricked into executing injected content or calling the API cross-site.
7. Secrets stay server-side.

## 2. Assets and classification

| Asset | Sensitivity | Location |
|---|---|---|
| Supabase session/JWT | High | Browser local storage |
| `profiles.mobile_number`, `id_card_url` | High | Postgres, private API fields |
| Listings and community posts | Low/Medium | Postgres, public storage URLs |
| Database URL, anon key | High / public-by-design | Server env / web env |
| Audit log | Medium | Postgres |
| Uploaded images | Medium | Supabase Storage |

The anon key is public by design; the database password and any service-role key must never reach the browser.

## 3. Implemented controls

### Authentication
- Supabase Auth (email/password + Google OAuth).
- API verifies ES256 JWTs against Supabase JWKS; `sub` → `profiles.id`.
- Missing/invalid tokens → 401. Unverified/expired tokens are rejected.
- Password reset uses single-use email links; the reset page requires the recovery session.
- Onboarding gate: a user who has not completed onboarding can only read `/profiles/me` and submit onboarding.

### Authorization and tenancy
- `profiles.role`: `normal`, `superuser`, `userX`.
- Community role: `member` / `moderator`.
- `user_permissions`: scoped grants (global/university/department), with expiry.
- Feeds filter by the profile's `university_name`; mutations check ownership or moderation rights.
- Public profile endpoint returns only id, name, university, department, class and verification.

### Data
- RLS enabled on all public tables.
- Foreign keys cascade personal content and set-null shared references.
- Account deletion is a transaction that cleans content, hands over communities, clears reviewer references, deletes the profile and the `auth.users` row.
- Drizzle parameterizes queries; no string-built SQL or user-controlled identifiers.

### HTTP and browser
- Vercel headers: CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy.
- API: Hono `secureHeaders`, CORS allow-list, 1 MB body limit.
- Rate limits: 180/min general, 10/min onboarding, 5/hour account deletion; `Retry-After` on 429.
- Requests get a request id and structured logs; auth headers/bodies are not logged.

### Uploads
- Client accepts only JPG/PNG/WebP/GIF, max 10 MB; file extension derived from the MIME type.
- SVG is rejected (can carry script when opened directly).
- Storage buckets should enforce the same MIME/size allow-list.

### Privacy
- Cookie/storage notice on first visit, stored in local storage; reopenable from the footer.
- Privacy policy covers storage, account deletion and user rights.
- No advertising/analytics trackers.

## 4. Threat model (STRIDE)

| Threat | Example | Mitigation |
|---|---|---|
| Spoofing | Forged JWT / impersonation | JWKS signature verification; Supabase-issued tokens |
| Tampering | Editing another seller's listing | Server-side ownership checks; parameterized SQL |
| Repudiation | Admin denies approving a role | `audit_log` with actor/action/entity |
| Information disclosure | Cross-campus listing or mobile number | University scoping; private field list; RLS |
| Denial of service | Request flood, large bodies | Rate limits, body cap, edge plan (Cloudflare) |
| Elevation of privilege | Normal user calling admin routes | Role/permission middleware; community role checks |
| XSS | Malicious post or upload | React escaping, no HTML injection sinks, upload type limits, CSP |
| CSRF | Cross-site state change | Bearer token (not cookies) + CORS allow-list |
| SQL injection | Crafted query input | Drizzle parameterization; no raw string SQL |

## 5. OWASP Top 10 mapping

| Risk | Status | Notes |
|---|---|---|
| A01 Broken access control | Mitigated | Roles, membership, university scope, ownership checks |
| A02 Cryptographic failures | Managed | HTTPS/HSTS; Supabase handles password hashing |
| A03 Injection | Mitigated | Drizzle parameters; no `sql.raw`; React escaping |
| A04 Insecure design | Partial | Campus scoping and permissions designed; no formal abuse cases for every flow |
| A05 Security misconfiguration | Partial | Headers/CSP/CORS set; verify Supabase auth/redirect/storage settings |
| A06 Vulnerable components | Partial | `npm audit` shows moderate advisories; run regularly |
| A07 Auth failures | Partial | Strong auth, rate limits; no MFA or email-verification enforcement |
| A08 Data integrity | Partial | Migrations reviewed; no signed updates |
| A09 Logging/monitoring | Partial | Structured request logs; no central alerting/Sentry |
| A10 SSRF | Low | No user-supplied server-side URLs fetched |

## 6. Known gaps and roadmap

1. **Edge DDoS/WAF** — app rate limits are per instance. Put Cloudflare in front and add managed rules; move limits to a shared store for multi-instance.
2. **MFA** — enable TOTP for admins/superusers.
3. **Email verification** — require confirmed email before onboarding in production.
4. **CSP reporting** — start with `Content-Security-Policy-Report-Only`, then enforce; add a report endpoint.
5. **Dependency/secret scanning** — enable Dependabot and secret scanning on GitHub.
6. **Storage lifecycle** — delete orphaned images on listing/account deletion.
7. **Audit coverage** — log every admin action, including listing edits/deletes.
8. **Penetration test** — run before public launch.
9. **Backups** — verify PITR/restore drills.
10. **Session policy** — consider shorter access-token lifetime and forced sign-out on password change.

## 7. Incident response

1. **Detect** — alert on 5xx spikes, 429 spikes, auth failures, unusual admin actions.
2. **Contain** — rotate the leaked key/database password; revoke sessions; disable the affected route.
3. **Eradicate** — patch the root cause; add a regression test.
4. **Recover** — restore from backup if data was lost; verify `/healthz` and smoke tests.
5. **Learn** — write a short post-incident note; update this document.

Never paste secrets into tickets/logs. Rotate any key that appears in a screenshot, commit or chat.

## 8. Secure development checklist

- [ ] No secrets in the repo or frontend bundle.
- [ ] Every new route has auth + role/ownership checks.
- [ ] New tables have RLS and sensible FK actions.
- [ ] New uploads validate MIME/size and bucket policy.
- [ ] New external links use `rel="noopener noreferrer"`.
- [ ] No `dangerouslySetInnerHTML` unless sanitized.
- [ ] No raw SQL string interpolation.
- [ ] Rate limits considered for expensive/abusable routes.
- [ ] Tests updated; build and typecheck green.
- [ ] Security headers/CSP still allow only what is needed.

## 9. Disclosure

Report a vulnerability privately through the contact page; do not open a public issue with reproduction details. Include the affected route, impact and steps. Expect an acknowledgement before any public disclosure.
