# Software Requirements Specification (SRS)

**Project:** UniMARKY — campus platform for university students
**Version:** 1.0
**Date:** 28 November 2026
**Status:** Implemented MVP

---

## 1. Introduction

### 1.1 Purpose

This document defines the requirements for UniMARKY, a web platform that gives university students one account for the marketplace, communities, study material, accommodation, food and lost & found. It is the reference for design, implementation, testing and academic review.

### 1.2 Scope

UniMARKY is a multi-university web application. Each student signs up, selects a university, and sees only the content for that campus. The system includes:

- student registration, login, password reset and onboarding;
- a campus marketplace;
- campus communities with posts and comments;
- study resources;
- accommodation and food directories;
- lost & found reports;
- student profiles and role requests;
- superuser and admin management;
- account deletion and privacy controls.

Out of scope for this version: native mobile apps, real-time chat, payments, delivery, email digests, and automated ID verification.

### 1.3 Definitions

| Term | Meaning |
|---|---|
| Campus / tenant | A university. Most content is scoped by `university_name`. |
| Student | A signed-in user with the `normal` role. |
| Superuser | A student granted `superuser` to manage food, accommodation and study content. |
| Admin | A `userX` account with campus-wide moderation and role approval. |
| Community moderator | A member with the `moderator` role inside one community. |
| Listing | A marketplace item, lost/found report, restaurant, menu item, stay or study resource. |
| Onboarding | The step where a new user selects a university and mobile number. |

---

## 2. Overall description

### 2.1 Product perspective

UniMARKY replaces scattered campus WhatsApp groups and notice boards with one campus-scoped platform. It is a client-server system: a React single-page app, a Hono API, PostgreSQL via Supabase, Supabase Auth and Storage.

### 2.2 User classes

| Actor | Description | Main capabilities |
|---|---|---|
| Guest | Not signed in | Browse landing, about, contact, terms, privacy, university pages; sign up/log in |
| Student | `normal` | Marketplace, communities, study, food, housing, lost & found, profile, account deletion |
| Superuser | `superuser` | Student capabilities + manage restaurants, menus, accommodation, study material |
| Admin | `userX` | All student capabilities + approve roles, manage users/listings, review content |
| Community moderator | Member role in a community | Edit community, remove posts/comments, manage members |

### 2.3 Operating environment

- Modern desktop and mobile browsers (Chrome, Edge, Safari, Firefox).
- Web hosted on Vercel; API on Render; data/auth/storage on Supabase (PostgreSQL 17).
- HTTPS everywhere; responsive from 320 px to wide desktop.

### 2.4 Constraints

- One account belongs to one university at a time (selected during onboarding).
- Student identity is established by the account + university selection; document verification is not automated.
- Content is campus-scoped; there is no cross-campus marketplace.
- The API is stateless per instance; rate limiting is per instance.

---

## 3. Functional requirements

Priority: **M** = must, **S** = should, **C** = could.

### 3.1 Authentication and onboarding

| ID | Requirement | Priority |
|---|---|---|
| FR-AUTH-01 | A visitor can sign up with email/password or Google. | M |
| FR-AUTH-02 | A signed-in user can request a password reset by email and set a new password from the emailed link. | M |
| FR-AUTH-03 | A new user is routed to onboarding until a university and 10-digit mobile number are saved. | M |
| FR-AUTH-04 | A completed user is routed to the dashboard, never back to onboarding. | M |
| FR-AUTH-05 | A signed-in visitor to `/` is redirected to the dashboard. | S |
| FR-AUTH-06 | A user can sign out from the sidebar or mobile menu. | M |
| FR-AUTH-07 | A user can delete their account after typing `DELETE`; owned content is removed or transferred. | M |

### 3.2 Profile

| ID | Requirement | Priority |
|---|---|---|
| FR-PRO-01 | A user can view and edit name, department, class and mobile number. | M |
| FR-PRO-02 | A user can upload an avatar; only JPG/PNG/WebP/GIF up to 10 MB is accepted. | S |
| FR-PRO-03 | A user can request a superuser role with a reason. | M |
| FR-PRO-04 | Public profile fields exclude mobile number and ID card URL. | M |

### 3.3 Marketplace

| ID | Requirement | Priority |
|---|---|---|
| FR-MKT-01 | A user can browse items for their university with pagination. | M |
| FR-MKT-02 | A user can filter by category and search by title/description. | M |
| FR-MKT-03 | A user can create a listing with title, price, category, condition, description and optional photo. | M |
| FR-MKT-04 | A seller can edit or delete their own listing. | M |
| FR-MKT-05 | A user can view seller contact details on an item page. | M |
| FR-MKT-06 | Only the owner (or an admin) can modify a listing. | M |

### 3.4 Lost & Found

| ID | Requirement | Priority |
|---|---|---|
| FR-LF-01 | A user can report a lost or found item with location, description and optional photo. | M |
| FR-LF-02 | A user can filter by lost/found and search. | S |
| FR-LF-03 | A reporter can mark an item resolved, edit or delete it. | M |
| FR-LF-04 | Reports are visible only to the same university. | M |

### 3.5 Food

| ID | Requirement | Priority |
|---|---|---|
| FR-FOOD-01 | A user can browse restaurants for their university. | M |
| FR-FOOD-02 | A user can open a restaurant, view details and its menu by category. | M |
| FR-FOOD-03 | A superuser can create, edit and delete restaurants and menu items. | M |
| FR-FOOD-04 | Prices, ratings, veg/non-veg and availability are shown. | S |

### 3.6 Accommodation

| ID | Requirement | Priority |
|---|---|---|
| FR-ACC-01 | A user can browse PGs, hostels and apartments for their university. | M |
| FR-ACC-02 | A user can filter by type, view photos, amenities, rent range and contact. | M |
| FR-ACC-03 | A superuser can create, edit and delete stays. | M |

### 3.7 Study

| ID | Requirement | Priority |
|---|---|---|
| FR-STU-01 | A user can browse resources by department, year, subject and category. | M |
| FR-STU-02 | A user can download a resource. | M |
| FR-STU-03 | A superuser can upload and delete resources. | M |

### 3.8 Communities

| ID | Requirement | Priority |
|---|---|---|
| FR-COM-01 | A user can discover communities and join/leave. | M |
| FR-COM-02 | A user can create a community (permission-gated). | M |
| FR-COM-03 | Members can post and comment; authors and moderators can delete. | M |
| FR-COM-04 | Moderators can edit the community, change member roles and remove members. | M |
| FR-COM-05 | A community is scoped to one university. | M |

### 3.9 Administration

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | An admin can list pending role requests and approve/reject them. | M |
| FR-ADM-02 | An admin can view and manage campus content and users. | S |
| FR-ADM-03 | Privileged actions are written to `audit_log`. | S |

### 3.10 Public site and privacy

| ID | Requirement | Priority |
|---|---|---|
| FR-WEB-01 | Public pages explain the product and link to real routes. | M |
| FR-WEB-02 | Public university pages describe each configured campus and link to the services. | S |
| FR-WEB-03 | The first visit shows a cookie/storage notice; the choice is remembered and can be reopened from the footer. | M |
| FR-WEB-04 | The privacy policy explains storage, account deletion and user rights. | M |

---

## 4. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | Public pages load on mid-range mobile in under 3 s on a warm cache. | S |
| NFR-PERF-02 | API read endpoints respond in under 500 ms at p95 for normal campus sizes. | S |
| NFR-SEC-01 | All traffic over HTTPS; HSTS, CSP, frame and content-type protections enabled. | M |
| NFR-SEC-02 | Every API call except health is authenticated with a Supabase JWT. | M |
| NFR-SEC-03 | Users can only read/write data allowed by role, membership and university scope. | M |
| NFR-SEC-04 | Rate limits protect onboarding, account deletion and general API traffic. | M |
| NFR-PRIV-01 | Mobile number and ID card URL are never exposed by public profile endpoints. | M |
| NFR-PRIV-02 | Account deletion removes personal content and the auth identity. | M |
| NFR-USE-01 | Responsive from 320 px; visible focus states; no horizontal scroll. | M |
| NFR-USE-02 | Core actions reachable in three clicks from the dashboard. | S |
| NFR-AVAIL-01 | API health endpoint for uptime checks. | M |
| NFR-MAINT-01 | TypeScript across web/API; typed DB schema; tests in CI. | M |
| NFR-SCALE-01 | Pagination on every listing feed. | M |
| NFR-COMP-01 | Cookie consent and privacy policy available without an account. | M |

---

## 5. Assumptions and dependencies

- Supabase provides Auth, PostgreSQL and Storage; the API connects with the project database URL.
- The frontend is served by Vercel and proxies `/api` to Render.
- Students have a browser and a valid email or Google account.
- University names are stored as text on the profile and content rows; changing a university is a profile update.
- Email delivery for password reset and signup confirmation relies on Supabase's configured SMTP.

## 6. Out of scope (this release)

- Native iOS/Android apps.
- In-app payments, escrow or delivery.
- Real-time chat/notifications.
- Automated student ID verification.
- Multi-university accounts (one campus per account).
- Recommendation algorithms.

## 7. Key use cases

### UC-01 Register and onboard
1. Guest signs up with email/Google.
2. System creates the auth user.
3. Onboarding asks for university + mobile.
4. API saves the profile and marks onboarding complete.
5. Student lands on the dashboard.

### UC-02 Sell an item
1. Student opens Marketplace → List an item.
2. Fills title, price, category, condition, description, photo.
3. Uploads the photo to `marketplace-images`.
4. Listing is saved for their university.
5. Other students can find it, open it and contact the seller.

### UC-03 Report a lost item
1. Student opens Lost & Found → Report item.
2. Chooses lost/found, adds name, location, description, photo.
3. Report appears in the campus feed.
4. Owner or reporter marks it resolved.

### UC-04 Join a community and post
1. Student discovers a community and joins.
2. Opens the feed, writes a post (optionally with an image).
3. Members comment; moderators can remove content.
4. The community moderator can change roles or remove members.

### UC-05 Approve a role request
1. Student requests superuser with a reason.
2. Admin opens the admin dashboard and reviews the request.
3. Approving changes the profile role and creates audit history.
4. The student can now manage food/accommodation/study content.

## 8. Acceptance criteria

The release is accepted when:

- a new user can sign up, onboard, use all six services, and delete their account;
- campus scoping is enforced on every feed and mutation;
- unauthorized API calls return 401/403 and privileged actions are audited;
- automated API tests pass and the web build passes;
- the public site, privacy policy and cookie notice are reachable without an account;
- no horizontal overflow at 320/390/768/1024/1440 px.
