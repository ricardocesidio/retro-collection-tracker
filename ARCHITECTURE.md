# 🧠 Retro Collection Tracker — Architecture & Concepts

A deep dive into the technical concepts, design decisions, and architecture of the Retro Collection Tracker full-stack application.

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Monorepo Workspace](#monorepo-workspace)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [Authentication Flow](#authentication-flow)
- [Real-time Communication](#real-time-communication)
- [State Management](#state-management)
- [Routing & Code Splitting](#routing--code-splitting)
- [Responsive Design System](#responsive-design-system)
- [File Upload System](#file-upload-system)
- [Deployment Strategy](#deployment-strategy)
- [Data Flow Examples](#data-flow-examples)
- [Design Decisions](#design-decisions)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                   Frontend (Vite)                     │
│  React 19 · TypeScript · SCSS · Socket.IO Client     │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Pages   │  │Components│  │ Services │           │
│  │  (25)    │  │  (15+)   │  │  (API)   │           │
│  └──────────┘  └──────────┘  └──────────┘           │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP REST + WebSocket
                       ▼
┌──────────────────────────────────────────────────────┐
│  Vite Proxy (dev)  /  Direct API Call (production)   │
│  Dev: localhost:5173 → localhost:3000                 │
│  Prod: Vercel → https://backend.onrender.com          │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────────────────────────────────────┐
│                   Backend (NestJS)                    │
│  TypeScript · Prisma · Socket.IO · JWT · bcryptjs    │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Auth    │  │  Games   │  │  Trade   │           │
│  │ Module   │  │  Module  │  │  Module  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  Social  │  │  Notifs  │  │  Upload  │           │
│  │  Module  │  │  Module  │  │  Module  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │ Prisma   │  │ Socket   │  │  RAWG External   │   │
│  │ Service  │  │ Gateway  │  │  Games Service   │   │
│  └──────────┘  └──────────┘  └──────────────────┘   │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │  PostgreSQL    │
              │  (Neon Cloud)  │
              │  17 tables     │
              │  7 enums       │
              └────────────────┘
```

### Key Principles

- **Separation of concerns**: Backend (NestJS modules) vs Frontend (React pages + services)
- **RESTful API**: Stateless HTTP communication between frontend and backend
- **JWT authentication**: Token-based auth with role-based authorization
- **Real-time via WebSocket**: Socket.IO for instant chat and notifications
- **Code splitting**: Lazy-loaded routes for optimal bundle size
- **Mobile-first responsive**: All pages adapt to mobile viewports

---

## Monorepo Workspace

The project uses **npm workspaces** with a root `package.json`:

```json
{
  "name": "retro-collection-tracker",
  "private": true,
  "workspaces": ["backend", "frontend"]
}
```

### Why npm Workspaces?

- **Single install**: `npm install` at root installs both frontend and backend dependencies
- **Shared commands**: Root scripts like `npm run dev` start both servers simultaneously
- **Consistent versioning**: Lockfile at root level ensures dependency consistency
- **Simplified CI/CD**: Single install step in deployment pipelines

### Root Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Starts both frontend + backend |
| `npm run dev:frontend` | Frontend only |
| `npm run dev:backend` | Backend only |
| `npm run build` | Builds both projects |
| `npm run db:seed` | Seeds the database |
| `npm run db:studio` | Opens Prisma Studio |
| `npm run demo` | Creates demo account |
| `npm run typecheck` | TypeScript checks |

---

## Frontend Architecture

### Component Tree

```
App
├── ErrorBoundary
│   └── AuthProvider (Context)
│       └── Routes
│           ├── Login (standalone)
│           ├── Register (standalone)
│           └── AppLayout
│               ├── Sidebar
│               │   └── Navigation links + Collection Progress
│               ├── TopBar
│               │   ├── SearchBar (with autocomplete)
│               │   ├── Action Buttons (add, wishlist, messages, trade)
│               │   ├── NotificationBell
│               │   └── ProfileChip → DropdownMenu
│               ├── <Outlet /> (page content)
│               ├── ChatWidget (floating, only when logged in)
│               └── MobileBottomNav (only on mobile, only when logged in)
```

### Page Structure

All pages follow this pattern:
1. **Lazy loaded** via `React.lazy()` and `<Suspense>`
2. **Standalone SCSS** file per page
3. **API calls** through service modules (`src/services/`)
4. **Shared UI** through `src/components/ui/`

### Service Layer

Services abstract API calls and provide typed interfaces:

```
src/services/
├── api-client.ts        # Base fetch wrapper with auth headers + error handling
├── auth.ts              # Login, register, profile
├── collections.ts       # Collection CRUD, games catalog, stats
├── messages.ts          # Chat conversations, message threads
├── social.ts            # Follow, notifications, wishlist
└── trade.ts             # Trade requests, shipping
```

**api-client.ts** handles:
- JWT token injection from `localStorage`
- 401 response → automatic logout
- Network error handling
- File uploads via FormData

### Context API

The `AuthContext` provides global authentication state:

```typescript
interface AuthState {
  user: User | null;        // Current user profile
  token: string | null;     // JWT from localStorage
  loading: boolean;         // Initial auth check
  error: string | null;     // Login/register errors
}
```

Actions: `login()`, `register()`, `logout()`, `clearError()`

The context initializes by checking `localStorage` for an existing token and validating it via `GET /auth/me`.

---

## Backend Architecture

### NestJS Module Structure

```
src/
├── auth/          # JWT authentication, registration, profile
├── games/         # Game catalog, RAWG API integration
├── collections/   # Collection CRUD, stats, value history
├── trade/         # Trade requests, shipping, QR codes
├── messages/      # Chat, blocking, reporting
├── social/        # Follow, activity feed, notifications
├── reviews/       # Reviews, likes, comments
├── wishlist/      # Wishlist CRUD
├── users/         # User profiles by username
├── upload/        # File uploads (local disk / R2)
├── admin/         # Admin dashboard
├── xp/            # XP system
├── config/        # Configuration module
├── prisma/        # Prisma service (DB client)
└── common/        # Guards, decorators, filters
```

### Module Pattern

Each module follows NestJS conventions:

```
auth/
├── auth.controller.ts    # Route handlers (/auth/*)
├── auth.service.ts       # Business logic
├── auth.module.ts        # Module definition
├── dto/                  # Data Transfer Objects (validation)
│   ├── login.dto.ts
│   ├── register.dto.ts
│   └── change-password.dto.ts
├── guards/               # Auth guards
│   └── jwt-auth.guard.ts
└── strategies/           # Passport strategies
    └── jwt.strategy.ts
```

### Guards & Authorization

| Guard | Type | Purpose |
|-------|------|---------|
| `JwtAuthGuard` | Global | Requires valid JWT on all routes by default |
| `@Public()` | Decorator | Exempts specific routes from auth |
| `RolesGuard` | Guard | `@Roles('ADMIN')` — restricts to specific roles |
| `ThrottlerGuard` | Guard | Rate limiting per endpoint |

**Controller pattern:**
```typescript
@Controller('games')
@UseGuards(JwtAuthGuard)    // All routes require auth by default
export class GamesController {
  @Get()
  @Public()                 // This route is public
  async findAll() { ... }
  
  @Post()
  async create() { ... }    // This requires auth
}
```

---

## Database Design

### Schema Overview (17 models)

```
User ───┬─── Collection        ── Game
         ├─── Wishlist          ── Game
         ├─── Review            ── Game
         │     └── ReviewComment
         │     └── ReviewLike
         ├─── Follow (follower/following)
         ├─── ActivityLog
         ├─── Notification (recipient/sender)
         ├─── NotificationPreference
         ├─── Message (sent/received)
         ├─── Block (blocker/blocked)
         ├─── Report (reporter/reported)
         └─── TradeRequest (sender/receiver)

Game ───┬─── Platform
         └─── Genre
```

### Key Relationships

- **User ↔ Collection**: One user has many collection entries. Each entry has one game.
- **Unique constraint**: `[userId, gameId]` — prevents duplicate entries.
- **Cascade deletes**: When a user is deleted, their collections, reviews, messages, etc. are removed.
- **Polymorphic activity**: `ActivityLog` has `targetId` + `targetType` for flexible referencing.

### Indexes

- All foreign keys indexed for JOIN performance
- `userId + createdAt DESC` on activity logs for feed queries
- `recipientId + isRead + createdAt DESC` on notifications for the bell badge
- Full-text search index on Game title
- Trade status index for unread counting

### Prisma ORM Patterns

- **Soft deletes**: User model has `deletedAt` field for account deactivation instead of hard deletion
- **Field-level encryption**: Passwords hashed with bcryptjs (12 rounds), never stored in plaintext
- **Enums**: 7 Prisma enums for status/type fields (TradeStatus, UserRole, Condition, etc.)
- **Cascade vs Restrict**: User deletes cascade to related data; Game deletes are restricted when referenced

---

## API Design

### RESTful Conventions

- **Resource-based URLs**: `/collections`, `/trade/request`, `/users/:username`
- **HTTP methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status codes**: 200 (OK), 201 (Created), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict)
- **Pagination**: `GET /games?page=1&limit=20` with response metadata
- **Filtering**: `GET /collections?platform=nes&condition=MINT`
- **Sorting**: `GET /collections?sort=title_asc`

### Error Handling

- **Global exception filter**: Catches all unhandled exceptions and returns consistent JSON
- **Validation pipe**: `class-validator` DTOs reject invalid input before reaching controllers
- **Business logic errors**: Custom `NotFoundException`, `ConflictException`, `ForbiddenException`
- **Network errors**: Frontend `api-client.ts` catches `TypeError: Failed to fetch` and shows user-friendly messages
- **Graceful degradation**: Wikipedia API fallback when RAWG is unavailable

### Rate Limiting

- **ThrottlerGuard**: Global rate limiting configured via `@nestjs/throttler`
- Prevents brute-force attacks on auth endpoints
- Configurable per endpoint

### API Documentation

- **Swagger/OpenAPI**: Auto-generated via `@nestjs/swagger`
- Available at `GET /api-docs` (enabled in dev, disabled in production for faster startup)
- All endpoints documented with request/response schemas

---

## Authentication Flow

```
Client                    Server
  │                         │
  │  POST /auth/login       │
  │  { email, password }    │
  │────────────────────────▶│
  │                         │── bcrypt.compare(password, hash)
  │                         │── Generate JWT { sub: userId, email }
  │  { user, token }        │
  │◀────────────────────────│
  │                         │
  │  Store token in         │
  │  localStorage           │
  │                         │
  │  GET /auth/me           │
  │  Authorization: Bearer  │
  │────────────────────────▶│
  │                         │── Verify JWT signature
  │                         │── Extract userId from payload
  │  { user }               │
  │◀────────────────────────│
```

### JWT Token

- **Payload**: `{ sub: userId, email }`
- **Expiration**: 7 days (configurable via `JWT_EXPIRATION`)
- **Storage**: `localStorage` on the client
- **Transmission**: `Authorization: Bearer <token>` header
- **Validation**: Passport JWT strategy on every protected route

### Route Protection

- **Public routes** (Explore, GameDetails, Profiles, Home, Login, Register): No auth needed
- **User routes** (Dashboard, Collection, Messages, Trade, Settings): JWT required
- **Admin routes** (Admin panel): JWT + ADMIN role required

---

## Real-time Communication

### Socket.IO Setup

```
Frontend                    Socket.IO Server (NestJS)
  │                             │
  │  connect(/ws)               │
  │────────────────────────────▶│
  │  auth: { token }            │── Verify JWT
  │                             │── Join room: `user:${userId}`
  │                             │
  │  event: notification:new    │── New notification
  │◀────────────────────────────│
  │  event: notification:unread │── Unread count update
  │◀────────────────────────────│
  │  event: message:new         │── New chat message
  │◀────────────────────────────│
```

### Events

| Event | Direction | Payload | Trigger |
|-------|-----------|---------|---------|
| `notification:new` | Server → Client | Full notification object | New follower, review, wishlist |
| `notification:unread` | Server → Client | `{ count }` | Any notification change |
| `message:new` | Server → Client | Full message object | New chat message |

### Connection Lifecycle

1. **Connect**: Client calls `connectSocket(token)` in `socket.ts`
2. **Auth**: JWT is sent via `auth.token` in the handshake
3. **Room join**: Server adds the socket to `user:${userId}` room
4. **Listen**: Client registers event handlers
5. **Disconnect**: On logout, socket is disconnected

### WebSocket Proxy (Dev)

In development, the Vite dev server proxies `/ws` and `/socket.io` to the backend:

```typescript
// vite.config.ts
proxy: {
  '/ws': { target: 'http://localhost:3000', ws: true },
  '/socket.io': { target: 'http://localhost:3000', ws: true },
}
```

In production, the Socket.IO client connects directly to the Render backend via `VITE_API_URL`.

---

## State Management

### Where State Lives

| State Type | Location | Example |
|-----------|----------|---------|
| **Auth** | React Context (`AuthContext`) | Current user, token |
| **Form inputs** | Local `useState` | Login form, search bar |
| **Server data** | Local `useState` with fetch | Collection list, messages |
| **URL state** | React Router params | Game ID, search query |
| **Persisted** | `localStorage` | JWT token |
| **Real-time** | Socket.IO events | Notifications, messages |

### Why Not Redux/Zustand?

The app's state needs are well-served by React's built-in tools:
- **AuthContext** provides global auth state without prop drilling
- **Page-level state** via `useState` keeps data colocated with where it's used
- **No complex cross-page state** — each page fetches its own data
- **Simplicity** — avoids boilerplate for a medium-sized app

---

## Routing & Code Splitting

### Route Configuration (App.tsx)

```typescript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<AppLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/games/:id" element={<GameDetails />} />
    <Route path="/collection" element={<ProtectedRoute><Collection /></ProtectedRoute>} />
    {/* ... 20 more routes */}
  </Route>
</Routes>
```

### Lazy Loading

All pages except Home, Login, Register, and NotFound are lazy-loaded:

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Explore = lazy(() => import('./pages/Explore/Explore'));
```

This splits the bundle into separate chunks, loaded on-demand when the user navigates to each page.

### Protected Routes

```typescript
const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  if (state.loading) return <LoadingSpinner fullPage />;
  if (!state.user) return <Navigate to="/login" replace />;
  return children;
};
```

---

## Responsive Design System

### Breakpoints

| Name | Width | Target |
|------|-------|--------|
| Mobile | ≤480px | Small phones |
| Tablet | ≤768px | Large phones / tablets |
| Desktop | ≤1024px | Tablets landscape |
| Wide | ≥1280px | Desktop / wide screens |

### Mobile Adaptations

| Component | Desktop | Mobile |
|-----------|---------|--------|
| **Sidebar** | Fixed left (260px) | Slide-in overlay with hamburger |
| **TopBar** | Search + actions inline | Search full-width below profile |
| **Action buttons** | In topbar | Fixed bottom nav bar |
| **Chat widget** | Floating bottom-right | Above bottom nav |
| **Messages** | Sidebar + chat split | Full-width, toggle with back button |
| **Game grid** | 4 columns | 2 columns |
| **Profile hero** | Row layout | Column layout, centered |
| **Leaderboard podium** | 3-column podium | Stacked |
| **KPI cards** | 4 columns | 2 columns |

### SCSS Variables

```scss
// Theme
$s0:#020617;    // Darkest background
$s1:#060914;    // Surface 1 (sidebar, topbar)
$s2:#0d1228;    // Surface 2 (cards, panels)
$s3:#151d3d;    // Surface 3 (inputs, hover)

// Accent
$a1:#7c3aed;    // Primary purple
$a2:#a78bfa;    // Light purple
$a3:#22d3ee;    // Cyan accent

// Text
$t1:#f0f4ff;    // Primary text
$t2:#c8cdd3;    // Secondary text
$t3:#5a6480;    // Muted text
$t4:#3b4560;    // Dim text

// Spacing
$sp1:.25rem; $sp2:.5rem; $sp3:.75rem;
$sp4:1rem; $sp5:1.5rem; $sp6:2rem;

// Z-index layers
$z0:100; $z1:200; $z2:250; $z3:300; $z4:400;

// Breakpoints (in mixins)
$sw:260px;     // Sidebar width
$th:95px;      // Topbar height
$mw:1440px;    // Max content width
```

---

## File Upload System

### Architecture

```
Client (browser)         Backend (NestJS)         Storage
      │                      │                      │
      │  POST /upload/avatar │                      │
      │  FormData { file }   │                      │
      │─────────────────────▶│                      │
      │                      │── FileInterceptor    │
      │                      │  (memoryStorage)     │
      │                      │                      │
      │                      │── UploadService      │
      │                      │  ├── R2 configured?  │
      │                      │  │  ├── Yes → S3/R2  │
      │                      │  │  └── No  → Local  │
      │                      │                      │
      │  { url }             │                      │
      │◀─────────────────────│                      │
```

### UploadService

The `UploadService` supports two storage backends:

1. **Cloudflare R2 (S3-compatible)** — persistent, survives deploys
2. **Local disk** — fallback for development, resets on Render deploys

```typescript
async upload(file: Express.Multer.File): Promise<string> {
  if (this.s3) {
    // Upload to R2
    const key = `uploads/${Date.now()}-${random()}.jpg`;
    await this.s3.send(new PutObjectCommand({ Bucket, Key: key, Body: file.buffer }));
    return `${this.publicUrl}/${key}`;
  }
  // Fallback: save to local disk
  writeFileSync(join(uploadDir, filename), file.buffer);
  return `/uploads/${filename}`;
}
```

### Upload Endpoints

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /upload/avatar` | ✅ | Upload user avatar |
| `POST /upload/cover/:gameId` | ✅ | Upload game cover |
| `POST /upload/collection-cover/:colId` | ✅ | Upload collection entry cover |

---

## Testing Strategy

### Backend Testing (Jest)

| Test Type | Count | What it covers |
|-----------|-------|----------------|
| Unit tests | 12 tests / 3 suites | Auth service (login, register, validation) |

The backend uses **Jest** with a test database (PostgreSQL). Tests are located in `*.spec.ts` files co-located with source files. The CI runs tests against a fresh PostgreSQL instance with `prisma migrate deploy` before test execution.

### Frontend Testing (Vitest)

| Test Type | Count | What it covers |
|-----------|-------|----------------|
| Component tests | 11 tests / 3 files | Button component, ErrorBoundary, Auth flow |

The frontend uses **Vitest** with `jsdom` environment for DOM simulation. Tests are in `src/__tests__/`. The CI runs tests with `vitest run` before the production build.

### What's Not Tested

- **Integration tests**: No end-to-end API tests (would require a running backend)
- **E2E tests**: No browser automation (Cypress/Playwright)
- **Snapshot tests**: Not used (preference for behavior-based assertions)

---

## CI/CD Pipeline

### GitHub Actions Workflow

On every push to `main`, the CI pipeline runs two jobs in parallel:

**Backend job:**
1. `npm install` — install all workspace dependencies
2. `ESLint` — static analysis (warnings don't fail build)
3. `prisma generate` — compile Prisma client
4. `prisma migrate deploy` — apply pending migrations to test DB
5. `npm test` — run Jest unit tests
6. `npm run build` — compile NestJS production build

**Frontend job:**
1. `npm install` — install all workspace dependencies
2. Install native bindings (`@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`) for Linux CI
3. `npx vitest run` — run Vitest component tests
4. `npx vite build` — production build with code splitting

### Deployment (CD)

After CI passes:
- **Vercel** auto-deploys the frontend from `main` branch (build: `vite build`)
- **Render** auto-deploys the backend from `main` branch (build: `nest build`, start: `node dist/src/main.js`)

### CI Challenges Solved

| Challenge | Solution |
|-----------|----------|
| npm workspaces + native bindings | `npm install` (not `npm ci`) to resolve platform-specific optional deps |
| `@rolldown/binding-linux-x64-gnu` | Explicit `npm install --no-save` for Linux bindings in CI |
| `lightningcss-linux-x64-gnu` | Same approach — explicit install of Linux CSS minifier binary |
| Lockfile sync across platforms | `npm install` at root to regenerate lockfile with all optional deps |

---

## Deployment Strategy

### Infrastructure (All Free)

```
                         ┌──────────────────┐
                         │   Vercel (CDN)    │
                         │  Frontend (SPA)   │
                         │  retro-collection │
                         │  -tracker.vercel  │
                         │  .app             │
                         └────────┬─────────┘
                                  │
                    /uploads/* proxy (via vercel.json)
                                  │
                         ┌────────▼─────────┐
                         │   Render (Free)   │
                         │  Backend (NestJS) │
                         │  retro-collection │
                         │  -tracker.onrender│
                         │  .com             │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Neon (Free)      │
                         │  PostgreSQL       │
                         │  Cloud database   │
                         └──────────────────┘
                         
                         ┌──────────────────┐
                         │  cron-job.org     │
                         │  Pings / every    │
                         │  15 min (warm-up) │
                         └──────────────────┘
```

### Database Migration

1. **Local dump**: `bash scripts/deploy-db.sh` → pg_dump to file
2. **Neon restore**: `pg_restore` with the dump
3. **Schema**: Pre-migrated, `prisma migrate deploy` only for new migrations

### Warm-up Strategy

Render's free tier spins down after 15 minutes of inactivity. A free cron-job.org job hits `https://backend.onrender.com/` every 15 minutes to keep it awake.

---

## Data Flow Examples

### Adding a Game to Collection

```
1. User searches game on Explore page
2. Frontend calls GET /games/external-search?q=Mario
3. Backend proxies to RAWG API → returns results
4. User clicks "Import" → POST /games/import { source: "rawg", sourceId }
5. Backend fetches full game data from RAWG
6. Backend creates Game record in PostgreSQL
7. Frontend navigates to AddGame page with imported game
8. User fills form → POST /collections { gameId, condition, region, ... }
9. Backend creates Collection entry, awards +10 XP
10. Frontend redirects to Collection page with new entry visible
```

### Trade Request Flow

```
1. User visits another collector's profile
2. Clicks "Trade" button → navigates to Trade page with receiverId
3. User fills trade form → POST /trade/request { receiverId, offeredGameId, message }
4. Backend creates TradeRequest with PENDING status
5. Notification sent via WebSocket to receiver
6. Receiver sees notification badge → opens Trade page
7. Receiver clicks "Accept" → POST /trade/:id/accept
8. Both parties submit shipping details → POST /trade/:id/shipping
9. Once both submitted, addresses are revealed to both sides
10. Sender ships → POST /trade/:id/ship  { trackingNumber }
11. QR code auto-generates
12. Receiver confirms → POST /trade/:id/received
13. Trade marked COMPLETED
```

### Real-time Chat Flow

```
1. User A opens Messages page → GET /messages/conversations
2. User A clicks User B's conversation → GET /messages/conversations/:userIdB
3. WebSocket connection established with JWT auth
4. User A types message → POST /messages { receiverId: userIdB, content }
5. Backend saves message to DB
6. Backend emits message:new event via Socket.IO
7. User B (if online) receives event → message appears in real-time
8. Both users' notification badges update via notification:unread event
```

---

## Security Considerations

### Authentication & Authorization
- **JWT tokens**: 7-day expiration, signed with configurable secret
- **Password hashing**: bcryptjs with 12 salt rounds
- **Role-based access**: `USER`, `MODERATOR`, `ADMIN` roles via `RolesGuard`
- **Route protection**: JWT required globally by default, `@Public()` decorator for opt-out

### API Security
- **Input validation**: `class-validator` DTOs whitelist known fields, reject unknown
- **Rate limiting**: `ThrottlerGuard` prevents brute-force attacks
- **CORS**: Whitelist-based origin configuration via `CORS_ORIGIN` env var
- **Helmet**: Security headers (X-Content-Type-Options, X-Frame-Options, etc.) via `helmet` middleware
- **Body size limits**: 1MB max request body via `express.json({ limit: '1mb' })`
- **File upload restrictions**: Only jpg, png, webp, gif — max 5MB

### Data Protection
- **SQL injection**: Prevented by Prisma's parameterized queries
- **XSS**: Mitigated by React's automatic HTML escaping and CSP headers from Helmet
- **No secrets in code**: All credentials via environment variables (`.env` is gitignored)
- **Session management**: Token stored in `localStorage` (trade-off: XSS vulnerability mitigated by CSP)

---

## Design Decisions

### Why NestJS over Express?

- **Modular architecture**: Built-in module system scales well
- **Decorators**: Clean routing with `@Controller()`, `@Get()`, `@Post()`
- **DI container**: Dependency injection makes services testable
- **Guard system**: Built-in auth guards with `@UseGuards()`
- **Validation**: `class-validator` with DTOs
- **WebSocket**: Native Socket.IO integration via `@WebSocketGateway()`

### Why Prisma over TypeORM?

- **Type-safe queries**: Generated types prevent runtime errors
- **Migrations**: Declarative schema changes
- **Studio**: Built-in GUI for data inspection
- **Intellisense**: Auto-completion for all database operations
- **Simplicity**: Fewer concepts than TypeORM (no repositories, no active record)

### Why Socket.IO over raw WebSocket?

- **Auto-reconnection**: Built-in reconnection with exponential backoff
- **Rooms**: Easy broadcasting to specific users
- **Fallback**: HTTP long-polling when WebSocket connection fails
- **Authentication**: Middleware for JWT handshake validation
- **Event system**: Named events with payloads

### Why localStorage over cookies for JWT?

- **Simplicity**: No CSRF protection needed
- **SPA-friendly**: Read/write from JavaScript without HTTP-only restrictions
- **Client-side routing**: Token available in React without server coordination
- **Trade-off**: Vulnerable to XSS, but mitigated by input sanitization and CSP headers

### Why Context API over Redux?

- **Appropriate scale**: App has global auth state, rest is page-local
- **Less boilerplate**: No actions, reducers, or dispatch for simple state
- **Built-in**: No additional dependencies
- **Co-located state**: Page-specific data stays in page components

### Why Vercel + Render + Neon?

- **Cost**: All three offer generous free tiers
- **Specialization**: Each platform excels at its role (CDN, Node hosting, database)
- **WebSocket support**: Render supports persistent WebSocket connections
- **Auto-deploy**: GitHub integration for CI/CD
- **No lock-in**: Standard PostgreSQL and React stack is portable

---

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">
  <sub>Last updated: May 2026</sub>
</p>
