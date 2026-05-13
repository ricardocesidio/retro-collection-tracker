# Retro Collection Tracker

A full-stack web application for retro gaming collectors to organize, track, and showcase their personal game collections.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, SCSS |
| Routing | React Router v7 |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL, Prisma 6 |
| Auth | JWT (passport-jwt), bcrypt |

## Features

### Core
- **User authentication** — register, login, JWT sessions, protected routes
- **Collection management** — add, edit, delete games with metadata (condition, region, value, rating)
- **Public catalog** — search, filter by platform/genre, sort (A-Z, newest, popularity), pagination
- **Game details** — stats, reviews, add-to-collection/wishlist with one click

### Social
- **Wishlist** — save games for later with priority levels
- **Reviews & ratings** — write reviews, star ratings 1-5, view on game pages
- **Follow system** — follow/unfollow other collectors
- **Profiles** — public collector pages with stats, collection grids, follower counts
- **Notifications** — real-time alerts for follows, reviews, wishlist additions
- **Activity feed** — track collection actions

### Analytics
- **Dashboard** — total games, collection value, avg rating, platform distribution
- **Charts** — platform breakdown bars, condition distribution
- **Highlights** — most valuable game, highest rated
- **Recent additions** — latest 5 games with thumbnails

### UI
- Dark theme with premium design system
- 8 reusable UI components (Button, Card, Input, Badge, Alert, Modal, LoadingSpinner, EmptyState)
- Fully responsive (mobile hamburger menu)
- Lazy-loaded pages for performance

## Project Structure

```
retro-collection-tracker/
├── frontend/                    # React + Vite
│   └── src/
│       ├── components/
│       │   ├── auth/             # ProtectedRoute
│       │   ├── layout/           # Header, Footer, Layout
│       │   └── ui/               # Button, Card, Input, Badge, Alert, Modal, etc.
│       ├── context/              # AuthContext (React Context + useReducer)
│       ├── pages/                # 14 pages (Home, Explore, GameDetails, Login, Register,
│       │                         #   Dashboard, Collection, Wishlist, Profile, Settings,
│       │                         #   AddGame, EditGame, Notifications, NotFound)
│       ├── services/             # API clients (auth, collections, social, catalog)
│       ├── styles/               # SCSS variables, mixins, global styles
│       └── types/                # TypeScript interfaces
├── backend/                      # NestJS
│   ├── prisma/
│   │   ├── schema.prisma         # 10 models, 6 enums
│   │   └── seed.ts               # Demo data seeder
│   └── src/
│       ├── auth/                 # JWT auth (register, login, guards, strategy)
│       ├── users/                # User profiles
│       ├── games/                # Game catalog CRUD
│       ├── collections/          # Personal collection CRUD + stats
│       ├── wishlist/             # Wishlist CRUD
│       ├── reviews/              # Review CRUD
│       ├── social/               # Follow, notifications, activity
│       ├── prisma/               # Database service (global)
│       ├── config/               # Configuration module
│       └── common/               # Shared guards, filters, decorators
```

## Database Schema

10 models: **User**, **Platform**, **Genre**, **Game**, **Collection**, **Wishlist**, **Review**, **Follow**, **ActivityLog**, **Notification**

6 enums: `UserRole`, `OwnershipStatus`, `Condition`, `Region`, `ActivityType`, `NotificationType`

See `backend/prisma/schema.prisma` for the full schema with relations, indexes, and constraints.

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
npx prisma db seed       # Populate with demo data
npm run start:dev        # Starts on http://localhost:3000

# 3. Frontend
cd ../frontend
npm install
npm run dev              # Starts on http://localhost:5173
```

### Demo Accounts (from seed)
```
Email: alice@example.com
Password: password123

Email: admin@example.com
Password: password123
```

### Environment Variables

**backend/.env:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retro_collection_tracker"
JWT_SECRET="your-secure-random-string"
PORT=3000
```

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | JWT | Current user profile |

### Games Catalog
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/games | No | List/search/filter/paginate |
| GET | /api/games/:id | No | Game details + reviews |
| GET | /api/games/platforms | No | List platforms |
| GET | /api/games/genres | No | List genres |
| POST | /api/games | JWT | Create game |

### Collections
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/collections | JWT | User's collection |
| GET | /api/collections/stats | JWT | Collection analytics |
| POST | /api/collections | JWT | Add game |
| PUT | /api/collections/:id | JWT | Update entry |
| DELETE | /api/collections/:id | JWT | Remove game |

### Social
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET/POST/DELETE | /api/wishlist | JWT | Wishlist CRUD |
| GET/POST/PUT/DELETE | /api/reviews | JWT | Review CRUD |
| POST/DELETE | /api/follow/:userId | JWT | Follow/unfollow |
| GET | /api/users/:username/followers | JWT | Followers list |
| GET | /api/users/:username/following | JWT | Following list |
| GET/POST | /api/notifications | JWT | Notifications |

## Production Build

```bash
# Frontend
cd frontend && npm run build    # Output: dist/

# Backend
cd backend && npm run build     # Output: dist/
npm run start:prod              # Production server
```

## License

MIT
