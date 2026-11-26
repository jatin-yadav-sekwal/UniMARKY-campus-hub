# Unimarky design guide

Use this document as the visual reference when extending or restyling the website. The goal is to preserve one Unimarky look across every page and component — not to introduce a separate style for each section.

> **Revision 2 — audit of the new landing page.**
> The landing page was rebuilt from the v0 design in `project/` and is now the reference implementation. This revision replaces the earlier aspirational notes with values taken from that implementation. Two things changed from Revision 1:
> 1. The reference implementation is `apps/web/src/features/landing/` (a Vite + React Router app), not `app/globals.css` (the Next.js scaffold in `project/`).
> 2. The palette, type scale, spacing and components below are the values the landing actually renders. Where the current app tokens disagree (e.g. accent is orange, not blue), a migration table is given in [§10](#10-implementation-notes--migration).
>
> **Addendum — page pass underway.** Pages are migrated to this system one at a time, without changing global tokens or the shared protected shell until the direction is approved. A shared, opt-in primitives layer (`.um-editorial`) carries the reusable part of the system to each page. See the [migration log](#migration-log).

## 1. Source of truth and files

| What | Where |
| --- | --- |
| Design tokens (Tailwind `@theme`) | `apps/web/src/index.css` |
| Landing reference stylesheet | `apps/web/src/features/landing/landing.css` |
| Landing reference markup | `apps/web/src/features/landing/LandingPage.tsx` |
| Landing shell (sidebar + mobile header) | `apps/web/src/features/landing/SiteNavigation.tsx` |
| Landing footer | `apps/web/src/features/landing/SiteFooter.tsx` |
| Hash + router link helper | `apps/web/src/features/landing/LandingLink.tsx` |
| Shared editorial primitives (migrated pages) | `apps/web/src/styles/editorial.css` |
| Brand logo (wordmark) | `apps/web/src/components/layout/file.svg` |
| Brand mark (icon) | `apps/web/src/assets/brand-mark.svg` |
| Original v0 source (reference only) | `project/` — never build or import from it |

The landing stylesheet is fully scoped to `.um-landing`, so it can coexist with the rest of the app while pages are migrated. New work should reuse the same tokens and patterns rather than copy literals.

**Shared primitives for the page pass.** Instead of copying the landing's values into every page, a second scoped stylesheet — `apps/web/src/styles/editorial.css` — exposes the reusable part of the system under `.um-editorial` (base typography, `h1`/`h2`/`h3`, `.section-label`, `.text-link`, `.button` + `-primary`/`-secondary`/`-block`, `.field`/`.field-label`/`.field-input`, `.alert` + `-error`/`-success`/`-info`, `.surface`, `.band`, `.rule`, `.page-rules`, focus rings, reduced motion). It is imported once in `main.tsx`. A page opts in by wrapping its root in `.um-editorial` and adding one page-local stylesheet under a second class (e.g. `.um-auth`, `.um-dashboard`). Because it is scoped, importing it changes nothing until a page opts in.

## 2. Design direction

A warm, editorial campus guide: clean white space and fine rules, paired with a soft, diffused color atmosphere. Contemporary, calm, useful. Prefer clear navigation, direct copy and a small number of considered details over dense layouts, decorative slogans, heavy cards, or generic dashboard styling.

## 3. Color

### Core palette (as rendered by the landing page)

| Role | Value | Notes |
| --- | --- | --- |
| Page / sidebar background | `#ffffff` | Canvas and sidebar stay white. |
| Primary text | `#262522` | Warm near-black; headings use `#24231f`. |
| Secondary text | `#66625c` | Supporting copy; metadata steps down to `#77736b`. |
| Tertiary / metadata | `#8f8b83` | Mono labels and quiet notes. |
| Brand blue | `#3157d5` | Primary buttons, links, active nav, focus rings. |
| Brand blue (hover/pressed) | `#2446b9` | Primary button hover. |
| Link blue (on white) | `#2949b4` | Text links with `rgba(49,87,213,.38)` underline. |
| Violet | `#5751a7` | Hero heading emphasis, feature icons, small graphic accents. |
| Warm heading emphasis | `#716c62` | Section-heading emphasis spans (calmer than violet). |
| Warm surface | `#f5f4f1` | Quiet panels and secondary controls. |
| Warm band | `#f7f6f3` | Closing / full-bleed quiet section. |
| Hairline border | `#e8e6e1` | Footer and app-surface dividers. |
| Warm hairline (on gradient) | `rgba(67,63,56,.22)` | Section rules and feature dividers. |
| Warm outline | `rgba(71,65,58,.25)` | Diagram and illustration frames. |

`#e8e6e1` is the token value for hardware-ish dividers; the landing’s editorial rules use the translucent `rgba(67,63,56,.22)` so the atmosphere shows through. Use the translucent rule on gradient/atmosphere surfaces and `#e8e6e1` on solid white surfaces.

### Atmosphere (behind content only)

The fixed `.um-landing .atmosphere` layer paints soft amber/coral/pink/lavender radial gradients over white, then a white fade that reaches full white by ~81% down the page. Key stops:

- amber `rgba(245,158,11,.53)` at 29% / 8%
- coral `rgba(240,68,56,.49)` at 72% / 10%
- lavender `rgba(167,139,250,.42)` at 56% / 34%
- pink `rgba(249,168,212,.34)` at 15% / 38%

Keep it behind content (`z-index: 0`, content wrapper `z-index: 1`), never as a text background.

### Real logo palette

The wordmark in `file.svg` is navy plus the orange family. **Revision 1 was wrong to describe the logo as blue/coral/amber/violet squares — that was the v0 placeholder mark.** The real mark uses:

- deep navy `#335065`
- amber `#f6a02c` / `#f8bf20`
- orange `#f27c32` / `#f04f30`
- coral `#f15a3e` / `#f0614a`

Use the real logo (`file.svg`) everywhere; the icon-only `brand-mark.svg` is only for tight decorative spots such as the community “stamp”.

## 4. Typography

Fonts are loaded in `apps/web/index.html`. The landing system uses three families:

- **DM Sans** (`400 / 500 / 600`) — body copy, controls, navigation.
- **Space Grotesk** (`400`) — display headings and feature titles. Regular weight, tight line-height, negative tracking.
- **DM Mono** (`400 / 500`) — small uppercase labels, section numbers, coordinates, metadata only.

### Scale (as rendered)

| Element | Font | Size | Line-height | Tracking | Color |
| --- | --- | --- | --- | --- | --- |
| Hero `h1` | Space Grotesk 400 | `clamp(43px, 4.05vw, 58px)` (42px ≤900px) | `1.07` | `-.06em` | `#24231f` |
| Section `h2` | Space Grotesk 400 | `39px` (34px ≤900, 31px ≤620) | `1.15` | `-.045em` | `#24231f` |
| Integration `h2` | Space Grotesk 400 | `35px` | `1.15` | `-.045em` | `#24231f` |
| Closing `h2` | Space Grotesk 400 | `43px` | `1.15` | `-.045em` | `#24231f` |
| FAQ `h2` | Space Grotesk 400 | `22px` (20px ≤620) | — | — | `#24231f` |
| Lead paragraph | DM Sans | `16px` (17px in intro) | `1.65–1.7` | — | `#4d4a45` / `#393733` |
| Body paragraph | DM Sans | `14px` | `1.7` | — | `#66625c` |
| Feature title | Space Grotesk 500 | `17px` (15px ≤620) | — | — | `#24231f` |
| Feature description | DM Sans | `12px` | `1.4` | — | `#6b6760` |
| Buttons | DM Sans 500 | `13px` | — | — | see §6 |
| Section label | DM Mono | `9px` (7–8px small) | — | `.07em` uppercase | number `#3157d5`, label `#55514c` |
| Sidebar label | DM Mono | `9px` | — | `.075em` uppercase | `#73716d` |
| Nav item | DM Sans | `13px` | — | — | `#575550`, active `#252421` |
| Footer heading | DM Mono 500 | `9px` | — | `.08em` uppercase | `#77736b` |
| Footer link | DM Sans | `11px` | — | — | `#4e4b46` |
| Footer bottom | DM Mono | `8px` | — | — | `#77736b` |

Rules: sentence case for headings and links; uppercase only for short metadata. Keep body text 14–16px / 1.6–1.7. Mono labels are supplementary — never the only way to understand a control or section.

## 5. Layout, spacing, shape

### Shell

- Fixed desktop sidebar **250px** wide (218px ≤1150px); content begins beside it (`margin-left`).
- Content column: max-width **1328px**, centered, **64px** side padding at desktop (44px ≤900px, 20px ≤620px).
- Optional page rules: 1px `rgba(89,85,78,.23)` left/right inset `max(32px, calc((100% - 1200px)/2))`.
- Section anchors use `scroll-margin-top: 24px`.
- Main page band and sidebar stay white; the atmosphere shows through content, and full-bleed bands (`#f7f6f3`) sit on top.

### Section rhythm (vertical padding)

| Section | Padding (top / bottom) | Notes |
| --- | --- | --- |
| Hero | `min-height 720px`, `height min(100dvh, 850px)`, max `880px`, top `31px` | Two-column grid, gap `30px`, vertical padding `58px 0 50px`. |
| Intro / ecosystem | `75 / 54` | |
| Discover / marketplace | `55 / 80` | |
| Community | `27 / 80` | `min-height 420px`, gap `56px`. |
| Study | `52 / 82` | top border. |
| Neighborhood / accommodation | `59 / 87` | top border. |
| Food | `47 / 0` | `min-height 317px`, top+bottom border. |
| Integration | `75 / 65` | |
| Closing / signup | `57 / 48` | `min-height 374px`, full-bleed `#f7f6f3`. |
| FAQ strip | `48 / 62` | |
| Footer | `57px top`, `21px bottom` | |

### Shape & surfaces

- Corners: **4px** for buttons and controls; diagram/illustration frames are square. Avoid pill-heavy UI.
- Borders: 1px. Hairlines as above.
- Surfaces: transparent or lightly tinted (`rgba(255,255,255,.16)`–`.34`). No heavy shadows; the only depth cues are 1px frames and the atmosphere.
- Icons: `lucide-react`, 13–21px, 1.5px-ish stroke, quiet color.

## 6. Components

### Sidebar / mobile header

- Desktop: fixed, transparent 250px column — brand, `CAMPUS LIFE` mono label, numbered section nav (`01`…`08`), then account links pinned to the bottom.
- Nav item: 34px min height, 13px, `#575550`; hover/active `#252421`; active adds a 2px `#3157d5` bar at the left and a blue index number, plus `aria-current="page"`.
- Account area: `Log in` + `Sign up` (or `Dashboard` + `Profile` when signed in), with `ArrowUpRight` glyphs.
- Mobile (≤900px): sticky header, 66px (60px ≤620px), `rgba(255,255,255,.53)` + 12px blur, bottom hairline `rgba(71,65,58,.13)`; menu is a `<details>` disclosure with a 40×40 tap target and `aria-label`.
- Brand: use the real `file.svg` wordmark (`.brand-logo`, 27px high; 26px in footer). Never re-create the mark from CSS squares.

### Buttons

| Variant | Background | Text | Border | Hover |
| --- | --- | --- | --- | --- |
| Primary | `#3157d5` | `#fff` | `#3157d5` | `#2446b9`, border `#2446b9` |
| Secondary | `rgba(255,255,255,.34)` | `#292824` | `rgba(52,50,46,.3)` | bg `#fff`, border `#5a5750` |

Both: height **43px**, padding `0 16px`, radius **4px**, DM Sans 500 13px, icon gap `11px`, transition `.18s ease`. Short verb-led labels; a small directional icon only when it clarifies the action. Entire row/button is keyboard-accessible with a visible focus ring.

### Section labels

Small DM Mono uppercase row: blue section number + `/` + restrained label (e.g. `01 / A connected campus`). 9px, tracking `.07em`.

### Feature rows

Full-width, divided rows (grid `43px 42px minmax(190px,1fr) 155px 22px`, gap `14px`, min-height `82px`): sequence number, 35×35 line icon in a `rgba(87,81,167,.25)` frame, title + one factual sentence, mono note, and an `ArrowUpRight` affordance. Hover shifts the row right 8px with a `rgba(255,255,255,.25)` wash. The whole row is one link. On ≤620px the mono note hides before the row is allowed to overflow.

### Ecosystem diagram (hero right)

Square diagram on `rgba(255,255,255,.16)` with a `rgba(71,65,58,.26)` frame: 36px top bar, 345px grid canvas (38px grid), two concentric orbit rings, white nodes (`rgba(255,255,255,.8)`) with one emphasized campus node, plus mono coordinates and a legend. Decorative only — keep it `aria-hidden`/labelled and never the only carrier of information.

### Footer

White surface, top hairline `#e8e6e1`, grid `1.55fr 1fr 1fr 1fr .8fr` (max-width 1200px): brand block (logo, one line, primary CTA) then `EXPLORE / RESOURCES / COMPANY / CONNECT` columns, then a bottom bar with `© {year}` and Privacy/Terms. Only link to real, supported destinations.

### Forms, cards, lists (for other pages)

The landing does not define form controls, so extend the same language:

- Inputs: 1px `#e8e6e1` border, 4px radius, white fill, DM Sans 14px, blue focus ring (`2px #3157d5`, offset 2–3px).
- Lists: follow the feature-row pattern — row dividers, a leading icon or sequence number, title + short description.
- Cards: prefer a plain 1px-framed surface with generous padding over rounded, shadowed cards. Keep radius small and consistent.

## 7. Content and voice

Write like a useful campus guide: specific, plainspoken, brief. Describe what a student can find or do. Avoid unsupported promises, invented listings or statistics, and repeated aspirational lines. A heading plus one short supporting sentence is usually enough; remove copy that restates another section.

## 8. Responsive behavior

Match the landing breakpoints:

- **1150px and below:** narrow the sidebar to 218px and the gutters; reduce grid gaps and feature-row columns.
- **900px and below:** hide the desktop sidebar, show the sticky mobile header, simplify the hero and footer to stacked grids; heading scale drops to the 34px tier.
- **620px and below:** 20px gutters; stack editorial sections; hero diagram full width; hide secondary feature metadata; footer becomes 2 columns.

At every size, keep text and controls inside the viewport, preserve ≥40px touch targets, and prevent horizontal scrolling.

Existing shell utilities use additional breakpoints (`um-container`: 768px and 1200px). Keep those aligned with the three above; prefer the landing breakpoints for new work.

## 9. Accessibility and motion

- Semantic landmarks and headings in order; the landing uses `aside` (nav), `main` (with `id="top"`), `footer`, `section[id]` with `aria-labelledby`.
- Icon-only controls get accessible names (`aria-label`); active links get `aria-current="page"` and are not signalled by color alone.
- Visible focus: `2px solid #3157d5`, offset `3px` on links, buttons and summaries.
- Touch targets ≥40px (mobile menu, nav rows).
- Respect `prefers-reduced-motion`: the scoped landing stylesheet disables transitions/animations under it, and `scrollIntoView` falls back to `auto`. Keep motion brief and nonessential (`.18s–.2s ease`).

**Gap to fix on the landing:** it has no skip-to-content link. Add one (reuse `.um-skip-link` from `index.css`) so keyboard users can bypass the sidebar.

## 10. Implementation notes & migration

### How to extend safely

- Reuse landing tokens/patterns; do not add one-off colors, type styles or a new font family without a clear reason.
- When editing the landing, keep rules scoped under `.um-landing` so other pages are untouched until they are migrated.
- Keep the v0 `project/` folder as reference only.

**CSS precedence gotcha.** `landing.css` is an unlayered stylesheet, while Tailwind utilities live in `@layer utilities`. Unlayered rules beat layered ones regardless of specificity, so inside `.um-landing` a landing class such as `.button`/`.feature-row` will override Tailwind utilities like `p-4` or `rounded-lg` on the same element. When a page reuses the landing shell, style it with the landing classes or a scoped rule — not with Tailwind utilities that fight them. (`SiteNavigation`/`SiteFooter` use this to their advantage: they render plain semantic markup with landing classes only.) One side effect is that the v0 `.mobile-menu summary { size: 40px }`, which is not a valid CSS property, is corrected by an explicit scoped `width/height: 40px` rule.

### Token migration (do this with the page pass)

The app currently ships a different palette in `apps/web/src/index.css` (`--color-um-*`): orange accent, cool neutrals. To become consistent with the landing, these values move to the editorial palette. Update the tokens once, then walk the pages (they already reference the token names, so most pages change for free):

| Token | Current | Target (editorial) |
| --- | --- | --- |
| `--color-um-ink` | `#171717` | `#262522` |
| `--color-um-ink-2` | `#737373` | `#66625c` |
| `--color-um-ink-3` | `#a3a3a3` | `#8f8b83` |
| `--color-um-line` | `#e5e5e5` | `#e8e6e1` |
| `--color-um-surface` | `#ffffff` | `#ffffff` (unchanged) |
| `--color-um-mist` | `#f7f7f8` | `#f5f4f1` |
| `--color-um-accent` | `#f27c32` | `#3157d5` |
| `--color-um-accent-strong` | `#dd6520` | `#2446b9` |
| `--color-um-accent-soft` | `#fff2e8` | `#eef1fb` |
| `--color-um-navy` | `#335065` | `#5751a7` |
| *(new)* `--color-um-band` | — | `#f7f6f3` |
| *(new)* `--color-um-line-warm` | — | `rgba(67,63,56,.22)` |

Font tokens also move:

| Token | Current | Target |
| --- | --- | --- |
| `--font-sans` | Plus Jakarta Sans | DM Sans |
| `--font-display` | Sora | Space Grotesk |
| `--font-space` | Space Grotesk | Space Grotesk (unchanged) |
| *(new)* `--font-mono` | — | DM Mono |

Radius: the landing uses **4px** for controls. The app’s `--radius` (shadcn) is 16px; lower it toward the small end as pages are migrated so inputs, buttons and cards share the editorial corner.

### Page migration checklist

**Migrating one page right now (page-by-page, no global change):**

1. Wrap the page root in `.um-editorial` plus one page-local class (e.g. `um-marketplace`).
2. Add a page-local stylesheet (`features/<area>/<page>.css`) scoped to that class, and import it in the page module.
3. Reuse the shared classes (`.button`, `.section-label`, `.field-input`, `.surface`, `.alert`, …) instead of restyling; use the palette/type values in §3–§5 for anything page-specific; never hardcode a competing hex if a token fits.
4. Convert dense card stacks into feature rows or 1px-framed surfaces; replace gradients and coloured shadows with hairlines and the atmosphere.
5. Keep every existing hook, route, query and auth behaviour — restyle markup, do not rewrite logic.
6. Verify: typecheck + build, then check the rendered page (no console errors, no horizontal overflow, correct feel at the 900px and 620px breakpoints, visible focus, `aria-current`/labels on active items, reduced-motion respected).

**Later, once the direction is approved (global):**

7. Swap the token values above in `apps/web/src/index.css` (one place) and lower `--radius`; the already-migrated pages then change for free.
8. Migrate the shared protected shell (`MainLayout` / `Navbar` / `Sidebar`) to the editorial system, and retire the old `components/site/*` shell and the unused landing `sections/`.

### Migration log

| Area | Page file | Scope class | Stylesheet | State |
| --- | --- | --- | --- | --- |
| Landing | `features/landing/LandingPage.tsx` | `.um-landing` | `features/landing/landing.css` | Done (reference) |
| Auth | `features/auth/AuthPage.tsx` (+ `components/auth/AuthForm.tsx`, `features/auth/components/SocialAuth.tsx`) | `.um-auth` | `features/auth/auth.css` | Done |
| Dashboard | `features/dashboard/DashboardPage.tsx` | `.um-dashboard` | `features/dashboard/dashboard.css` | Done (body only; shell pending) |
| Marketplace, Communities, Study, Housing, Food | — | — | — | Next (high-traffic core) |

Notes from the Auth + Dashboard pass:

- The protected shell (`Navbar`/`Sidebar`) is **not** migrated yet, so `/dashboard` currently shows the editorial body inside the old orange shell. That resolves when tokens + shell are swapped in step 7–8.
- Auth replaced the shadcn `Tabs` with a native segmented control and the shadcn `Button`/`Input`/`Label` with `.button` / `.field-input` / `.field-label`; all Supabase calls and redirect logic are unchanged.
- Dashboard dropped motion, gradients and shadcn `Card` for framed surfaces (`.summary`) and a hairline grid (`.quick-grid`).
- Verified: `tsc -b` clean, `vite build` passes, no console errors; `/auth` renders at ~720px with no horizontal overflow and the login/sign-up switch works; the dashboard body renders with mocked data (2 summary surfaces, 5 rows, 6 quick-access tiles, no overflow).

### Verified state of the landing

The rebuilt landing mounts cleanly under React Router at `/`, wires all buttons/links to real routes (`/marketplace`, `/communities`, `/study`, `/housing`, `/food`, `/auth`, `/about`, `/contact`, `/privacy`, `/terms`) plus in-page anchors (`/#ecosystem`, `/#integration`, `/#faqs`), and uses the real UniMARKY wordmark. `npm --workspace web run build` passes.
