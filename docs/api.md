# API Documentation

**Base URL (production):** `https://unimarky-campus-hub.onrender.com`
**Base URL (local):** `http://localhost:3000`
**Format:** JSON over HTTPS
**Machine-readable contract:** [openapi.yaml](openapi.yaml) · **Explorer:** [api.html](api.html)

---

## 1. Authentication

Every `/api/*` route except `/healthz` requires a Supabase access token:

```http
Authorization: Bearer <supabase-access-token>
```

The API verifies the JWT against the project's JWKS (ES256), takes `sub` as the user id and loads `profiles`. A missing or invalid token returns `401`. Users who have not completed onboarding can only read `/api/profiles/me` and call `PATCH /api/profiles/onboarding`.

Auth itself (sign-up, sign-in, OAuth, password reset) is handled by the Supabase JS SDK in the browser, not by this API.

## 2. Common behaviour

### Pagination

Listing endpoints accept:

| Param | Default | Meaning |
|---|---|---|
| `limit` | 20 | Page size |
| `offset` | 0 | Rows to skip |

They return:

```json
{ "items": [], "hasMore": false, "total": 0 }
```

### Errors

```json
{ "error": "Human-readable message" }
```

| Status | Meaning |
|---|---|
| 400 | Validation failed / bad input |
| 401 | Missing or invalid token |
| 403 | Authenticated but not allowed |
| 404 | Resource not found (or not in your campus) |
| 410 | Retired endpoint (legacy feed/announcements) |
| 413 | Body larger than 1 MB |
| 429 | Rate limited (see `Retry-After`) |
| 500 | Server error |

### Rate limits

| Scope | Limit |
|---|---|
| General `/api/*` | 180 requests / minute / IP |
| `PATCH /api/profiles/onboarding` | 10 / minute / IP |
| `DELETE /api/account` | 5 / hour / IP |
| Body size | 1 MB |

Limits are per API instance (in-memory). See [security.md](security.md) for the edge plan.

### Roles

`profiles.role` is `normal`, `superuser` or `userX` (admin). Community roles are `member` or `moderator`.

---

## 3. Profiles and onboarding

| Method | Path | Description |
|---|---|---|
| GET | `/api/profiles/me` | Current profile + `onboardingCompleted`, `profileExists` |
| PATCH | `/api/profiles/me` | Update name, university, department, class, mobile |
| PATCH | `/api/profiles/onboarding` | Save university + mobile and mark onboarding complete |
| GET | `/api/profiles/:id` | Public profile fields only |
| PATCH | `/api/profiles/:id` | Update your own profile (same fields) |
| POST | `/api/profiles/:id/verify` | Reserved; returns 501 |

**Onboarding**

```http
PATCH /api/profiles/onboarding
Content-Type: application/json

{
  "universityName": "Central University of Haryana",
  "mobileNumber": "9876543210",
  "fullName": "Jatin Yadav"
}
```

`universityName` and a 10-digit `mobileNumber` are required. The row is inserted if missing; otherwise updated.

**GET /api/profiles/me** always returns 200 for a valid token:

```json
{
  "id": "uuid",
  "fullName": "Jatin Yadav",
  "universityName": "Central University of Haryana",
  "department": "CSE",
  "class": "3rd year",
  "role": "normal",
  "isVerified": false,
  "onboardingCompleted": true,
  "profileExists": true
}
```

---

## 4. Marketplace

| Method | Path | Description |
|---|---|---|
| GET | `/api/marketplace?limit=&offset=&category=` | Campus listings |
| POST | `/api/marketplace` | Create a listing |
| GET | `/api/marketplace/my-listings` | Your listings |
| GET | `/api/marketplace/:id` | Item detail |
| PATCH | `/api/marketplace/:id` | Edit your listing |
| DELETE | `/api/marketplace/:id` | Delete your listing |

Create body:

```json
{
  "title": "Engineering Mathematics, B.S. Grewal",
  "description": "Clean copy, no torn pages.",
  "price": 450,
  "category": "textbooks",
  "condition": "like-new",
  "isNegotiable": true,
  "imageUrl": "https://<ref>.supabase.co/storage/v1/object/public/marketplace-images/..."
}
```

Categories: `textbooks`, `electronics`, `dorm-decor`, `fashion`, `services`, `fitness`.
Conditions: `new`, `like-new`, `great`, `good`, `fair`.

---

## 5. Lost & Found

| Method | Path | Description |
|---|---|---|
| GET | `/api/lostfound?limit=&offset=&type=&q=` | Reports for your campus |
| POST | `/api/lostfound` | Report a lost/found item |
| GET | `/api/lostfound/my-listings` | Your reports |
| GET | `/api/lostfound/:id` | Report detail |
| PATCH | `/api/lostfound/:id` | Edit / mark resolved |
| DELETE | `/api/lostfound/:id` | Delete your report |

```json
{
  "itemName": "Black Casio calculator",
  "type": "lost",
  "location": "Central library, Block B",
  "description": "Left it on the second-floor reading table.",
  "imageUrl": null
}
```

`type` is `lost` or `found`; `status` is `open` or `resolved`.

---

## 6. Food

| Method | Path | Description |
|---|---|---|
| GET | `/api/food?limit=&offset=&cuisine=` | Campus restaurants |
| GET | `/api/food/:id` | Restaurant + menu |
| GET | `/api/food/:id/menu?category=` | Menu only |
| GET | `/api/food/menu-item/:id` | Single dish |
| GET | `/api/food/my-listings` | Superuser’s restaurants |
| POST | `/api/food` | Create restaurant (superuser) |
| PATCH | `/api/food/:id` | Edit restaurant |
| DELETE | `/api/food/:id` | Delete restaurant |
| POST | `/api/food/:id/menu` | Add menu item |
| PATCH | `/api/food/menu/:id` | Edit menu item |
| DELETE | `/api/food/menu/:id` | Delete menu item |

---

## 7. Accommodation

| Method | Path | Description |
|---|---|---|
| GET | `/api/accommodation?limit=&offset=&type=` | Campus stays |
| GET | `/api/accommodation/:id` | Stay detail (images parsed to an array) |
| GET | `/api/accommodation/my-listings` | Superuser’s stays |
| POST | `/api/accommodation` | Create stay |
| PATCH | `/api/accommodation/:id` | Edit stay |
| DELETE | `/api/accommodation/:id` | Delete stay |

`type` is `PG`, `Hostel` or `Apartment`. `images` is sent as an array and stored as JSON.

---

## 8. Study

| Method | Path | Description |
|---|---|---|
| GET | `/api/study/departments` | Department options |
| GET | `/api/study?limit=&offset=&department=&year=&category=` | Resources |
| GET | `/api/study/mine` | Your uploads |
| POST | `/api/study` | Upload resource (superuser) |
| DELETE | `/api/study/:id` | Delete resource |

---

## 9. Communities

| Method | Path | Description |
|---|---|---|
| GET | `/api/communities?limit=&offset=&q=&category=` | Discover |
| GET | `/api/communities/mine` | Communities you joined |
| POST | `/api/communities` | Create (permission-gated) |
| GET | `/api/communities/:id` | Detail + `myRole`, `canModerate` |
| PATCH | `/api/communities/:id` | Edit / archive |
| DELETE | `/api/communities/:id` | Delete (owner/admin) |
| POST | `/api/communities/:id/join` | Join |
| DELETE | `/api/communities/:id/join` | Leave |
| GET | `/api/communities/:id/members` | Members + roles |
| PATCH | `/api/communities/:id/members/:memberId` | Change role |
| DELETE | `/api/communities/:id/members/:memberId` | Remove member |
| GET | `/api/communities/:id/posts` | Feed |
| POST | `/api/communities/:id/posts` | Post (member) |
| DELETE | `/api/communities/:id/posts/:postId` | Delete post (author/mod) |
| GET | `/api/communities/:id/posts/:postId/comments` | Comments |
| POST | `/api/communities/:id/posts/:postId/comments` | Comment |
| DELETE | `/api/communities/:id/posts/:postId/comments/:commentId` | Delete comment |

Create community body:

```json
{
  "name": "Coding Club",
  "description": "Weekly builds, workshops and hackathon teams.",
  "category": "technology"
}
```

---

## 10. Dashboard, roles and account

| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/summary` | Recent marketplace + lost/found activity |
| POST | `/api/role-requests` | Request superuser with a reason |
| GET | `/api/role-requests/mine` | Your requests |
| GET | `/api/role-requests` | All requests (admin) |
| PATCH | `/api/role-requests/:id` | Approve/reject (admin) |
| DELETE | `/api/account` | Delete the signed-in account |

**Delete account** removes owned listings, reports, posts and comments, transfers or removes owned communities, clears reviewer references, deletes the profile and finally the `auth.users` row. The client signs out locally afterwards.

---

## 11. Health and legacy

| Method | Path | Description |
|---|---|---|
| GET | `/healthz` | `{ "ok": true }` (public) |
| GET | `/api/social` | Legacy feed (archive/410 behaviour) |
| POST | `/api/social/*` | Returns 410 (retired) |

See `apps/api/server/routes/social.ts` for the exact retirement responses.

---

## 12. Using the OpenAPI spec

- Import [openapi.yaml](openapi.yaml) into Swagger Editor, Postman or Insomnia.
- Or serve this folder and open [api.html](api.html):

```bash
npx serve docs -l 4173
# http://localhost:4173/api.html
```

The spec documents the core surface (auth, profiles, marketplace, lost & found, food, accommodation, communities, roles, account). The tables above are the complete route list.
