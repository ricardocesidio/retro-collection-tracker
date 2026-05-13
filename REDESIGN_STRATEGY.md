# REDESIGN STRATEGY — Retro Collection Tracker
## May 2026

---

## 1. NEW VISUAL DIRECTION

**"Premium Collector Command Center"**

Move from a marketplace-style app with dashboard elements to a **unified analytics-driven collector platform**. Every page should feel like part of the same dark command center — not a set of unrelated screens.

**Core principles:**
- One design system, applied everywhere
- Dashboard-first thinking — even non-dashboard pages use dashboard visual language
- Data density over decoration — cards should feel informative, not decorative
- Motion as information — animations should reveal data, not distract

---

## 2. COMPLETE DESIGN SYSTEM

### Color System — Simplified to 4 Semantics

| Token | Color | Usage |
|-------|-------|-------|
| `$accent-primary` | `#7c3aed` (violet-600) | Links, active states, primary CTAs |
| `$accent-success` | `#059669` (emerald-600) | Positive values, owned status, completed |
| `$accent-warning` | `#d97706` (amber-600) | Ratings, priority, wishlist |
| `$accent-danger` | `#dc2626` (red-600) | Remove/danger actions, errors |
| `$accent-info` | `#2563eb` (blue-600) | Information, platforms, neutral data |

**Remove:** pink, cyan, orange as standalone accents — fold into semantic roles.

### Typography Hierarchy

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 2.25rem | 700 | Page heroes, dashboard welcome |
| H1 | 1.75rem | 700 | Page titles |
| H2 | 1.375rem | 600 | Section headers |
| H3 | 1.125rem | 600 | Card titles |
| Body | 0.9375rem | 400 | Paragraphs, descriptions |
| Caption | 0.8125rem | 400 | Meta text, labels |
| Micro | 0.6875rem | 500 | Badges, timestamps |

### Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon gaps, badge padding |
| `space-2` | 8px | Inline gaps, compact lists |
| `space-3` | 12px | Card padding Y, form gaps |
| `space-4` | 16px | Card padding X, section gaps |
| `space-5` | 24px | Section margins, KPI gaps |
| `space-6` | 32px | Page padding, large section gaps |
| `space-8` | 48px | Hero padding, major section divides |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Buttons, inputs, badges |
| `radius-md` | 10px | Cards, modals, panels |
| `radius-lg` | 16px | Hero cards, featured content |
| `radius-full` | 9999px | Avatars, notification dots |

### Shadows — 3-Level System

| Level | Value | Usage |
|-------|-------|-------|
| `elevation-1` | `0 1px 3px rgba(0,0,0,0.12)` | Cards, inputs |
| `elevation-2` | `0 4px 16px rgba(0,0,0,0.16)` | Modals, dropdowns |
| `elevation-3` | `0 8px 32px rgba(0,0,0,0.24)` | TopBar, Sidebar |

---

## 3. NEW DASHBOARD STRUCTURE

### Layout Grid (Desktop)

```
┌──────────┬──────────────────────────────────────────┐
│          │ Search bar + notifications + profile      │
│          ├──────────────────────────────────────────┤
│ Sidebar  │ ┌─────────┬─────────┬─────────┬────────┐ │
│ 240px    │ │  KPI 1  │  KPI 2  │  KPI 3  │ KPI 4  │ │
│          │ └─────────┴─────────┴─────────┴────────┘ │
│ Nav      │ ┌──────────────────┐ ┌─────────────────┐ │
│ items    │ │   Platform       │ │   Value Over    │ │
│          │ │   Distribution   │ │   Time (spark)  │ │
│          │ │   (donut)        │ │                 │ │
│          │ └──────────────────┘ └─────────────────┘ │
│          │ ┌──────────────────┐ ┌─────────────────┐ │
│          │ │   Recent         │ │   Activity      │ │
│          │ │   Additions      │ │   Feed          │ │
│          │ └──────────────────┘ └─────────────────┘ │
│          │ ┌──────────────────────────────────────┐ │
│          │ │   Wishlist Spotlight (horizontal)    │ │
│          │ └──────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────┘
```

### Key Changes from Current:
- KPI cards auto-fit instead of fixed 4
- Right column eliminated — content flows in a 2-col main grid
- Wishlist spotlight becomes a horizontal scroll strip instead of cramped 4-up grid
- Value-over-time sparkline replaces the Condition Breakdown (move condition to a pill row at top)

---

## 4. NEW NAVIGATION STRUCTURE

### Sidebar (always visible on desktop, toggleable on mobile)

| Section | Items |
|---------|-------|
| Main | Dashboard, My Collection, Explore Catalog |
| Social | Wishlist, Profile, Notifications |
| Settings | Settings |

### TopBar
- Functional search (filters collection/explore globally)
- Notification bell with live unread count
- Profile avatar with dropdown (Profile, Settings, Logout)

### Mobile
- Sidebar slides in from left on hamburger tap
- Dark overlay backdrop
- TopBar search collapses to icon → expands on tap
- Bottom tab bar for key actions (Collection, Explore, Dashboard)

---

## 5. NEW RESPONSIVE STRATEGY

| Breakpoint | Layout |
|------------|--------|
| **≥ 1280px** | Full sidebar + 2-col dashboard grid |
| **1024–1279px** | Collapsed sidebar (icons only) + 2-col dashboard |
| **768–1023px** | Hidden sidebar (hamburger toggle) + single-col dashboard |
| **< 768px** | Full mobile — hidden sidebar, stacked cards, bottom nav |

---

## 6. NEW ANIMATION / MOTION SYSTEM

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Page transition | Fade + slide-up (10px) | 200ms | ease-out |
| Card hover | TranslateY(-2px) + shadow increase | 150ms | ease |
| Donut chart | Stroke-draw on scroll into view | 800ms | ease-out |
| Bar chart | Width expand from 0, staggered 50ms | 400ms | ease-out |
| Modal open | Scale(0.95→1) + fade | 200ms | ease-out |
| Modal close | Scale(1→0.95) + fade | 150ms | ease-in |
| Notification badge | Scale pop | 300ms | cubic-bezier(0.34,1.56,0.64,1) |
| KPI value change | Count-up number animation | 600ms | ease-out |

---

## 7. NEW COMPONENT ARCHITECTURE

### Unified Component Library (replace all legacy components)

| Current (Legacy) | New (Unified) |
|------------------|---------------|
| `Card` (old) | Deprecate — use `GameCard` with new tokens |
| `Button` (mixed tokens) | Refactor — use semantic accent colors |
| `Badge` (old bg colors) | Refactor — use new accent tokens |
| `Alert` (old bg colors) | Refactor — use new tokens + add dismiss |
| `Input` (old bg) | Refactor — use `$bg-input` consistently |
| `Modal` (old bg) | Refactor — use `$bg-card` |
| `.page-container` | Replace with `.page-shell` globally |
| `.stat-card` (Dashboard) | Replace with `StatCard` |
| `.card` (old) | Replace with `.game-card-new` in all pages |

### New Components to Create

| Component | Purpose |
|-----------|---------|
| `Sparkline` | Mini inline chart for value-over-time |
| `ProgressBar` | Animated progress indicator |
| `Pill` | Filter/tag chip for platform/genre |
| `AvatarGroup` | Stacked avatars for followers |
| `Skeleton` | Loading placeholder for cards/stats |
| `Drawer` | Mobile sidebar drawer with backdrop |
| `Tabs` | Unified tab component for Profile/Settings |

---

## 8. IMPLEMENTATION PRIORITY

### Phase 1 — Unify (Critical)
1. Migrate all legacy pages to use new design tokens (remove aliases)
2. Replace old Card/Button/Badge/Alert/Input with unified versions
3. Add mobile sidebar toggle
4. Remove Home page landing layout — replace with Dashboard as default route

### Phase 2 — Polish (Major)
5. Add page transitions (fade + slide)
6. Add donut chart draw animation
7. Make TopBar search functional
8. Add loading skeletons to StatCard and all lists
9. Horizontal wishlist spotlight strip

### Phase 3 — Elevate (Minor)
10. Value-over-time sparkline chart
11. Staggered bar chart entrance animations
12. KPI count-up number animation
13. Mobile bottom tab bar
14. Grouped notifications by date

---

## 9. VISUAL SAFETY RULES

- All existing functionality must be preserved
- All API calls must continue working
- No data flow changes
- Color changes must maintain WCAG AA contrast (≥ 4.5:1 for text)
- Mobile hamburger must work identically to current sidebar navigation
- Animations must respect `prefers-reduced-motion`
