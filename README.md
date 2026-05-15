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
│  │  Pages    │ │ Context  │ │   Services    │  │
│  │ (14 lazy) │ │ (Auth)   │ │ (API clients) │  │
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
- **Lazy loading** — All 14 pages are code-split. Initial bundle is under 300 kB. Subsequent navigations load ~2–8 kB chunks.
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
│   │   ├── schema.prisma         # 10 models, 6 enums, indexes
│   │   └── seed.ts               # 30 games, 5 users, demo data
│   └── src/
│       ├── auth/                 # JWT auth module
│       ├── users/                # User profiles
│       ├── games/                # Catalog CRUD + platform/genre lists
│       ├── collections/          # Personal collection CRUD + analytics
│       ├── wishlist/             # Wishlist CRUD
│       ├── reviews/              # Review CRUD
│       ├── social/               # Follow, notifications, activity
│       ├── prisma/               # Global database service
│       └── config/               # Environment configuration
```

## Database Schema

10 models, 6 enums, fully normalized with relations:

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
npx prisma db seed       # Populate with 30 games + 5 demo users
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
| POST | /api/games | JWT | Create game |
| PUT | /api/games/:id | JWT | Update game |
| DELETE | /api/games/:id | JWT | Delete game |

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

## Future Improvements

- [ ] Image upload for game covers (S3/Cloudinary)
- [ ] Infinite scroll on explore/collection pages
- [x] Shared game catalog — search/select existing games instead of creating duplicates
- [x] Advanced search with autocomplete
- [ ] Collection export (CSV/JSON)
- [ ] Price charting integration (PriceCharting API)
- [ ] Dark/light theme toggle
- [ ] Email verification on registration
- [ ] Password reset flow
- [ ] Admin dashboard for moderation
- [ ] Public API for third-party integrations
- [ ] End-to-end tests (Playwright/Cypress)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Rate limiting and request throttling
- [ ] WebSocket real-time notifications

## License

MIT
