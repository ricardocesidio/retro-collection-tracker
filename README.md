# 🎮 Retro Collection Tracker

> **A full-stack retro game collection management platform** — track your physical game collection, discover new titles via RAWG, trade with collectors worldwide, earn XP, and connect with a community of retro gaming enthusiasts.

<div align="center">
  <a href="https://retro-collection-tracker.vercel.app">
    <img src="https://img.shields.io/badge/LIVE_DEMO-000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  &nbsp;
  <a href="https://github.com/ricardocesidio/retro-collection-tracker">
    <img src="https://img.shields.io/badge/SOURCE_CODE-181717?style=for-the-badge&logo=github&logoColor=white" alt="Source Code" />
  </a>
</div>

<br>

| Frontend | Backend | Database | Real-time | Auth |
|----------|---------|----------|-----------|------|
| React 19 + TypeScript + Vite | NestJS 11 + Prisma 6 | PostgreSQL 16 | Socket.IO 4 | JWT + bcryptjs |

> **Demo login:** Click the **"Demo Login"** button on the sign-in page — instantly explore collections, trades, messages, and reviews as a real collector.

<br>

[![NestJS](https://img.shields.io/badge/NestJS-11-EA2845?style=flat&logo=nestjs)](https://nestjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat&logo=reactrouter)](https://reactrouter.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat&logo=prisma)](https://www.prisma.io)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?style=flat&logo=socket.io)](https://socket.io)
[![RAWG](https://img.shields.io/badge/RAWG-API-662D91?style=flat)](https://rawg.io/apidocs)
[![JWT](https://img.shields.io/badge/JWT-000?style=flat&logo=jsonwebtokens)](https://jwt.io)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://retro-collection-tracker.vercel.app)
[![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?logo=render&logoColor=000)](https://retro-collection-tracker.onrender.com)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=flat&logo=neon)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Pages](#-pages)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Real-time Architecture](#-real-time-architecture)
- [Authentication & Authorization](#-authentication--authorization)
- [Installation](#-installation)
- [Demo Accounts](#-demo-accounts)
- [Environment Variables](#-environment-variables)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [FAQ](#-faq)
- [License](#-license)

---

## 📖 Overview

Retro Collection Tracker is a production-grade web application designed for retro video game collectors. It combines a personal collection tracker, community features, and external game database integration into a cohesive, premium experience.

**Who it's for:** Retro game collectors who want to catalog their physical collection (cartridges, discs, boxes), discover games, trade with other collectors, and engage with a community.

**What makes it unique:**
- **RAWG integration** — search & import from 800K+ games with real cover art
- **Full trade workflow** — two-party shipping, QR codes, tracking numbers
- **XP progression** — gamified collector levels (New Collector → Museum Curator)
- **Community ratings** — separate from RAWG scores, transparent labeling
- **Real-time everything** — WebSocket-powered chat, notifications, messaging

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework with concurrent features |
| TypeScript | 5 | Type-safe development |
| Vite | 8 | Fast dev server & bundler |
| React Router | 7 | Client-side routing with lazy loading |
| SCSS | — | Custom theming with CSS variables |
| Socket.IO Client | 4 | Real-time WebSocket communication |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 11 | Progressive Node.js framework |
| TypeScript | 5 | Type-safe server development |
| Prisma | 6 | Type-safe ORM with migrations |
| PostgreSQL | 16 | Relational database |
| Socket.IO | 4 | WebSocket server (namespace `/ws`) |
| Passport | — | JWT authentication strategy |
| bcryptjs | — | Password hashing |
| class-validator | — | DTO validation |

### External APIs
| API | Purpose | Integration |
|-----|---------|-------------|
| **RAWG** | Game database (800K+ titles) | Search, import, cover images, ratings |
| **Wikipedia** | Game metadata (fallback) | When RAWG is unavailable |
| **QR Server** | QR code generation | Trade tracking codes |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite / Vercel)               │
│  React 19 + TypeScript + SCSS                            │
│  Port 5173 (dev) / Vercel CDN (prod)                     │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Pages   │ │Components│ │ Services │ │  Hooks   │   │
│  │ (25)     │ │ (15+)    │ │ (API)    │ │ (custom) │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP + WebSocket
                       ▼
┌─────────────────────────────────────────────────────────┐
│            Vite Proxy (dev) / Direct API (prod)          │
│  Dev: proxies to localhost:3000                          │
│  Production: VITE_API_URL → Render backend               │
└──────────────────────┬──────────────────────────────────┘
                       │
┌─────────────────────────────────────────────────────────┐
│                    Backend (NestJS)                       │
│  TypeScript + Prisma ORM                                 │
│  Port 3000                                                │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Auth    │ │  Games   │ │  Trade   │ │  Chat    │   │
│  │ Module   │ │  Module  │ │  Module  │ │  Module  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Social  │ │  Notifs  │ │  Admin   │ │   XP     │   │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐         │
│  │ Prisma   │ │ Socket   │ │  RAWG External   │         │
│  │ Service  │ │ Gateway  │ │  Games Service   │         │
│  └──────────┘ └──────────┘ └──────────────────┘         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  PostgreSQL    │
              │  Database      │
              │  17 tables     │
              │  7 enums       │
              │  14 migrations │
              └────────────────┘
```

---

## ✨ Features

### 🎮 Game Catalog & Discovery

The Explore page integrates with the **RAWG API** (world's largest video game database with 800K+ titles):

- **Search** — debounced search by title with 300ms delay
- **A-Z filter** — quick-jump alphabet strip for browsing
- **Pagination** — 20 games per page across 45K+ pages of RAWG data
- **One-click import** — click any game to import it with cover art, rating, platform, genre, description
- **Wishlist toggle** — add to wishlist directly from search results
- **Fallback** — Wikipedia API when RAWG is unavailable

### 📦 Collection Management

- **CRUD operations** — add, edit, remove games from your collection
- **Rich metadata** — condition (Mint → Poor), region (NTSC/PAL/NTSC-J), estimated value, personal rating
- **Sorting** — by title, rating, value, date added (ascending/descending)
- **Filtering** — by platform, condition
- **Search** — full-text search within your collection
- **Pagination** — browse through pages (20 per page)
- **Export** — download your collection as CSV or JSON
- **Cover images** — RAWG covers when imported, SVG placeholders for seeded games

### ⭐ Reviews & Ratings

Three distinct rating systems, clearly separated:

| Rating | Source | Scale | Label |
|--------|--------|-------|-------|
| **RAWG Score** | RAWG API (external) | 0 - 5 | Purple "RAWG" badge |
| **Community Rating** | Average of all collectors | 0 - 5 | "Community (N)" |
| **Your Rating** | Personal (1-5 stars) | 1 - 5 | On collection cards |

- Write reviews with star rating, title, and body
- Like/unlike reviews (toggle)
- Comment on reviews with threaded discussion
- Review section on every game detail page
- Verified owner context

### 🤝 Trade System

Complete trade workflow that mirrors real collector platforms:

```
PENDING → ACCEPTED → SHIPPED → COMPLETED
```

1. **Request** — Send trade request from any collector's profile
2. **Accept/Decline** — Receiver accepts or declines
3. **Shipping** — Both parties submit their shipping method and address separately
4. **Confirmation** — Once both submit, addresses are displayed to both sides
5. **Ship** — Sender enters tracking number, **QR code** auto-generates
6. **Complete** — Receiver confirms receipt, trade marked COMPLETED

**Shipping carriers supported:** DPD, InPost, UPS, FedEx, USPS, Royal Mail, DHL, Local Pickup

**QR codes** generated via `api.qrserver.com` encoding tracking data for easy scanning.

### 💬 Real-time Chat

- **WebSocket-powered** — instant message delivery via Socket.IO
- **Chat Widget** — floating bubble in bottom-right corner (LinkedIn-style)
- **Full Messages page** — `/messages` with conversation sidebar
- **Image sharing** — send photos via camera button
- **Moderation** — block, unblock, report users
- **Unread counts** — badge on bell icon updates in real-time

### 📊 Dashboard & Analytics

- **KPI cards** — total games, estimated value, wishlist count, completed
- **Recently Added** — grid of 4 most recent collection additions
- **Collection Value Over Time** — SVG line chart (6 months) with gradient fill
- **Recent Reviews** — up to 3 most recent with star ratings and cover images
- **Platform Distribution** — conic-gradient donut chart with legend (top 5 + Other)
- **Top Genres** — progress bars with gradient colors
- **Recent Activity** — action feed with icons, relative timestamps, clickable links
- **Wishlist Spotlight** — scrollable wishlist items with priority and estimated value
- **Highlights** — most valuable and highest rated games
- **Collection Progress** — percentage bar in sidebar

### 🏆 XP & Progression System

| Action | XP | Description |
|--------|----|-------------|
| Add game to collection | +10 | Every game you catalog |
| Write a review | +15 | Share your thoughts |
| Add to wishlist | +5 | Save for later |
| Gain a follower | +20 | Someone follows you |
| Write a comment | +3 | Engage with reviews |

**Levels:**
| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | New Collector |
| 2 | 50 | Avid Collector |
| 3 | 200 | Master Collector |
| 4 | 500 | Museum Curator |

### 👤 Profiles & Social

- **Profile page** — avatar, display name, bio, location (country + city via dropdown with 182 countries), XP bar, collector level
- **Follow/unfollow** — one-click follow from any profile
- **Tabs** — Collection, Reviews, Followers, Following
- **Actions** — Message, Trade buttons on every profile
- **Activity feed** — `/activity` logs all your actions
- **Notifications** — real-time via WebSocket

### 🛡️ Moderation

- **Block users** — prevents messaging, conversation stays visible
- **Unblock users** — restores messaging instantly
- **Report users** — 8 reason options (Harassment, Racism, Spam, Threats, etc.)
- **"Other" reason** — requires custom text explanation
- **Report success** — green toast notification

### 🔔 Real-time Notifications

- WebSocket events: `notification:new`, `notification:unread`
- Types: NEW_FOLLOWER, NEW_REVIEW, WISHLIST_AVAILABLE, SYSTEM
- Bell icon with unread badge count
- Mark individual or all as read
- Notification preferences (email, push, follows, reviews, wishlist)

---

## 📄 Pages

| # | Page | Route | Auth | Description |
|---|------|-------|------|-------------|
| 1 | **Home** | `/` | ❌ | Landing page with animated stats |
| 2 | **Login** | `/login` | ❌ | Login form + forgot password modal |
| 3 | **Register** | `/register` | ❌ | Registration with validation |
| 4 | **Dashboard** | `/dashboard` | ✅ | KPIs, charts, activity, highlights |
| 5 | **Explore** | `/explore` | ❌ | RAWG catalog search + A-Z filter |
| 6 | **Collection** | `/collection` | ✅ | Game grid, sort, filter, pagination |
| 7 | **Wishlist** | `/wishlist` | ✅ | Priority-based wishlist with sorting |
| 8 | **GameDetails** | `/games/:id` | ❌ | Info, ratings, reviews, comments |
| 9 | **AddGame** | `/add-game` | ✅ | RAWG import + collection form |
| 10 | **EditGame** | `/edit-game/:id` | ✅ | Edit metadata, cover, rating |
| 11 | **Profile** | `/profile/:username` | ❌ | Avatar, XP, tabs, follow/message/trade |
| 12 | **Settings** | `/settings` | ✅ | Profile, password, email, notifications |
| 13 | **Messages** | `/messages` | ✅ | Full chat with conversations |
| 14 | **Trade** | `/trade` | ✅ | Receive/sent, shipping, QR codes |
| 15 | **Activity** | `/activity` | ✅ | Deduplicated action log |
| 16 | **Notifications** | `/notifications` | ✅ | Real-time notification center |
| 17 | **Reviews** | `/reviews` | ✅ | Your reviews with game context |
| 18 | **Leaderboard** | `/leaderboard` | ❌ | 🥇🥈🥉 podium + ranked list |
| 19 | **How It Works** | `/how-it-works` | ❌ | Full platform guide (13 sections) |
| 20 | **Friends** | `/friends` | ✅ | Followers/following tabs |
| 21 | **Admin** | `/admin` | Admin | User management, game catalog |
| 22 | **Platforms** | `/platforms` | ❌ | All platforms grid |
| 23 | **Genres** | `/genres` | ❌ | All genres grid |
| 24 | **Donate** | `/donate` | ❌ | Subscription tiers + progress |
| 25 | **NotFound** | `*` | ❌ | Styled 404 error page |

---

## 📡 API Reference

### Authentication (`/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Create account |
| POST | `/auth/login` | ❌ | Login → JWT token |
| GET | `/auth/me` | ✅ | Current user profile |
| PUT | `/auth/me` | ✅ | Update profile (username, displayName, bio, avatarUrl, location) |
| POST | `/auth/change-password` | ✅ | Change password |
| POST | `/auth/change-email` | ✅ | Change email (max 3 per account) |
| POST | `/auth/verify-email` | ✅ | Verify email with token |
| POST | `/auth/resend-verification` | ✅ | Resend verification email |
| POST | `/auth/forgot-password` | ❌ | Send reset email |
| POST | `/auth/reset-password` | ❌ | Reset password with token |

### Games (`/games`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/games` | ❌ | List local games (paginated) |
| GET | `/games/external-search?q=&page=` | ❌ | Search RAWG database |
| POST | `/games/import` | ✅ | Import game via external source (rawg/wikipedia) |
| GET | `/games/platforms` | ❌ | List platforms |
| GET | `/games/genres` | ❌ | List genres |
| GET | `/games/:id` | ❌ | Game detail with community rating |
| POST | `/games` | Admin | Create game manually |
| PUT | `/games/:id` | Admin | Update game |
| DELETE | `/games/:id` | Admin | Delete game |

### Collections (`/collections`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/collections` | ✅ | User's collection (sort, filter, paginate) |
| POST | `/collections` | ✅ | Add game to collection |
| PUT | `/collections/:id` | ✅ | Update entry |
| DELETE | `/collections/:id` | ✅ | Remove entry |
| GET | `/collections/stats` | ✅ | Dashboard analytics |
| GET | `/collections/value-history` | ✅ | 6-month value chart data |
| GET | `/collections/export?format=csv|json` | ✅ | Export collection |
| GET | `/collections/user/:userId` | ❌ | Public user collection |

### Trade (`/trade`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/trade/request` | ✅ | Send trade request |
| GET | `/trade/received` | ✅ | Incoming requests |
| GET | `/trade/sent` | ✅ | Outgoing requests |
| POST | `/trade/:id/accept` | ✅ | Accept trade |
| POST | `/trade/:id/decline` | ✅ | Decline trade |
| POST | `/trade/:id/cancel` | ✅ | Cancel trade |
| POST | `/trade/:id/shipping` | ✅ | Submit shipping details |
| POST | `/trade/:id/ship` | ✅ | Mark as shipped (with tracking) |
| POST | `/trade/:id/received` | ✅ | Confirm receipt |
| GET | `/trade/unread-count` | ✅ | Pending requests count |

### Chat (`/messages`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/messages` | ✅ | Send message |
| GET | `/messages/conversations` | ✅ | List conversations |
| GET | `/messages/conversations/:userId` | ✅ | Get message thread |
| GET | `/messages/unread-count` | ✅ | Unread count |
| POST | `/messages/block/:userId` | ✅ | Block user |
| POST | `/messages/unblock/:userId` | ✅ | Unblock user |
| GET | `/messages/blocked` | ✅ | List blocked users |
| POST | `/messages/report/:userId` | ✅ | Report user |

### Reviews (`/reviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/game/:gameId` | ❌ | Reviews for a game |
| GET | `/reviews/user/:userId` | ❌ | Reviews by a user |
| POST | `/reviews` | ✅ | Create review |
| PUT | `/reviews/:id` | ✅ | Update review |
| DELETE | `/reviews/:id` | ✅ | Delete review |
| POST | `/reviews/:id/like` | ✅ | Toggle like |
| POST | `/reviews/:id/comments` | ✅ | Add comment |
| GET | `/reviews/:id/comments` | ❌ | Get comments |

### Social (`/follow`, `/activity`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/follow/:userId` | ✅ | Follow user |
| DELETE | `/follow/:userId` | ✅ | Unfollow user |
| GET | `/follow/:userId/status` | ✅ | Check follow status |
| GET | `/users/:userId/followers` | ❌ | Follower list |
| GET | `/users/:userId/following` | ❌ | Following list |
| GET | `/activity` | ✅ | User activity feed |

### Notifications (`/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | ✅ | List notifications |
| GET | `/notifications/unread-count` | ✅ | Unread notification count |
| POST | `/notifications/:id/read` | ✅ | Mark notification as read |
| POST | `/notifications/read-all` | ✅ | Mark all as read |

### Notification Preferences (`/notification-preferences`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notification-preferences` | ✅ | Get preferences |
| PUT | `/notification-preferences` | ✅ | Update preferences |

### Stats (`/stats`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats/public` | ❌ | Public site stats |
| GET | `/stats/leaderboard` | ❌ | Top 10 collectors |
| GET | `/stats/donate` | ❌ | Fundraising progress |

### Admin (`/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/users` | Admin | List users |
| PUT | `/admin/users/:id/role` | Admin | Change user role |
| PUT | `/admin/users/:id/toggle-active` | Admin | Activate/deactivate |
| GET | `/admin/games` | Admin | List games |

### Upload (`/upload`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload/avatar` | ✅ | Upload avatar image |
| POST | `/upload/cover/:gameId` | ✅ | Upload game cover |
| POST | `/upload/collection-cover/:colId` | ✅ | Upload collection entry cover |

> **API documentation:** Full interactive Swagger docs available at `GET /api-docs` when the backend is running.

---

## 🗄 Database Schema

### Models (17 total)

```
User ───┬─── Collection        ── Game
         ├─── Wishlist          ── Game
         ├─── Review            ── Game
         │     └── ReviewComment
         │     └── ReviewLike
         ├─── Follow (follower)
         ├─── Follow (following)
         ├─── ActivityLog
         ├─── Notification
         ├─── NotificationPreference
         ├─── Message (sent)
         ├─── Message (received)
         ├─── Block (initiated)
         ├─── Block (received)
         ├─── Report (made)
         ├─── Report (received)
         └─── TradeRequest (sent/received)

Game ───┬─── Platform
         └─── Genre
```

### Enums (7)
- `UserRole` — USER, ADMIN, MODERATOR
- `Condition` — MINT, NEAR_MINT, VERY_GOOD, GOOD, ACCEPTABLE, POOR, MISSING_PARTS
- `Region` — NTSC, PAL, NTSC_J, REGION_FREE
- `OwnershipStatus` — OWNED, WISHLIST, FOR_SALE, TRADED
- `ActivityType` — 10 types (ADDED_GAME, REMOVED_GAME, FOLLOWED_USER, etc.)
- `NotificationType` — 5 types (NEW_FOLLOWER, NEW_REVIEW, etc.)
- `TradeStatus` — PENDING, ACCEPTED, DECLINED, CANCELLED, SHIPPED, COMPLETED

### Indexes
- All foreign keys indexed
- Composite unique constraints on `userId_gameId` for Collection, Wishlist, Review
- Activity logs indexed by `userId + createdAt DESC` for feed queries
- Notifications indexed by `recipientId + isRead + createdAt DESC`
- Full-text search index on Game title
- Trade requests indexed by status for unread counting

---

## ⚡ Real-time Architecture

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Frontend    │     │   Socket.IO     │     │   Backend    │
│              │     │   Namespace /ws  │     │              │
│ ┌──────────┐ │     │                 │     │ ┌──────────┐ │
│ │ Chat     │────WebSocket─────────────│────│ │ Gateway  │ │
│ │ Widget   │ │     │                 │     │ │ Service  │ │
│ └──────────┘ │     │ JWT Auth:       │     │ └──────────┘ │
│ ┌──────────┐ │     │ handshake.auth  │     │              │
│ │ Notif    │───────.token──────────────│────│ Notifications│
│ │ Bell     │ │     │                 │     │ Service     │
│ └──────────┘ │     │ Rooms: userId   │     └──────────────┘
│ ┌──────────┐ │     │                 │
│ │ Messages │───────'notification:new'───│───▶ New notif
│ │ Page     │ │     │                 │     │
│ └──────────┘ │     │'notification:   │     │
│              │───────unread'───────────│───▶ Badge count
└──────────────┘     └─────────────────┘     └──────────────┘
```

**Events:**
| Event | Direction | Payload | Trigger |
|-------|-----------|---------|---------|
| `notification:new` | Server → Client | Full notification object | New follower, review, wishlist |
| `notification:unread` | Server → Client | `{ count }` | Any notification change |
| `message:new` | Server → Client | Full message object | New chat message |

---

## 🔐 Authentication & Authorization

### JWT Strategy
- Access tokens issued on login via `POST /auth/login`
- Tokens contain: `sub` (userId), `email`
- Sent as `Authorization: Bearer <token>` header
- Configurable via `JWT_SECRET` env var (default warning in dev)

### Guards
| Guard | Purpose |
|-------|---------|
| `JwtAuthGuard` | Requires valid JWT token |
| `RolesGuard` | Requires specific role (USER, ADMIN, MODERATOR) |
| `Public` decorator | Bypasses JWT auth on specific endpoints |
| `ThrottlerGuard` | Rate limiting (configurable per endpoint) |

### Protected vs Public Routes
- **Public**: Explore, GameDetails, Profiles, Leaderboard, HowItWorks, Platforms, Genres, Home, Login, Register
- **User**: Dashboard, Collection, Wishlist, Messages, Trade, Settings, Activity, Notifications, Reviews, Friends
- **Admin**: Admin panel (/admin)

---

## 🚀 Installation

### Prerequisites
- **Node.js** ≥ 20.x
- **npm** ≥ 9.x
- **PostgreSQL** ≥ 14
- **RAWG API Key** (free, register at https://rawg.io/apidocs)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ricardocesidio/retro-collection-tracker.git
cd retro-collection-tracker

# 2. Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env: set DATABASE_URL, JWT_SECRET, RAWG_API_KEY
npx prisma migrate deploy
npx prisma db seed        # Seeds 299 games, 5 users, reviews, follows
npm run start:dev         # Backend starts on http://localhost:3000

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm run dev               # Frontend starts on http://localhost:5173
```

### Database Seeding

```bash
# The seed creates:
# - 299 games across 12 platforms (NES, SNES, N64, Genesis, Saturn, etc.)
# - 5 users with realistic collections
# - Follow relationships and reviews
npx prisma db seed

# Reset and re-seed:
npx prisma migrate reset --force
npx prisma db seed

# Create demo account (clone of alice's data):
npm run demo              # email: demo@retro-tracker.com / password: demo1234
```

---

## 👥 Demo Accounts

| Username | Display Name | Email | Password | Location | Collection |
|----------|-------------|-------|----------|----------|------------|
| `demo_collector` | Demo Collector | demo@retro-tracker.com | demo1234 | São Paulo, Brazil | 12 games |
| `retro_alice` | Alice | alice@example.com | password123 | São Paulo, Brazil | 12 games |
| `bob_collector` | Bob | bob@example.com | password123 | New York, USA | 8 games |
| `retro_charlie` | Charlie | charlie@example.com | password123 | Tokyo, Japan | 8 games |
| `diana_gamer` | Diana | diana@example.com | password123 | London, UK | 7 games |
| `admin` | Admin | admin@example.com | password123 | Seattle, USA | Admin access |

> **One-click demo:** The login page has a **"Demo Login"** button that auto-fills `demo@retro-tracker.com` and signs you in instantly.

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retro_collection_tracker?schema=public"

# JWT
JWT_SECRET="your-secure-random-string-here"

# RAWG API (get free key at https://rawg.io/apidocs)
RAWG_API_KEY="your-rawg-api-key"

# Donation display values (optional)
DONATE_RAISED=247
DONATE_GOAL=500
DONATE_SUPPORTERS=34

# CORS (comma-separated origins)
CORS_ORIGIN="http://localhost:5173,http://localhost:5174"

# Cloudflare R2 — optional, enables persistent file storage
# R2_ENDPOINT="https://<account>.r2.cloudflarestorage.com"
# R2_ACCESS_KEY="..."
# R2_SECRET_KEY="..."
# R2_BUCKET="retro-collection"
# R2_PUBLIC_URL="https://pub-xxxxx.r2.dev"
```

---

## 💻 Development Guide

### Commands

```bash
# Backend
cd backend
npm run start:dev      # Watch mode with hot reload
npm run build          # Production build
npm test               # Run tests (12 tests, 3 suites)
npx prisma studio      # Database GUI (port 5555)
npx prisma migrate dev # Create new migration

# Frontend
cd frontend
npm run dev            # Dev server with HMR (port 5173)
npm run build          # Production build
```

### Proxy Configuration

The frontend dev server proxies API calls to the backend via `vite.config.ts`:

```typescript
// API paths proxied to localhost:3000
'/games', '/auth', '/collections', '/trade', '/messages',
'/wishlist', '/reviews', '/users', '/follow', '/notifications',
'/activity', '/stats', '/admin', '/upload'
```

The `skipHtml` bypass function ensures page navigations are served by the SPA while API calls are forwarded to the backend.

### Code Style

- **Backend**: NestJS modules with controllers, services, DTOs, guards
- **Frontend**: Page components in `src/pages/`, shared UI in `src/components/ui/`, API services in `src/services/`
- **SCSS**: Variables in `src/styles/_variables.scss`, global styles in `src/styles/global.scss`
- **Lazy loading**: All pages except Home, Login, Register, NotFound use `React.lazy()`

---

## 📦 Deployment

### 🔗 Live URLs

| Service | URL | Platform |
|---------|-----|----------|
| **Frontend** | https://retro-collection-tracker.vercel.app | Vercel (free) |
| **Backend** | https://retro-collection-tracker.onrender.com | Render (free) |
| **Database** | Neon PostgreSQL (cloud) | Neon (free) |
| **Warm-up** | cron-job.org (pings every 15min) | Free |

### 🚀 Step-by-step (Vercel + Render + Neon — $0)

#### 1. Database — Neon ([neon.tech](https://neon.tech))

```bash
# Create a free account → new project → copy connection string
# Then dump your local data and restore:
bash scripts/deploy-db.sh
pg_restore --no-owner --no-privileges -d "postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" /tmp/retro_collection_dump.dump
```

#### 2. Backend — Render ([render.com](https://render.com))

Create a **Web Service** with these settings:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Health Check Path** | `/` |
| **Plan** | Free |

Environment variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | Secure random string |
| `RAWG_API_KEY` | `805cd8ace47e45b4bebf8fffe343560d` |
| `CORS_ORIGIN` | `https://retro-collection-tracker.vercel.app,https://retro-collection-tracker.onrender.com` |

#### 3. Frontend — Vercel ([vercel.com](https://vercel.com))

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

Environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://retro-collection-tracker.onrender.com` |

> Vercel also proxies `/uploads/*` requests to Render via `vercel.json` for avatar/cover images stored on disk.

#### 4. Prevent sleep (free)

Create a free account at [cron-job.org](https://cron-job.org) and set up a job:

| Setting | Value |
|---------|-------|
| **URL** | `https://retro-collection-tracker.onrender.com` |
| **Interval** | Every 15 minutes |

This keeps the Render backend awake (free tier spins down after 15min of inactivity).

### 💾 File Storage

Uploaded files (avatars, game covers, collection covers) are stored on **Render's local filesystem** via multer disk storage. They persist between normal usage but are **reset on each deploy** (Render free tier has ephemeral storage).

The code includes a ready-to-use **Cloudflare R2** integration (`UploadService`) — set these env vars to enable persistent S3-compatible storage:

| Key | Description |
|-----|-------------|
| `R2_ENDPOINT` | `https://<account>.r2.cloudflarestorage.com` |
| `R2_ACCESS_KEY` | R2 API token access key |
| `R2_SECRET_KEY` | R2 API token secret |
| `R2_BUCKET` | `retro-collection` |
| `R2_PUBLIC_URL` | Your bucket's public URL |

## 📁 Project Structure

```
retro-collection-tracker/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (17 models)
│   │   ├── seed.ts                # Data seeder (299 games, 5 users)
│   │   ├── create-demo.ts         # Demo account creator (clone of alice)
│   │   └── migrations/            # 14 migration files
│   ├── render.yaml                # Render IaC config
│   ├── .env.example               # Environment template
│   ├── src/
│   │   ├── auth/                  # JWT auth, register, login, profile
│   │   ├── games/                 # RAWG integration, game CRUD
│   │   ├── collections/           # Collection management, stats
│   │   ├── trade/                 # Trade requests, shipping, QR codes
│   │   ├── messages/              # Chat, blocking, reporting
│   │   ├── social/                # Follow, activity, notifications
│   │   ├── reviews/               # Reviews, likes, comments
│   │   ├── wishlist/              # Wishlist management
│   │   ├── users/                 # User profiles
│   │   ├── upload/                # File uploads (avatar, covers)
│   │   │   ├── upload.controller.ts
│   │   │   ├── upload.service.ts   # R2-ready S3 storage with local fallback
│   │   │   └── upload.module.ts
│   │   ├── admin/                 # Admin dashboard
│   │   ├── xp/                    # XP system
│   │   ├── config/                # Configuration module
│   │   ├── prisma/                # Prisma service
│   │   └── common/                # Guards, filters, decorators
│   ├── test/                      # E2E tests
│   └── package.json
│
├── scripts/
│   └── deploy-db.sh            # Database dump/restore helper
│
├── frontend/
│   ├── vercel.json              # SPA rewrites + uploads proxy
│   ├── .env                     # Dev VITE_API_URL (empty → uses Vite proxy)
│   ├── .env.production          # Production VITE_API_URL (overridden by Vercel env)
│   ├── src/
│   │   ├── pages/                 # 25 page components
│   │   ├── components/
│   │   │   ├── ui/               # Reusable UI components
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── ChatWidget/
│   │   │   │   ├── ConfirmDialog/
│   │   │   │   ├── ActivityItem/
│   │   │   │   ├── NotificationBell/
│   │   │   │   ├── StarRating/
│   │   │   │   ├── StatCard/
│   │   │   │   ├── ProgressCard/
│   │   │   │   ├── Badge/
│   │   │   │   ├── Alert/
│   │   │   │   ├── LoadingSpinner/
│   │   │   │   └── EmptyState/
│   │   │   └── layout/           # AppLayout, Sidebar, TopBar
│   │   ├── services/              # API clients
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── context/               # AuthContext
│   │   ├── styles/                # Global SCSS, variables, mixins
│   │   ├── data/                  # Static data (countries, cities)
│   │   └── types/                 # Shared TypeScript types
│   ├── vite.config.ts             # Vite config with proxy rules
│   └── package.json
│
└── README.md
```

---

## ❓ FAQ

**Q: Can I trade digital games?**
A: No — this platform facilitates trades of physical games. The trade system helps collectors find trade partners and agree on terms. The actual exchange happens between collectors via shipping.

**Q: Where do game covers come from?**
A: Games imported from RAWG use real cover art from `media.rawg.io`. Seeded demo games use `placehold.co` placeholder images with the game title.

**Q: How is the community rating calculated?**
A: It's the average of all `personalRating` values from collection entries where users have rated the game. It updates in real-time as more users rate.

**Q: Is the XP system retroactive?**
A: Yes — when the XP system was added, existing user data was backfilled to award XP for their existing games, reviews, wishlists, and followers.

**Q: How many demo users are there?**
A: 11 accounts total: 6 seeded users (demo_collector, alice, bob, charlie, diana, admin) plus 5 registered demo traders (retro_elena, cart_finder, nes_hunter, game_master, pixel_queen).

---

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for retro game collectors everywhere<br>
  <sub>Last updated: May 2026 — Live at <a href="https://retro-collection-tracker.vercel.app">retro-collection-tracker.vercel.app</a></sub>
</p>
