# Retro Collection Tracker

A full-stack web application for retro gaming collectors to organize, track, and showcase their personal game collections. Built as a production-grade portfolio piece demonstrating modern full-stack engineering.

## Screenshots

| Home | Explore | Game Details |
|------|---------|--------------|
| Landing page with stats + feature grid | Searchable retro game catalog | Stats, reviews, one-click actions |

| Dashboard | Collection | Wishlist |
|-----------|------------|----------|
| Analytics: value, platforms, highlights | Full CRUD with filters | Priority-based wishlist |

| Profile | Notifications | Auth |
|---------|---------------|------|
| Public collector page with tabs | Real-time alerts, unread badges | JWT login/register |

## Architecture

```
┌────────────────────────────────────────────────┐
│                   Client (React)               │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐  │
│  │  Pages    │ │  Context  │ │   Services    │  │
│  │  (20)     │ │  (Auth)   │ │ (API clients) │  │
│  └──────────┘ └──────────┘ └───────┬───────┘  │
│                                     │          │
│                         HTTP (JSON) │          │
└─────────────────────────────────────┼──────────┘
                                      │
┌─────────────────────────────────────┼──────────┐
│                Server (NestJS)      │          │
│  ┌──────────┐ ┌──────────┐ ┌───────┴───────┐  │
│  │  Guards   │ │   DTOs   │ │ Controllers   │  │
│  │  (JWT)   │ │(validate)│ │    (REST)     │  │
│  └──────────┘ └──────────┘ └───────┬───────┘  │
│                                     │          │
│  ┌──────────────────────────────────┴───────┐  │
│  │              Prisma ORM                  │  │
│  │   (type-safe queries, migrations, seed)  │  │
│  └──────────────────────────────────┬───────┘  │
└─────────────────────────────────────┼──────────┘
                                      │
┌─────────────────────────────────────┼──────────┐
│            PostgreSQL               │          │
│  10 tables · 6 enums · indexes      │          │
│  Cascade deletes · Unique constraints│          │
└─────────────────────────────────────┴──────────┘
```

**Key architectural decisions:**

- **Separation of concerns** — Frontend and backend are completely independent projects. The React app communicates exclusively through REST APIs. No SSR coupling.
- **Type safety end-to-end** — TypeScript on both sides with shared type patterns. Prisma generates fully typed database client. DTOs validated at runtime with `class-validator`.
- **Code splitting** — 16 of 20 pages are lazy-loaded via `React.lazy()`; Home, Login, Register, and NotFound stay eager for instant first paint.
- **Stateless auth** — JWT tokens stored in `localStorage`, validated per-request via Passport strategy. No server-side sessions.
- **Normalized data** — Platform and Genre are separate tables with foreign keys, not string columns. This enables proper filtering, sorting, and analytics.
- **Global Prisma service** — A single `@Global()` PrismaService module injected across all feature modules, avoiding connection pooling issues.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, TypeScript | Component-based UI |
| Bundler | Vite | Fast dev server + optimized builds |
| Styling | SCSS Modules | Scoped styles with design tokens |
| Routing | React Router v7 | Nested routes, protected routes, lazy loading |
| State | React Context + useReducer | Auth state, no external state library needed |
| Backend | NestJS 11 | Modular server framework |
| ORM | Prisma 6 | Type-safe database access |
| Database | PostgreSQL | Relational data storage |
| Auth | passport-jwt, bcrypt (12 rounds) | JWT authentication |
| Validation | class-validator, class-transformer | Runtime DTO validation |

## Features

### Core
- **External game search** — search 350K+ games via RAWG API (with Wikipedia fallback), import any game into the catalog on demand
- **Shared game catalog** — single canonical entry per game; users search/select existing games rather than creating duplicates. All collections, reviews, and wishlists link to the same game record.
- **User authentication** — register, login, JWT sessions, protected routes, session persistence across refresh
- **Collection management** — add, edit, delete games with full metadata (condition, region, estimated value, personal rating, notes, ownership status)
- **Public catalog** — search by title, filter by platform/genre, sort (A–Z, newest, oldest, most collected), paginated results
- **Game details** — cover image, metadata grid, stats (avg rating, in collections, wishlisted, reviews), related reviews

### Social
- **Wishlist** — save games for later with priority levels (1–3), personal notes per entry
- **Reviews & ratings** — 1–5 star ratings, title + body, auto-notify followers
- **Follow system** — follow/unfollow collectors, view followers/following lists, mutual follows
- **Profiles** — public collector pages with avatar, bio, stats, tabbed collection grid
- **Notifications** — real-time bell badge, unread indicators, mark single or all read, auto-generated for follows/reviews/wishlists
- **Activity log** — chronological feed of collection actions

### Analytics
- **Dashboard** — 4 summary cards (total games, estimated value, avg rating, platforms collected)
- **Platform distribution** — horizontal bar chart with gradient fills
- **Condition breakdown** — per-condition distribution bars
- **Highlights** — most valuable game, highest rated game
- **Recent additions** — last 5 games with thumbnails and metadata

### UI/UX
- Dark premium theme with 28 SCSS design tokens
- 8 reusable UI components (Button with 5 variants, Card, Input, Badge, Alert, Modal, LoadingSpinner, EmptyState)
- Fully responsive — mobile hamburger menu with backdrop overlay
- Consistent loading spinners, empty states, and error alerts across all pages

## Project Structure

```
retro-collection-tracker/
├── frontend/                    # React + Vite
│   └── src/
│       ├── components/
│       │   ├── auth/             # ProtectedRoute wrapper
│       │   ├── layout/           # Header, Footer, Layout
│       │   └── ui/               # 8 reusable components
│       ├── context/              # AuthContext (React Context + useReducer)
│       ├── pages/                # 20 pages (16 lazy-loaded)
│       ├── services/             # 4 API client modules
│       ├── styles/               # Variables, mixins, global reset
│       └── types/                # TypeScript interfaces
├── backend/                      # NestJS
│   ├── prisma/
│   │   ├── schema.prisma         # 11 models, 6 enums, indexes
│   │   ├── games-data.ts         # 200+ retro games across 12 platforms
│   │   └── seed.ts               # 200+ games, 5 users, demo data
│   └── src/
│       ├── auth/                 # JWT auth module
│       ├── users/                # User profiles
│       ├── games/                # Catalog CRUD + external search/import + platform/genre lists
│       ├── collections/          # Personal collection CRUD + analytics
│       ├── wishlist/             # Wishlist CRUD
│       ├── reviews/              # Review CRUD
│       ├── social/               # Follow, notifications, activity
│       ├── upload/               # Avatar file upload
│       ├── prisma/               # Global database service
│       └── config/               # Environment configuration
```

## Database Schema

11 models, 6 enums, fully normalized with relations:

| Model | Table | Key Fields |
|-------|-------|------------|
| User | `users` | email, username, password, role, avatarUrl, bio |
| Platform | `platforms` | name, slug, manufacturer, releaseYear |
| Genre | `genres` | name, slug |
| Game | `games` | title, platformId→, genreId→, releaseYear, developer, publisher |
| Collection | `collections` | userId→, gameId→, condition, region, personalRating, estimatedValue |
| Wishlist | `wishlists` | userId→, gameId→, priority, notes |
| Review | `reviews` | userId→, gameId→, rating, title, body, likes |
| Follow | `follows` | followerId→, followingId→ |
| ActivityLog | `activity_logs` | userId→, type, message, metadata (JSON) |
| Notification | `notifications` | recipientId→, senderId→, type, title, body, isRead, link |
| NotificationPreference | `notification_preferences` | userId→, email, push, follows, reviews, wishlist |

All foreign keys cascade on delete. Unique constraints on `[userId, gameId]` for collections/wishlists/reviews, and `[followerId, followingId]` for follows.

## Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14

### Setup

```bash
# 1. Clone
git clone https://github.com/ricardocesidio/retro-collection-tracker.git
cd retro-collection-tracker

# 2. Backend
cd backend
cp .env.example .env    # Edit with your PostgreSQL URL + JWT secret
npm install
npx prisma migrate dev --name init
npx prisma db seed       # Populate with 200+ games + 5 demo users
npm run start:dev        # http://localhost:3000

# 3. Frontend
cd ../frontend
npm install
npm run dev              # http://localhost:5173
```

### Demo Accounts (from seed)
| Email | Password | Role |
|-------|----------|------|
| alice@example.com | password123 | User |
| bob@example.com | password123 | User |
| charlie@example.com | password123 | User |
| admin@example.com | password123 | Admin |

### Environment Variables

**backend/.env:**
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retro_collection_tracker"
JWT_SECRET="change-me-to-a-secure-random-string"
PORT=3000
```

**frontend API:** Requests are proxied through Vite dev server in development (`vite.config.ts`). In production, configure a reverse proxy or set `VITE_API_URL`.

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account, returns JWT |
| POST | /api/auth/login | — | Login, returns JWT (@MinLength(8) enforced) |
| GET | /api/auth/me | JWT | Current user + stats + collector level |
| PUT | /api/auth/me | JWT | Update profile (username, displayName, bio, avatarUrl) |
| POST | /api/auth/forgot-password | — | Request password reset |
| POST | /api/auth/reset-password | — | Reset password with token |
| POST | /api/auth/change-password | JWT | Change password (current + new password required) |
| POST | /api/auth/verify-email | — | Verify email with token |
| POST | /api/auth/resend-verification | JWT | Resend verification email |

### Games Catalog
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/games | — | List with ?search, ?platform, ?genre, ?sort, ?page |
| GET | /api/games/:id | — | Details + avgRating + recent reviews |
| GET | /api/games/platforms | — | All platforms |
| GET | /api/games/genres | — | All genres |
| GET | /api/games/external-search | — | Search RAWG/Wikipedia for games not in local catalog |
| POST | /api/games/import | JWT | Import a game from external source (rawg/wikipedia) |
| POST | /api/games | JWT | Create game (admin/moderator only) |
| PUT | /api/games/:id | JWT | Update game (admin/moderator only) |
| DELETE | /api/games/:id | JWT | Delete game (admin/moderator only) |

### Collections
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/collections | JWT | User's collection with ?search, ?platform, ?condition, pagination, totalValue |
| GET | /api/collections/stats | JWT | Aggregated analytics |
| GET | /api/collections/:id | JWT | Single entry |
| POST | /api/collections | JWT | Add game to collection |
| PUT | /api/collections/:id | JWT | Update entry |
| DELETE | /api/collections/:id | JWT | Remove from collection |

### Social
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/wishlist | JWT | User's wishlist |
| POST | /api/wishlist | JWT | Add to wishlist |
| PUT | /api/wishlist/:id | JWT | Update wishlist entry (priority, notes) |
| DELETE | /api/wishlist/:id | JWT | Remove from wishlist |
| GET | /api/reviews/game/:gameId | JWT | Reviews for a game |
| POST | /api/reviews | JWT | Create review |
| PUT | /api/reviews/:id | JWT | Update review |
| DELETE | /api/reviews/:id | JWT | Delete review |
| POST | /api/follow/:userId | JWT | Follow user |
| DELETE | /api/follow/:userId | JWT | Unfollow user |
| GET | /api/follow/:userId/status | JWT | Check follow status |
| GET | /api/users/:id/followers | — | User's followers |
| GET | /api/users/:id/following | — | Who user follows |
| GET | /api/notifications | JWT | Notification list |
| GET | /api/notifications/unread-count | JWT | Unread count |
| POST | /api/notifications/:id/read | JWT | Mark as read |
| POST | /api/notifications/read-all | JWT | Mark all read |
| GET | /api/activity | JWT | Activity log |

### Notification Preferences
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/notification-preferences | JWT | Get user's notification preferences |
| PUT | /api/notification-preferences | JWT | Update notification preferences |

### Upload
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/upload/avatar | JWT | Upload profile picture (jpg/png/webp/gif, 5MB max) |

### Public
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/stats/public | — | Public site stats (games count, platforms count, collectors count) |
| GET | /api/stats/donate | — | Donation campaign stats (raised, goal, supporters) |

## Deployment

### Frontend (Static Hosting)
```bash
cd frontend
npm run build          # Output: dist/
# Deploy dist/ to Vercel, Netlify, Cloudflare Pages, or S3 + CloudFront
# Set build command: npm run build
# Set output directory: dist
```

### Backend (Node.js Hosting)
```bash
cd backend
npm run build          # Output: dist/
# Deploy to Railway, Render, Fly.io, or a VPS
# Start command: node dist/main.js
# Set environment variables in hosting dashboard
```

### Database
- Use **Railway**, **Supabase**, or **Render** for managed PostgreSQL
- Run migrations on deploy: `npx prisma migrate deploy`
- Seed on first deploy: `npx prisma db seed`

### With Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY prisma/ ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Project Diagnosis

The following items have been **resolved** through iterative improvements. Remaining opportunities are listed below.

### ✅ Resolved

| Priority | Item | Resolution |
|----------|------|------------|
| P0 | Login single-char password | `@MinLength(1)` → `@MinLength(8)` in `login.dto.ts` |
| P0 | Password reset token exposure | Token removed from API response body |
| P0 | No email verification | `isEmailVerified` + `emailVerificationToken` fields, verify/resend endpoints added |
| P0 | Settings password non-functional | `POST /auth/change-password` endpoint implemented, Settings.tsx updated |
| P0 | Notification prefs not persisted | `NotificationPreference` model + backend CRUD + Settings.tsx saves via API |
| P0 | Stats O(N) memory risk | `getValueHistory()` now filters to last 6 months in query |
| P0 | Race conditions from missing cleanup | Cancellation booleans in Dashboard, Profile, AddGame; mountedRef in AddGame |
| P1 | Code splitting | 16 of 20 pages lazy-loaded via `React.lazy()` with Suspense fallback |
| P1 | Wishlist update endpoint | `PUT /wishlist/:id` with `UpdateWishlistDto` |
| P1 | AddGame two-step rollback | Imported games deleted if collection creation fails or user cancels |
| P1 | Home `i class` → `i className` | Fixed for React 19 strict mode |
| P2 | TopBar search autocomplete | Debounced search with game suggestions dropdown |
| P2 | Sidebar hardcoded progress | Dynamic stats from API with configurable goal |
| P2 | Donate page hardcoded values | `GET /stats/donate` endpoint, env-configured defaults |
| P2 | Infinite scroll | IntersectionObserver replaces "Load More" in AddGame |
| P3 | Cross-browser scrollbar | `@mixin scr` updated with `scrollbar-gutter`, `::-moz-scrollbar` support |

### Remaining Opportunities

| # | Feature | Notes |
|---|---------|-------|
| 1 | **Game cover image upload** — only avatar upload works; games use placeholder images | `backend/src/upload/` |
| 2 | **Collection export (CSV/JSON)** — mentioned as a Donate perk, not implemented | — |
| 3 | **EditGame two API calls without rollback** — partial updates possible | `frontend/src/pages/EditGame/EditGame.tsx` |
| 4 | **WebSocket real-time notifications** — currently polls every 30s | `frontend/src/components/ui/NotificationBell/NotificationBell.tsx` |
| 5 | **Dark/light theme toggle** — dark-only theme, no light mode | — |
| 6 | **Price charting integration** — connect actual market values via PriceCharting API | — |
| 7 | **Pagination not enforced at API level** — `limit=999999` is accepted | Backend services |
| 8 | **Admin dashboard** — no UI for game catalog management, user moderation | — |
| 9 | **No Swagger/OpenAPI docs** — API is undocumented beyond this README | — |
| 10 | **No request logging** — no middleware for latency tracking or request/response logging | Backend |
| 11 | **Dead `types/index.ts`** (54 lines) — not imported by any service | Cleanup |
| 12 | **Dead `useCancellableFetch` hook** — never used anywhere | Cleanup |
| 13 | **Empty directories** — `common/interceptors/`, `common/pipes/`, `common/decorators/`, `social/dto/`, `users/dto/` | Cleanup |
| 14 | **Duplicate `getCollectorLevel()`** — same function in `auth.service.ts` and `users.service.ts` | Code smell |
| 15 | **Placeholder cover images** — all game covers use placehold.co with text overlays | Visual quality |
| 16 | **404 page uses inline styles** — should use SCSS like every other page | Consistency |
| 17 | **Duplicate SCSS patterns** — `.game-card`, `.page-header` styles duplicated across 5+ page SCSS files | Maintainability |
| 18 | **Missing `name` prop on Input component** — required for proper form handling | Accessibility |

## Completed Milestones

- [x] JWT authentication with register, login, protected routes
- [x] Full collection CRUD with filters, pagination, value tracking
- [x] Shared game catalog — search/select existing games instead of creating duplicates
- [x] 200+ retro games seed data across 12 platforms
- [x] External game search — RAWG API (350K+ games) + Wikipedia fallback
- [x] Game import on demand from external sources
- [x] Wishlist with priority levels (1–3)
- [x] Reviews & star ratings with notifications
- [x] Follow system with follower/following lists
- [x] Public profiles with collection/reviews/follow tabs
- [x] Real-time notification bell badge (polling)
- [x] Activity feed for collection actions
- [x] Dashboard with KPIs, platform donut chart, value history, activity, reviews
- [x] Avatar upload with file type/size validation
- [x] Username/bio validation (no spaces, max 20/100 chars)
- [x] Collector level system (New Collector → Museum)
- [x] 15 reusable UI components with dark premium theme
- [x] Donate page with tiered support
- [x] Error boundary catching render errors
- [x] 404 page for unknown routes
- [x] Responsive mobile layout with hamburger menu
- [x] Rate limiting on auth and mutation endpoints
- [x] Security headers (helmet), CORS config, body size limits
- [x] GitHub Actions CI workflow
- [x] 6 test files (3 frontend + 3 backend)
- [x] P0 security fixes — password strength, reset token protection, email verification
- [x] Change password endpoint for authenticated users
- [x] Notification preferences persistence with backend CRUD
- [x] Code splitting — 16/20 pages lazy-loaded for faster initial load
- [x] Wishlist update endpoint (priority, notes)
- [x] AddGame two-step rollback — orphaned game cleanup on failure
- [x] TopBar search autocomplete with game suggestions
- [x] Dynamic sidebar collection progress from live stats
- [x] Donate page with configurable campaign values via env vars
- [x] Infinite scroll on AddGame catalog via IntersectionObserver
- [x] Cross-browser scrollbar styling (WebKit + Firefox + scrollbar-gutter)

## License

MIT
