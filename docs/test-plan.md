# Test Plan & Test Cases

**Product:** UniMARKY
**Version:** 1.0
**Date:** 28 November 2026

---

## 1. Objective

Verify that a student can create an account, complete onboarding, use all six campus services, manage a community or campus content according to their role, and delete their account — without cross-campus data leaks or broken builds.

## 2. Scope

| In scope | Out of scope |
|---|---|
| Auth, onboarding, password reset | Native mobile apps (removed) |
| Marketplace, Lost & Found, Food, Accommodation, Study | Payment or delivery flows |
| Communities, membership, moderation | Real-time chat |
| Roles, admin approval, account deletion | Automated ID verification |
| API authorization, rate limits, validation | Load testing at internet scale |
| Responsive UI, SEO metadata, 404s | Browser-specific visual regression |

## 3. Test strategy

| Level | What | Tool |
|---|---|---|
| Static | TypeScript, schema, route coverage | `tsc`, build scripts |
| Unit | Rate limiter, community successor, env validation | `node --test` |
| Integration (manual) | Auth → API → Supabase | Browser + DevTools |
| End-to-end (manual) | Student and admin journeys | Browser with seeded data |
| Security (manual) | 401/403, tenant isolation, uploads | curl + browser |
| Post-deploy | Health and auth enforcement | GitHub Actions smoke |

## 4. Environments and data

| Environment | Web | API | Data |
|---|---|---|---|
| Local | `http://localhost:5173` | `http://localhost:3000` | Supabase project or local Postgres |
| Production | `https://unimarky.runs-on.dev` | `https://unimarky-campus-hub.onrender.com` | Supabase production |

Test accounts: one `normal`, one `superuser`, one `userX` (admin). Use a throwaway account for deletion tests. Seed data exists for **Central University of Haryana**; a user from another university should see only that campus's content.

## 5. Entry and exit criteria

**Entry:** build passes, database migrated, buckets created, test accounts available.

**Exit:** all P0/P1 cases pass; no open critical/high defects; automated tests and build green.

## 6. Automated coverage

Run:

```bash
npm run typecheck
npm test
npm run build:web
```

Current suite: **12/12 passing**.

| ID | Test | Result |
|---|---|---|
| AT-01 | Rate limiter allows up to the limit | Pass |
| AT-02 | Rate limiter returns 429 + Retry-After | Pass |
| AT-03 | Different IPs have separate buckets | Pass |
| AT-04 | Window resets after expiry | Pass |
| AT-05 | Community successor prefers a moderator | Pass |
| AT-06 | Departing user is never successor | Pass |
| AT-07 | Falls back to a normal member | Pass |
| AT-08–12 | Environment validation | Pass |
| AT-13 | Web build + SEO page generation | Pass (build script) |
| AT-14 | Every app route has a Vercel rewrite and no catch-all | Pass (build script) |

**Not covered automatically:** database integration, auth flows, uploads, email delivery, UI behaviour.

## 7. Manual test cases

Status values: **Ready** (to execute), **Pass**, **Fail**, **Blocked**.

### 7.1 Authentication and onboarding

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-AUTH-01 | Sign up with email | `/auth` → Sign up → email/password → submit | Account created; confirmation or session | P0 | Ready |
| TC-AUTH-02 | Google sign-in | `/auth` → Continue with Google | OAuth completes; user lands in onboarding/dashboard | P0 | Ready |
| TC-AUTH-03 | Onboarding | Fill university + 10-digit mobile → Complete setup | Dashboard appears; no loop | P0 | Ready |
| TC-AUTH-04 | Onboarding validation | Empty university / 9-digit mobile | Inline/button disabled; no request | P1 | Ready |
| TC-AUTH-05 | Session refresh | Reload dashboard | Stays signed in | P1 | Ready |
| TC-AUTH-06 | Forgot password | `/auth` → Forgot password → email | Neutral confirmation; email arrives | P0 | Ready |
| TC-AUTH-07 | Reset password | Open email link → new password | Password updated; dashboard | P0 | Ready |
| TC-AUTH-08 | Invalid reset link | Open `/reset-password` without session | Clear invalid/expired message | P1 | Ready |
| TC-AUTH-09 | Logout | Sidebar → Log out | Returns to landing; protected routes redirect | P1 | Ready |
| TC-AUTH-10 | Logged-in landing | Visit `/` while signed in | Redirects to `/dashboard` | P1 | Ready |

### 7.2 Marketplace

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-MKT-01 | Browse | `/marketplace` | Only same-university items | P0 | Ready |
| TC-MKT-02 | Filter/search | Category + search | Matching results; empty state if none | P1 | Ready |
| TC-MKT-03 | Create listing | List an item → fill → submit | Item appears in feed and my listings | P0 | Ready |
| TC-MKT-04 | Image upload | Attach JPG/PNG/WebP | Uploads and displays; SVG rejected | P1 | Ready |
| TC-MKT-05 | Edit own | My listings → edit | Changes persist | P1 | Ready |
| TC-MKT-06 | Delete own | My listings → delete | Removed | P1 | Ready |
| TC-MKT-07 | Edit other | Call PATCH for another seller | 403 | P0 | Ready |
| TC-MKT-08 | Campus isolation | User from another university | Item not visible | P0 | Ready |

### 7.3 Lost & Found

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-LF-01 | Report lost | Report → type lost → submit | Appears in feed | P0 | Ready |
| TC-LF-02 | Report found | Type found | Appears with green accent | P1 | Ready |
| TC-LF-03 | Filter/search | Type tabs + search | Correct subset | P1 | Ready |
| TC-LF-04 | Resolve | Edit → status resolved | Status chip updates | P1 | Ready |
| TC-LF-05 | Delete own | Delete report | Removed | P1 | Ready |
| TC-LF-06 | Cross-campus | Other university | Not visible | P0 | Ready |

### 7.4 Food and Accommodation

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-FOOD-01 | List restaurants | `/food` | Seeded restaurants load, no 404 | P0 | Ready |
| TC-FOOD-02 | Detail + menu | Open restaurant | Menu groups and prices | P1 | Ready |
| TC-FOOD-03 | Menu item | Open a dish | Detail renders | P2 | Ready |
| TC-FOOD-04 | Superuser create | Add restaurant | Appears in list | P1 | Ready |
| TC-FOOD-05 | Non-superuser | Open management route | Redirect/403 | P0 | Ready |
| TC-ACC-01 | List stays | `/housing` | Seeded stays load, no 404 | P0 | Ready |
| TC-ACC-02 | Filters | PG/Hostel/Apartment | Correct subset | P1 | Ready |
| TC-ACC-03 | Detail | Open stay | Photos, amenities, rent, contact | P1 | Ready |
| TC-ACC-04 | Superuser CRUD | Add/edit/delete stay | Persists | P1 | Ready |

### 7.5 Study

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-STU-01 | Browse | `/study` | Department/year/category filters | P1 | Ready |
| TC-STU-02 | Download | Click download | File opens | P1 | Ready |
| TC-STU-03 | Superuser upload | Add study material | Appears in list | P1 | Ready |
| TC-STU-04 | Cross-campus | Other university | Not visible | P0 | Ready |

### 7.6 Communities

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-COM-01 | Discover | `/communities` | Campus communities | P1 | Ready |
| TC-COM-02 | Join/leave | Join then leave | Counts update | P1 | Ready |
| TC-COM-03 | Create | New community | Created; you are moderator | P1 | Ready |
| TC-COM-04 | Post | Member writes post | Appears at top | P0 | Ready |
| TC-COM-05 | Comment | Comment on post | Appears; count updates | P1 | Ready |
| TC-COM-06 | Moderation | Moderator deletes post/comment | Removed | P1 | Ready |
| TC-COM-07 | Roles | Moderator changes member role | Role persists | P2 | Ready |
| TC-COM-08 | Non-member post | API POST as non-member | 403 | P0 | Ready |

### 7.7 Profile, roles and account

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-PRO-01 | Edit profile | Change name/dept/class | Saves; success note | P1 | Ready |
| TC-PRO-02 | Avatar | Upload image | Updates in shell | P2 | Ready |
| TC-ROLE-01 | Request role | Request superuser + reason | Pending request | P1 | Ready |
| TC-ADM-01 | Approve | Admin approves | Role updates; audit entry | P0 | Ready |
| TC-ADM-02 | Reject | Admin rejects | Status rejected | P1 | Ready |
| TC-DEL-01 | Delete account | Profile → type DELETE → delete | Signed out; auth user gone | P0 | Ready |
| TC-DEL-02 | Delete confirmation | Wrong text | Button disabled | P1 | Ready |

### 7.8 Security and platform

| ID | Case | Steps | Expected | Pri | Status |
|---|---|---|---|---|---|
| TC-SEC-01 | No token | `GET /api/marketplace` | 401 | P0 | Ready |
| TC-SEC-02 | Tampered token | Modify JWT | 401 | P0 | Ready |
| TC-SEC-03 | Expired token | Wait/forge expiry | 401 | P1 | Ready |
| TC-SEC-04 | Rate limit | 181 requests/min | 429 + Retry-After | P1 | Ready |
| TC-SEC-05 | Body limit | POST >1 MB | 413 | P2 | Ready |
| TC-SEC-06 | Upload type | Upload SVG | Rejected client-side | P1 | Ready |
| TC-SEC-07 | Account delete limit | 6 deletes/hour | 429 | P2 | Ready |
| TC-UI-01 | Responsive | 320/390/768/1024/1440 | No overflow; menu works | P1 | Ready |
| TC-UI-02 | Cookie notice | First visit; accept; footer link | Shows once; reopens | P1 | Ready |
| TC-UI-03 | SEO | View source `/about`; `/does-not-exist` | Correct title/canonical; 404 | P1 | Ready |
| TC-UI-04 | Accessibility | Keyboard tab through forms | Visible focus; labels; no traps | P1 | Ready |

## 8. Defect management

| Severity | Definition | Action |
|---|---|---|
| Critical | Data loss, auth bypass, cross-campus leak | Stop release; fix immediately |
| High | Core flow broken (signup, listing, post) | Fix before submission |
| Medium | Wrong copy, layout break at one size | Fix in current cycle |
| Low | Polish, minor inconsistency | Backlog |

Record: id, title, environment, steps, expected/actual, evidence, severity, status.

## 9. Risks

- Email delivery depends on Supabase SMTP; reset tests may be blocked without it.
- Seed data is campus-specific; test with the matching university or seed another campus.
- In-memory rate limits reset on API restart.
- No browser automation; manual regression is required for UI changes.
