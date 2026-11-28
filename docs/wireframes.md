# UI/UX Wireframes

Low-fidelity layouts for the implemented screens. These are structural wireframes, not pixel specs; the visual language is in [design.md](../design.md).

---

## 0. Design system at a glance

| Token | Value |
|---|---|
| Ink | `#262522` |
| Muted text | `#66625c` / `#8f8b83` |
| Accent (links, primary) | `#3157d5` |
| Paper / bands | `#f7f6f3` |
| Hairline | `#e8e6e1`, or `rgba(67,63,56,.22)` on atmosphere |
| Category accents | blue `#3157d5`, green `#1f8a63`, red `#b3261e`, purple `#5751a7`, amber `#b4762a` |
| Display | Space Grotesk 400 |
| Body | DM Sans 400/500 |
| Mono metadata | DM Mono 9–11px, uppercase, tracking `.06em` |
| Radius | 4px (controls/cards) |
| Frame | three vertical hairlines: left margin, sidebar/content divider, right margin |
| Breakpoints | 1150px, 900px, 820px, 620px |

**Rules:** white surfaces, 1px frames, no gradients on content cards, one accent per category, uppercase only for metadata, 40px+ touch targets, visible focus ring.

---

## 1. Public landing (`/`)

```text
+----------+-------------------------------------------------------+
| UNIMARKY |  STUDENT LIFE                    CAMPUS / 01         |
| CAMPUS   |                                                       |
| LIFE     |  University life,                                     |
| 01 ...   |  in one place.                    [ecosystem diagram] |
| 02 ...   |  Buy and sell on campus, ...                          |
| 03 ...   |  [Explore ecosystem] [Browse marketplace]             |
| ...      |                                                       |
| [Log in] |  ---------------------------------------------------  |
| [Sign up]|  01 / A CONNECTED CAMPUS                              |
|          |  Useful campus services, in one place.                |
|          |  ---------------------------------------------------  |
|          |  02 / MARKETPLACE     listing board example           |
|          |  03 / COMMUNITY       field-note visual               |
|          |  04 / STUDY           note card                       |
|          |  05 / ACCOMMODATION   building-lines visual           |
|          |  06 / FOOD            menu visual                     |
|          |  07 / INTEGRATION     six-service index               |
|          |  08 / FAQs            accordion                       |
|          |  closing band: Find what you need on campus.          |
|          |  footer: EXPLORE / COMPANY / CONNECT + legal          |
+----------+-------------------------------------------------------+
```

Mobile: sidebar becomes a sticky header (brand + menu); sections stack; the frame collapses to two outer hairlines.

## 2. Auth (`/auth`)

```text
+---------------------------+-------------------------------+
| UNIMARKY                  |  01 / SIGN IN                 |
|                           |  Welcome back                 |
| Everything campus,        |  [ Continue with Google ]     |
| through one sign-in.      |  ---- or continue with email  |
|                           |  [ Log in | Sign up ]         |
| lead + four benefits      |  Email    [______________]    |
| (marketplace, community,  |  Password [______________]    |
| study, housing)           |          Forgot password?     |
|                           |  [ Sign in ]                  |
| UNIMARKY / CAMPUS LIFE    |  Terms and privacy            |
+---------------------------+-------------------------------+
```

Mobile: intro hidden; only the form, centred. Forgot/reset pages use a single centred card.

## 3. Onboarding (`/onboarding`)

```text
+---------------------------------------------+
| 01 / WELCOME                                |
| Set up your profile.                        |
| A couple of details and you are ready.      |
|                                             |
| University   [ Select your university  v ]  |
| Mobile       [ 10-digit number           ]  |
|                                             |
| [ Complete setup ]                          |
+---------------------------------------------+
```

## 4. Dashboard (`/dashboard`)

```text
+-----------------------------------------------------------------+
| 01 / DASHBOARD                                STUDENT WORKSPACE  |
| Your campus, in one place.                    -----------------  |
| lead                                          UNIMARKY / CAMPUS  |
+-----------------------------------------------------------------+
| MARKETPLACE              | LOST & FOUND                         |
| 35 icon   03 saved       | 35 icon   07 reported                |
| - item 1                 | - item 1                             |
| - item 2                 | - item 2                             |
| View all              [+] | View all                         [+] |
+-----------------------------------------------------------------+
| 02 / EXPLORE CAMPUS --------------------------- SIX SERVICES     |
| 01 [icon] Marketplace     Buy and sell items               ->   |
| 02 [icon] Lost & Found    Find missing items               ->   |
| 03 [icon] Study           Academic resources               ->   |
| 04 [icon] Food            Campus dining                    ->   |
| 05 [icon] Housing         Find a place to stay             ->   |
| 06 [icon] Communities     Clubs and groups                 ->   |
+-----------------------------------------------------------------+
```

## 5. Marketplace (`/marketplace`)

```text
+-----------------------------------------------------------------+
| 01 / MARKETPLACE                                CAMPUS MARKETPLACE|
| Campus deals.                                   ------------------|
| lead                                            N ITEMS           |
| [My listings] [List an item]                                     |
+-----------------------------------------------------------------+
| All | Textbooks | Electronics | Dorm Decor | ...   [ Search... ] |
+-----------------------------------------------------------------+
| +-----------+ +-----------+ +-----------+ +-----------+         |
| |  image    | |  image    | |  image    | |  image    |         |
| | Negotiable| | Fixed     | | Negotiable| | ...       |         |
| | TEXTBOOKS | | ELECTRONICS| | DORM     | |           |         |
| | Title     | | Title     | | Title     | |           |         |
| | ₹450  LN  | | ₹950  GR  | | ₹380  GD  | |           |         |
| +-----------+ +-----------+ +-----------+ +-----------+         |
|                                              [ View more ]      |
+-----------------------------------------------------------------+
```

## 6. Marketplace item (`/marketplace/:id`)

```text
+---------------------------+-------------------------------------+
| [ photo ]                 |  TEXTBOOKS / LIKE NEW               |
| [ thumbs ]                |  Engineering Mathematics            |
|                           |  ₹450  ·  Negotiable                |
|                           |  description                        |
|                           |  Seller                             |
|                           |  [avatar] Name                      |
|                           |  [ Call seller ]                    |
+---------------------------+-------------------------------------+
```

## 7. Lost & Found (`/lost-found`)

```text
+-----------------------------------------------------------------+
| 01 / LOST & FOUND                              CAMPUS REPORTS    |
| Lost and found.                                                 |
| [My listings] [Report item]                                     |
+-----------------------------------------------------------------+
| All items | Lost items (dot) | Found items (dot)  [ Search... ] |
+-----------------------------------------------------------------+
| +-------------+ +-------------+ +-------------+                 |
| |   photo     | |   photo     | |   photo     |                 |
| | LOST  Active| | FOUND Active| | LOST  Resolved|               |
| | Black Casio | | Blue bottle | | ID card     |                 |
| | library     | | sports      | | main gate   |                 |
| | description | | description | | description |                 |
| | Name · date | | Name · date | | Name · date |                 |
| +-------------+ +-------------+ +-------------+                 |
+-----------------------------------------------------------------+
```

## 8. Food and Housing (`/food`, `/housing`)

```text
+-----------------------------------------------------------------+
| 01 / FOOD                                       CAMPUS KITCHENS  |
| Good food. Good company.                                        |
| [All cuisines] [North Indian] [South Indian] ... [ Search... ]  |
| +----------------+ +----------------+ +----------------+        |
| |    photo       | |    photo       | |    photo       |        |
| | Campus Dhaba   | | The Chai Point | | South Spice    |        |
| | 4.4 · ₹80-200  | | 4.2 · ₹40-120  | | 4.5 · ₹90-220  |        |
| | veg · budget   | | cafe · snacks  | | veg · dosa     |        |
| +----------------+ +----------------+ +----------------+        |
+-----------------------------------------------------------------+
| 01 / ACCOMMODATION                              PLACES TO LAND   |
| [All] [PG] [Hostel] [Apartment]                [ Search... ]    |
| +----------------+ +----------------+ +----------------+        |
| |    photo       | |    photo       | |    photo       |        |
| | Sunrise PG     | | Shanti Hostel  | | Campus Nest    |        |
| | PG · ₹6.5-8k   | | Hostel · 7-9.5k| | Flat · 12-18k  |        |
| | amenities      | | amenities      | | amenities      |        |
+-----------------------------------------------------------------+
```

## 9. Study (`/study`)

```text
+-----------------------------------------------------------------+
| 01 / STUDY                                     SHARED LEARNING   |
| Make space for what's next.                                     |
| Department [ v ]  Year [ v ]  Category [ v ]     [ Search... ]  |
| +-------------------------------------------------------------+ |
| | [icon] Title             Subject · Year · Category   [Get] | |
| |        description                                          | |
| +-------------------------------------------------------------+ |
```

## 10. Communities (`/communities`)

```text
+-----------------------------------------------------------------+
| 01 / COMMUNITIES                                CAMPUS GROUPS    |
| Campus communities.                                             |
| [ New community ]                                               |
| [ Search... ]  Category [ v ]   [ Discover | My communities ]   |
| +--------------------+ +--------------------+ +----------------+ |
| | Coding Club        | | Photography Society| | Debate Circle  | |
| | TECHNOLOGY         | | ARTS               | | ACADEMIC       | |
| | description        | | description        | | description    | |
| | 42 members 18 posts| | 30 members 12 posts| | 25 members 9   | |
| | [settings] Open Join| | [settings] Open Join| | Open Join     | |
+-----------------------------------------------------------------+
```

## 11. Community detail (`/communities/:id`)

```text
+-----------------------------------------------------------------+
| Coding Club                           TECHNOLOGY · 42 members   |
| description                                      [Joined/Join] |
| Feed | Members | Manage                                         |
+-----------------------------------------------------------------+
| [avatar] Write a post...                    [photo] [Post]      |
| --------------------------------------------------------------- |
| [avatar] Name · 2h                                              |
| Post content                                                    |
| [image]                                                         |
| 3 comments · Like · Delete (author/mod)                         |
| --------------------------------------------------------------- |
```

Moderators additionally see member role controls and community settings.

## 12. Profile and account (`/profile`)

```text
+-----------------------------------------------------------------+
| 01 / PROFILE                                                    |
| [avatar] Name · university · role                               |
| Account panel: email, university, mobile (read-only)            |
| Editable panel: full name, department, class, mobile            |
| [ Save changes ]                                                |
| --------------------------------------------------------------- |
| Delete account                                                  |
| This permanently removes your profile, listings, posts...       |
| [ Type DELETE to confirm ] [ Delete account ]                   |
+-----------------------------------------------------------------+
```

## 13. Admin / superuser

```text
+-----------------------------------------------------------------+
| 02 / ADMIN                                                     |
| Role requests                                                   |
| [Pending] [Approved] [Rejected]                                 |
| +-------------------------------------------------------------+ |
| | [avatar] Name · requested role · reason      [Approve][Reject]| |
| +-------------------------------------------------------------+ |
| Superuser: My restaurants / stays / study material              |
| [ Add restaurant ] [ Add accommodation ] [ Add study material ] |
```

## 14. Responsive behaviour

| Width | Behaviour |
|---|---|
| >1150 | Full sidebar (250px), wide grids, three-rule frame |
| 901–1150 | Sidebar 218px, tighter gutters, 2-column grids |
| 821–900 | Sidebar hidden, sticky mobile header + menu, stacked hero/market |
| 621–820 | Single-column cards, stacked controls, stacked head actions |
| ≤620 | 20px gutter, single column, full-width cookie notice, 2-column footer |

All screens keep focus rings, 40px+ targets, no horizontal overflow, and text inside the page rules.
