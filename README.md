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
- **Lazy loading ready** — Component structure supports code-splitting. All 20 pages are registered in the router.
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
│       ├── pages/                # 14 lazy-loaded pages
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

**frontend API:** Update `src/services/*.ts` — `const API = 'http://localhost:3000/api'` (dev) or `'/api'` (production with reverse proxy).

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Create account, returns JWT |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | JWT | Current user + stats |

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

### Upload
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/upload/avatar | JWT | Upload profile picture (jpg/png/webp/gif, 5MB max) |

### Public
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/stats/public | — | Public site stats (games count, platforms count, collectors count) |

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

A full codebase audit identified the following areas for improvement, prioritized by impact:

### P0 — Critical (Security & Data Integrity)

| # | Issue | Location |
|---|-------|----------|
| 1 | **Login accepts single-character passwords** — `LoginDto` has `@MinLength(1)` while register requires 8+ | `backend/src/auth/dto/login.dto.ts` |
| 2 | **Password reset token returned in API response** — not actually emailed, making the flow insecure | `backend/src/auth/auth.service.ts` |
| 3 | **No email verification on registration** — anyone can register with any email | `backend/src/auth/auth.service.ts` |
| 4 | **Settings password change is non-functional** — says "use forgot-password flow" with no actual flow | `frontend/src/pages/Settings/Settings.tsx` |
| 5 | **Notification preferences not persisted** — toggles have no backend API, resets on refresh | `frontend/src/pages/Settings/Settings.tsx` |
| 6 | **Stats endpoint loads all collection items into memory** — O(N) aggregation without pagination, crash risk at scale | `backend/src/collections/stats.service.ts` |
| 7 | **Race conditions from missing AbortController cleanup** — stale API responses can corrupt UI state | Multiple pages |

### P1 — Major Missing Features

| # | Feature | Notes |
|---|---------|-------|
| 1 | **Code splitting / lazy loading** — all 20 pages eagerly imported, initial bundle is ~325 KB JS + 133 KB CSS | `frontend/src/App.tsx` |
| 2 | **Wishlist update endpoint** — no way to edit priority or notes once added | `backend/src/wishlist/` |
| 3 | **Game cover image upload** — only avatar upload works; games use placeholder images | `backend/src/upload/` |
| 4 | **Collection export (CSV/JSON)** — mentioned as a Donate perk, not implemented | — |
| 5 | **AddGame two-step API without rollback** — orphaned games if collection creation fails | `frontend/src/pages/AddGame/AddGame.tsx` |
| 6 | **EditGame two API calls without rollback** — partial updates possible | `frontend/src/pages/EditGame/EditGame.tsx` |
| 7 | **GameDetails shared loading state** — single `adding` state for both "Add to Collection" and "Add to Wishlist" | `frontend/src/pages/GameDetails/GameDetails.tsx` |
| 8 | **Home page uses `i class` instead of `i className`** — icon won't render in React 19 strict mode | `frontend/src/pages/Home/Home.tsx` |

### P2 — Nice-to-Have Improvements

| # | Feature | Notes |
|---|---------|-------|
| 1 | **TopBar search autocomplete** — currently only navigates to Explore page, no instant suggestions | `frontend/src/components/layout/TopBar/TopBar.tsx` |
| 2 | **Sidebar "Collection Progress" hardcoded** — shows fake 78% / "12 of 15 SNES games" | `frontend/src/components/layout/Sidebar/Sidebar.tsx` |
| 3 | **Donate page hardcoded values** — "$247 raised", "49%", "34 supporters" | `frontend/src/pages/Donate/Donate.tsx` |
| 4 | **WebSocket real-time notifications** — currently polls every 30s | `frontend/src/components/ui/NotificationBell/NotificationBell.tsx` |
| 5 | **Dark/light theme toggle** — dark-only theme, no light mode | — |
| 6 | **Price charting integration** — connect actual market values via PriceCharting API | — |
| 7 | **Infinite scroll** — pagination with "Load More" / page numbers instead of infinite scroll | Multiple pages |
| 8 | **Pagination not enforced at API level** — `limit=999999` is accepted | Backend services |
| 9 | **Admin dashboard** — no UI for game catalog management, user moderation | — |
| 10 | **No Swagger/OpenAPI docs** — API is undocumented beyond this README | — |
| 11 | **No request logging** — no middleware for latency tracking or request/response logging | Backend |

### P3 — Polish & Code Quality

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Dead `types/index.ts`** (54 lines) — not imported by any service, duplicates exist elsewhere | Cleanup |
| 2 | **Dead `useCancellableFetch` hook** — never used anywhere | Cleanup |
| 3 | **Empty directories** — `common/interceptors/`, `common/pipes/`, `common/decorators/`, `social/dto/`, `users/dto/` | Cleanup |
| 4 | **Duplicate `getCollectorLevel()`** — same function in `auth.service.ts` and `users.service.ts` | Code smell |
| 5 | **Placeholder cover images** — all game covers use placehold.co with text overlays | Visual quality |
| 6 | **404 page uses inline styles** — should use SCSS like every other page | Consistency |
| 7 | **Duplicate SCSS patterns** — `.game-card`, `.page-header` styles duplicated across 5+ page SCSS files | Maintainability |
| 8 | **Triple `@keyframes spin`** — same animation defined in multiple SCSS files | Redundancy |
| 9 | **Double `@keyframes fadeIn`** — same animation in global.scss and AddGame.scss | Redundancy |
| 10 | **No Firefox scrollbar styling** — only WebKit (`-webkit-scrollbar`) is styled | Cross-browser |
| 11 | **Missing `name` prop on Input component** — required for proper form handling | Accessibility |

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

## License

MIT
