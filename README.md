# Retro Collection Tracker 🎮

A full-stack retro game collection management platform with social features, RAWG integration, real-time chat, trade system with QR codes, XP progression, and community reviews.

Built with **NestJS** (backend), **React** (frontend), **PostgreSQL** (database), **Prisma** (ORM), and **Socket.IO** (real-time).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, SCSS, Vite, React Router |
| **Backend** | NestJS 11, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (via Prisma) |
| **Real-time** | Socket.IO (WebSocket) |
| **External API** | RAWG Video Games Database (800K+ games) |
| **Auth** | JWT (access tokens), bcryptjs |

---

## Features

### 🎮 Game Catalog
- Browse 800K+ games from the RAWG database
- Search by title with debounced autocomplete
- A-Z quick filter letters
- Paginated results (20 per page)
- Import any game with one click — covers, ratings, platforms, genres

### 📦 Collection Management
- Add games with condition (Mint → Poor), region (NTSC/PAL/NTSC-J), estimated value, personal rating
- Edit or remove games anytime
- Sort by title, rating, value, date added
- Filter by platform, condition
- Search within your collection
- Paginated collection view
- Export collection as CSV or JSON

### ⭐ Reviews & Ratings
- **RAWG Rating** — community score from the global RAWG database
- **Community Rating** — average from all collectors who own the game
- **Your Rating** — personal 1-5 star rating per game
- Write reviews with title, body, and star rating
- Like/unlike reviews
- Comment on reviews with threaded discussion
- All ratings shown separately with clear labels

### 🤝 Trade System
- Propose trades from any collector's profile
- Full shipping workflow with real carrier options: DPD, InPost, UPS, FedEx, USPS, Royal Mail, DHL, Local Pickup
- **Two-party address exchange** — both sides submit their shipping info
- **QR code generation** — tracking number encoded into scannable QR code
- Status tracking: PENDING → ACCEPTED → SHIPPED → COMPLETED
- Location badges help determine shipping feasibility
- Demo traders: diana_gamer, retro_elena, cart_finder, nes_hunter

### 💬 Real-time Chat
- Direct messaging via WebSocket
- Floating chat widget (bottom-right corner)
- Full Messages page at `/messages`
- Send text messages and photos
- Block/unblock users
- Report users with reason selection (harassment, spam, threats, etc.)
- Conversation list with unread counts
- User profiles linked from chat header

### 📊 Dashboard & Analytics
- KPI cards: Total Games, Est. Value, Wishlist Count
- Recently Added grid with 4 latest additions
- Collection Value Over Time — SVG line chart (6 months)
- Recent Reviews with star ratings
- Platform Distribution — conic-gradient donut chart
- Top Genres — progress bars
- Recent Activity feed with relative timestamps
- Wishlist Spotlight — scrollable wishlist items
- Highlights: Most Valuable + Highest Rated games
- Collection Progress with percentage in sidebar

### 🏆 XP & Progression
- Earn XP for every action: +10 add game, +15 write review, +5 wishlist, +20 get follower, +3 comment
- Level progression: New Collector (0) → Avid Collector (50) → Master Collector (200) → Museum Curator (500)
- XP bar with progress toward next level on profile
- Leaderboard ranking collectors by total collection value

### 👤 Profiles & Social
- User profiles with avatar, bio, location (country + city selector)
- Follow/unfollow other collectors
- Tabs: Collection, Reviews, Followers, Following
- Send Message button on every profile
- Trade button on every profile
- Activity feed of recent actions
- Notification system with real-time WebSocket alerts

### 🔔 Notifications
- Real-time via WebSocket (`/ws` namespace)
- Notification types: NEW_FOLLOWER, NEW_REVIEW, WISHLIST_AVAILABLE
- Unread count badge on bell icon
- Mark individual or all notifications as read
- Notification preferences (email, push, follows, reviews, wishlist)

### 🛡️ Moderation & Safety
- Block users — prevents messaging, conversation stays visible
- Unblock users — restores messaging
- Report users with reason (Harassment, Racism, Bullying, Spam, Threats, etc.)
- Custom text required for "Other" report reason
- Chat deletion separate from blocking

### 📱 Responsive Sidebar
- All navigation links fit without scrolling
- Sections: Main, Discover, Social, Settings, Admin
- Collapsible hamburger menu on mobile
- Collection progress bar at bottom

---

## Pages (25 total)

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Home | `/` | No | Landing page with stats counter |
| Login | `/login` | No | Login with forgot password |
| Register | `/register` | No | Registration form |
| Dashboard | `/dashboard` | Yes | Collection analytics, charts, activity |
| Explore | `/explore` | No | RAWG game catalog search |
| Collection | `/collection` | Yes | User's game collection |
| Wishlist | `/wishlist` | Yes | Wishlist with priorities |
| GameDetails | `/games/:id` | No | Game info, ratings, reviews |
| AddGame | `/add-game` | Yes | Import RAWG games |
| EditGame | `/edit-game/:id` | Yes | Edit collection entry |
| Profile | `/profile/:username` | No | User profile with tabs |
| Settings | `/settings` | Yes | Profile, password, email, notifications |
| Messages | `/messages` | Yes | Full chat interface |
| Trade | `/trade` | Yes | Trade requests with shipping |
| Activity | `/activity` | Yes | User action log |
| Notifications | `/notifications` | Yes | Notification center |
| Reviews | `/reviews` | Yes | User's reviews |
| Leaderboard | `/leaderboard` | No | Top 10 collectors by value |
| How It Works | `/how-it-works` | No | Full platform guide |
| Friends | `/friends` | Yes | Followers/following |
| Admin | `/admin` | Admin | User & game management |
| Platforms | `/platforms` | No | All platforms list |
| Genres | `/genres` | No | All genres list |
| Donate | `/donate` | No | Support page |
| NotFound | `*` | No | 404 page |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- RAWG API key (free: https://rawg.io/apidocs)

### Installation

```bash
# Clone the repo
git clone https://github.com/ricardocesidio/retro-collection-tracker.git
cd retro-collection-tracker

# Backend setup
cd backend
cp .env.example .env        # Configure DATABASE_URL, JWT_SECRET, RAWG_API_KEY
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev           # Backend on port 3000

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev                 # Frontend on port 5173
```

### Demo Accounts

| Username | Email | Password | Location |
|----------|-------|----------|----------|
| `retro_alice` | alice@example.com | password123 | São Paulo, Brazil |
| `bob_collector` | bob@example.com | password123 | New York, USA |
| `retro_charlie` | charlie@example.com | password123 | Tokyo, Japan |
| `diana_gamer` | diana@example.com | password123 | London, UK |
| `admin` | admin@example.com | password123 | Seattle, USA |

---

## API Overview

### Authentication (`/auth`)
- `POST /auth/register` — Create account
- `POST /auth/login` — Login, returns JWT
- `GET /auth/me` / `PUT /auth/me` — Get/update profile
- `POST /auth/change-password` — Change password
- `POST /auth/change-email` — Change email (max 3 times)

### Games (`/games`)
- `GET /games` — List local games
- `GET /games/external-search?q=` — Search RAWG database
- `POST /games/import` — Import game from RAWG
- `GET /games/:id` — Game details with ratings

### Collections (`/collections`)
- `GET /collections` — User's collection (with sort, filter, pagination)
- `POST /collections` — Add game to collection
- `PUT /collections/:id` — Update entry
- `DELETE /collections/:id` — Remove from collection
- `GET /collections/stats` — Dashboard analytics
- `GET /collections/value-history` — Value chart data
- `GET /collections/export?format=csv|json` — Export

### Trade (`/trade`)
- `POST /trade/request` — Send trade request
- `GET /trade/received` / `GET /trade/sent` — List trades
- `POST /trade/:id/accept` / `decline` / `cancel` — Manage requests
- `POST /trade/:id/shipping` — Submit shipping details
- `POST /trade/:id/ship` — Mark as shipped with tracking
- `POST /trade/:id/received` — Confirm receipt

### Chat (`/messages`)
- `POST /messages` — Send message
- `GET /messages/conversations` — List conversations
- `GET /messages/conversations/:userId` — Get messages
- `POST /messages/block/:userId` — Block user
- `POST /messages/unblock/:userId` — Unblock
- `POST /messages/report/:userId` — Report user

### Social (`/follow`, `/activity`)
- `POST /follow/:userId` — Follow user
- `GET /users/:userId/followers` / `following` — Lists
- `GET /activity` — User activity feed

### Stats (`/stats`)
- `GET /stats/public` — Public platform stats
- `GET /stats/leaderboard` — Top 10 collectors
- `GET /stats/donate` — Donation progress

---

## Database Schema (17 models)

- **User** — accounts, XP, location, auth fields
- **Game** — title, platform, genre, RAWG rating, cover
- **Platform** / **Genre** — reference data
- **Collection** — user's games with condition, rating, value
- **Wishlist** — wanted games with priority, estimated value
- **Review** / **ReviewComment** / **ReviewLike** — community reviews
- **Follow** — follower relationships
- **ActivityLog** — all user actions with polymorphic targets
- **Notification** / **NotificationPreference** — real-time alerts
- **Message** / **Block** / **Report** — chat & moderation
- **TradeRequest** — trades with shipping fields, status enum

---

## Real-time Features

- **Socket.IO** on `/ws` namespace with JWT authentication
- `notification:new` — new notifications pushed instantly
- `notification:unread` — badge count updates in real-time
- `message:new` — chat messages delivered instantly
- WebSocket toggling on auth:logout

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/retro_db
JWT_SECRET=your-secret-key
RAWG_API_KEY=your-rawg-api-key
DONATE_RAISED=247
DONATE_GOAL=500
DONATE_SUPPORTERS=34
```
