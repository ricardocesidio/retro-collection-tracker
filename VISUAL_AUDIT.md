# VISUAL AUDIT — Retro Collection Tracker
## May 2026 · Pre-Redesign Analysis

---

## 1. DUAL-DESIGN-SYSTEM PROBLEM (Critical)

The app suffers from **two competing design systems** living side by side:

| System | Pages | Tokens |
|--------|-------|--------|
| **New System** | Dashboard, Collection, Explore, Wishlist, Notifications | `$bg-card`, `$accent-purple`, `$border-color` |
| **Legacy System** | Home, Login, Register, GameDetails, Profile, Settings, AddGame, EditGame | `$color-surface`, `$color-highlight`, `$color-border` (aliases) |

The legacy aliases map to the new tokens but use different naming conventions. Any page using the old `.page-container`, `.hero`, `.feature-card`, or `.auth-page` classes reflects a different visual era than the new `.page-shell`, `.dash-card`, `.game-card-new` classes.

**Consequence:** The app feels like two products glued together — a modern dark dashboard shell wrapped around an older marketplace-style app.

---

## 2. PAGE-BY-PAGE ANALYSIS

### Dashboard (New System — Good)
- ✅ Strong KPI cards with accent-color top borders
- ✅ Donut chart via CSS conic-gradient
- ✅ Clean 2-column + sidebar layout
- ✅ Bar charts with gradient fills
- ❌ Donut chart has no entry animation
- ❌ KPI cards lack trend indicators ("+3 this month" is hardcoded)
- ❌ No value-over-time sparkline or mini-chart
- ❌ Wishlist spotlight cards are cramped at 4-up

### Collection (New System — Good)
- ✅ `game-card-new` with cover image + condition badge
- ✅ Search + platform/condition filters
- ✅ Edit/Remove actions per card
- ❌ Card aspect-ratio at 4/3 cuts off box art designed for 3/4
- ❌ Condition badge text hard to read against dark images
- ❌ No grid/list toggle
- ❌ No bulk actions (select multiple)
- ❌ No ownership status indicator beyond condition

### Explore (New System — Adequate)
- ✅ Consistent with Collection styling
- ✅ Search with debounce
- ❌ Uses placeholder images (`placehold.co`) rather than seeded cover images
- ❌ No featured/trending section
- ❌ Pagination is plain text "Page X of Y" — no visual polish
- ❌ No view-mode toggle (grid vs list vs compact)

### Home (Legacy System — Outdated)
- ❌ Uses old `.hero` / `.feature-card` classes
- ❌ Centered landing page layout feels like a 2020 template
- ❌ "Build Your Retro Collection" hero doesn't match the dashboard's premium analytics tone
- ❌ Feature cards use old `$color-surface` background — visually disconnected from the new cards
- ❌ CTA section at bottom is wasted space in a dashboard-oriented app
- ❌ Stats below hero are redundant with the dashboard

### Login / Register (Legacy System — Functional)
- ✅ Centered card layout
- ✅ Shared `_auth-page.scss`
- ✅ Forgot password modal
- ❌ No background branding
- ❌ Generic "Welcome Back" headline
- ❌ No demo credentials hint

### GameDetails (Legacy System — Functional)
- ❌ Old `$color-surface` card styles
- ❌ Meta grid uses the legacy 2-column layout
- ❌ Stats row uses old `stat-card` class (different from new `StatCard` component!)
- ❌ Reviews section styling disconnected from dashboard

### Profile (Legacy System — Needs Migration)
- ❌ Uses old `.profile` classes with `$color-border`
- ❌ Avatar placeholder uses `$color-accent-light`
- ❌ Tab styling inconsistent with dashboard tabs
- ❌ Follower cards use legacy border colors

### Settings (Legacy System — Needs Migration)
- ❌ Old sidebar nav pattern (not the new Sidebar)
- ❌ `$color-surface` section backgrounds
- ❌ Success/error alerts use old Alert component with legacy colors

### AddGame / EditGame (Legacy System — Functional)
- ❌ Form sections use old card background
- ❌ Select dropdowns use old `$color-surface-alt`
- ❌ `.form-layout` max-width 720px wastes space in the new widescreen layout

### Notifications (Mixed — OK)
- ✅ Uses new `dash-panel` class
- ✅ Compact list layout
- ❌ Unread indicator is a simple dot — should be a border accent like KPI cards
- ❌ No grouping by date (Today, Yesterday, This Week)

### NotFound (Legacy — Needs Work)
- ❌ Uses inline styles instead of SCSS
- ❌ 404 page doesn't match the dashboard's premium feel

---

## 3. COMPONENT-BY-COMPONENT ANALYSIS

### Button ✅
- 5 variants (primary, secondary, outline, danger, ghost)
- 3 sizes (sm, md, lg)
- Loading spinner support
- **Issue:** Primary color is `$color-highlight` (purple) which is correct, but secondary uses hardcoded `$color-accent-light` which is a dark gray, making secondary buttons nearly invisible

### Card (Legacy) ❌
- Uses old `$color-surface` and `$color-border`
- 3:4 aspect ratio — good for game box art but unused in the new design
- `clickable` prop adds hover translateY — nice but inconsistent with new cards

### Badge ✅
- 6 variants with proper color coding
- Uses legacy `$color-success-bg` etc. — functional but should use new accent palette for consistency

### Alert ✅
- 4 variants — functional
- **Issue:** No dismiss button (has `dismissible` prop but not wired in JSX)

### Input ✅
- ControlValueAccessor-style with label/error/hint
- **Issue:** Uses old `$color-surface-alt` background — dark gray on dark bg = poor contrast

### Modal ✅
- ARIA-compliant (modal, labelledby, focus trap)
- **Issue:** Uses old `$color-secondary` background — should use `$bg-card`

### LoadingSpinner ✅
- Simple ring spinner — functional
- **Issue:** Only one size (36px)

### EmptyState ✅
- Icon + title + message + actions slot
- Good pattern used across pages

### StatCard (New) ✅
- 6 accent color variants with top-border accents
- Clean KPI layout
- **Issue:** No loading skeleton — cards flash empty while data loads

### Sidebar ✅
- Fixed 240px with brand + nav sections + user card
- **Issue:** Active item highlight uses hardcoded `rgba($accent-purple, 0.1)` — should use a design token
- **Issue:** Notification badge count is hardcoded "3"

### TopBar ✅
- Search + notification bell + profile chip
- **Issue:** Search is non-functional — filters nothing, just a visual placeholder

---

## 4. SPACING & HIERARCHY ISSUES

- **Dashboard `page-shell`** uses `margin-left: $sidebar-width` and `margin-top: $topbar-height` — this creates a visual offset that feels disconnected from the sidebar
- **Dashboard content** has `max-width: 1400px` but the right column is fixed 360px — this creates awkward white space on ultrawide screens
- **Collection cards** at `minmax(240px, 1fr)` look sparse on wide screens — should max at 3-4 columns max
- **KPIs** at `repeat(4, 1fr)` look stretched — should be `repeat(auto-fit, minmax(200px, 1fr))`
- **Typography scale** jumps from 1.5rem (page title) to 1.875rem (h1) — missing intermediate sizes
- **Line height** is a flat 1.5 across the board — headings should be tighter (1.15–1.2), body looser (1.6)

---

## 5. COLOR SYSTEM ISSUES

- **Too many accent colors:** 7 accents (purple, blue, green, orange, pink, red, cyan) create a chaotic palette
- **Purple dominance:** Every link, active state, and CTA is purple — no color hierarchy
- **Green only used for values** — should also be used for success states and positive trends
- **Orange only used for ratings** — underutilized
- **No semantic color usage:** Buttons don't consistently use green = success, red = danger
- **Text hierarchy:** 4 text colors but they map to the same visual weight — `$color-text-muted` and `$color-text-dim` are barely distinguishable (#6b7280 vs #4b5563)

---

## 6. RESPONSIVE WEAKNESSES

- **Main grid breaks to single column at 1100px** — too early, leaves ~200px of usable width
- **KPI cards** break from 4→2→1 but the 2-column layout leaves cards awkwardly tall
- **Sidebar has no mobile toggle** — there's no hamburger menu to show/hide the sidebar on mobile
- **TopBar search** stays full-width on mobile — should collapse to an icon
- **Dashboard** right column (360px) should stack below on mobile but currently disappears at 1100px
- **Collection cards** at `minmax(240px, 1fr)` work fine on mobile but would benefit from a denser list view

---

## 7. DEAD ZONES & CLUTTER

- **Home page** is a dead zone — `$container-padding` with centered text feels empty
- **Dashboard welcome text** occupies a full row for 2 lines of text
- **Footer** in public Layout is empty space on most screens
- **TopBar** has a max-width search that leaves empty space on the right
- **StatCard** bottom padding is excessive — label floats in empty space

---

## 8. ANIMATION & MOTION

- **No page transitions** — navigating between pages is instant (jarring)
- **No card hover animations** on new cards (old Card has translateY)
- **Donut chart has no draw animation** — appears instantly
- **Bar chart fills** have CSS transitions but no staggered entrance
- **Modal** has slideUp animation (good) but no exit animation
- **Loading spinner** is basic — could use a branded pulsing ring

---

## 9. SUMMARY — TOP 10 ISSUES

| # | Severity | Issue |
|---|:---:|-------|
| 1 | Critical | Two competing design systems (legacy + new) — half the app feels outdated |
| 2 | Critical | Home page is a marketplace landing page, not a collector dashboard |
| 3 | Critical | Sidebar has no mobile toggle — inaccessible on phones |
| 4 | Major | No page transitions — instant cuts feel amateur |
| 5 | Major | Legacy pages (Profile, Settings, GameDetails) use old component styles |
| 6 | Major | StatCard and stat-card are two different things with different styles |
| 7 | Major | Search in TopBar is decorative — doesn't filter anything |
| 8 | Minor | Placeholder images used everywhere — should use real seeded covers |
| 9 | Minor | Too many accent colors with no clear semantic assignment |
| 10 | Minor | Donut chart has no animation — appears instantly |
