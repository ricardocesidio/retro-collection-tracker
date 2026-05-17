# Retro Collection Tracker

A premium retro game collection tracker with dark theme UI, social features, and game catalog management.

## ✅ Completed Features

### P0 Security & Core Functionality
- **Login security**: Increased minimum password length from 1 to 8 characters (`@MinLength(1)` → `@MinLength(8)` in `login.dto.ts`)
- **Password reset security**: Forgot password endpoint no longer returns reset token in response
- **Email verification**: Added `isEmailVerified` + `emailVerificationToken` to User model, with `POST /auth/verify-email` and `POST /auth/resend-verification` endpoints (token logged to console in dev)
- **Change password flow**: New `POST /auth/change-password` endpoint with `ChangePasswordDto`, Settings page now calls real API
- **Notification persistence**: `NotificationPreference` model (migrated), backend module/controller/service, Settings page loads/saves via API
- **Stats memory optimization**: `getValueHistory()` now queries only last 6 months via `createdAt: { gte: sixMonthsAgo }`
- **AbortController race conditions**: Fixed in AddGame.tsx (mountedRef pattern) and Profile.tsx (cancellation booleans)

### P1 UX & Performance
- **Code splitting**: 16 of 20 pages lazy-loaded via `React.lazy()` (Home/Login/Register/NotFound stay eager), Suspense fallback with LoadingSpinner
- **Wishlist update endpoint**: New `PUT /wishlist/:id` with `UpdateWishlistDto`, `wishlistApi.update()` in frontend
- **Home.tsx fix**: `i class` → `i className`
- **AddGame two-step rollback**: Tracks `importedGameId`, deletes imported game via `gamesApi.delete()` if collection create fails or user cancels

### P2 Social & Discovery
- **Sidebar progress**: Dynamic collection stats from API (percentage toward 50-game goal) instead of hardcoded
- **TopBar autocomplete**: Debounced (200ms) search dropdown showing top 6 matching games with cover, platform, year; click navigates to game
- **Donate page dynamic values**: New `GET /stats/donate` endpoint returning `{ raised, goal, supporters }` from env vars (fallback $247/$500/34)
- **Infinite scroll**: IntersectionObserver replaces "Load More" in AddGame catalog

### P3 Polish & Accessibility
- **Cross-browser scrollbar**: `@mixin scr` updated with `scrollbar-gutter: stable`, `::-moz-scrollbar` support

### Additional Completed Tasks
- **Game cover image upload**: 
  - Backend: `POST /upload/cover/:gameId` endpoint in UploadController
  - Frontend: Upload UI in EditGame page with preview and upload functionality
  - Updated `api-client.ts` with `uploadFile()` helper for multipart/form-data
  - Added upload API functions to collections service
- **Collection export (CSV/JSON)**:
  - Backend: `GET /collections/export?format=csv|json` endpoint with proper headers and formatting
  - Frontend: Export buttons in Collection page header, `exportCollection()` function in service
- **WebSocket real-time notifications**:
  - Backend: `NotificationGateway` with JWT auth, emits to user-specific rooms
  - Frontend: Socket service, NotificationBell and Notifications pages now use real-time updates instead of polling
- **Admin dashboard**:
  - Backend: `AdminModule` with controller/service for user and game management
  - Frontend: Admin page with tabs for Users and Games, search, pagination, role toggling, active/inactive status
  - Admin link in Sidebar (only visible to admin users)
- **Swagger/OpenAPI docs**:
  - Backend: Full API documentation at `/api-docs` with JWT auth support
  - All major controllers decorated with `@ApiTags` and `@ApiBearerAuth`
- **Code quality improvements**:
  - Dead code cleanup: Removed unused `types/index.ts` imports, verified no `useCancellableFetch` hook exists
  - Duplicate consolidation: Extracted `getCollectorLevel()` to `common/utils/collector-level.ts`
  - UI consistency: Moved 404 page styles to SCSS file, deduplicated `.game-card`, `.page-header`, and `@keyframes` styles
  - Form accessibility: Added `name` prop to Input component for proper form handling

### Infrastructure & Dev Experience
- **RAWG API key**: Set in `backend/.env` for external game data
- **CORS fix**: Vite proxy configuration in `vite.config.ts` for all API paths, `API_URL` set to relative paths
- **Environment cleanup**: `VITE_API_URL` cleared in frontend `.env`
- **README updated**: Comprehensive documentation of completed features, API endpoints, database schema changes

## 🏗️ Architecture

### Backend (NestJS)
- **Modular structure**: Separate modules for auth, users, games, collections, wishlist, reviews, social, upload, notification-preferences, admin, stats
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with HttpOnly cookies
- **File upload**: Multer with disk storage (5MB limit, image types only)
- **Validation**: Class-validator and class-transformer
- **Caching**: Redis-backed cache middleware
- **Rate limiting**: NestJS Throttler
- **Security**: Helmet, bcryptjs for password hashing

### Frontend (React + Vite)
- **Build tool**: Vite with React plugin
- **UI library**: Custom components with SCSS modules
- **Icons**: Font Awesome 7.2.0
- **State management**: React Context (Auth), React Query/TanStack equivalent patterns
- **Routing**: React Router v6 with lazy loading and Suspense
- **Styling**: SCSS with 7-1 architecture (base, layout, components, pages, themes, utils, vendors)
- **API layer**: Centralized `api-client.ts` with interceptors for auth and error handling
- **TypeScript**: Strict mode with shared types

### Key Environment Variables
#### Backend (`.env`)
```
PORT=3000
JWT_SECRET=your-secret-key
RAWG_API_KEY=805cd8ace47e45b4bebf8fffe343560d
DATABASE_URL="postgresql://user:password@localhost:5432/retro_collection"
```

#### Frontend (`.env`)
```
VITE_API_URL=  // Empty - requests go through Vite proxy to backend
```

## 📖 API Documentation

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile
- `PUT /auth/me` - Update profile
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/change-password` - Change password (requires current password)
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/resend-verification` - Resend verification email

### Users
- `GET /users/:username` - Get public user profile
- `GET /admin/users` - Admin: List users (paginated, searchable)
- `PUT /admin/users/:id/role` - Admin: Update user role
- `PUT /admin/users/:id/toggle-active` - Admin: Toggle user active status

### Games
- `GET /games` - List games (paginated, filterable)
- `GET /games/:id` - Get game by ID
- `GET /games/platforms` - Get all platforms
- `GET /games/genres` - Get all genres
- `GET /games/external-search?q=...&page=...` - Search RAWG database
- `POST /games/import` - Import game from external source (RAWG)
- `POST /games` - Admin/Moderator: Create new game
- `PUT /games/:id` - Admin/Moderator: Update game
- `DELETE /games/:id` - Admin/Moderator: Delete game

### Collections
- `GET /collections` - Get user's collection (paginated, filterable)
- `GET /collections/stats` - Get collection statistics
- `GET /collections/value-history` - Get collection value over time
- `GET /collections/user/:userId` - Get public user's collection
- `GET /collections/:id` - Get specific collection entry
- `POST /collections` - Add game to collection
- `PUT /collections/:id` - Update collection entry
- `DELETE /collections/:id` - Remove game from collection
- `GET /collections/export?format=csv|json` - Export collection as CSV or JSON

### Wishlist
- `GET /wishlist` - Get user's wishlist (paginated)
- `POST /wishlist` - Add game to wishlist
- `PUT /wishlist/:id` - Update wishlist entry (priority, notes)
- `DELETE /wishlist/:id` - Remove game from wishlist

### Reviews
- `GET /reviews/game/:gameId` - Get reviews for a game
- `GET /reviews/user/:userId` - Get reviews by a user
- `POST /reviews` - Create a review
- `PUT /reviews/:id` - Update a review
- `DELETE /reviews/:id` - Delete a review

### Social
- `POST /follow/:userId` - Follow a user
- `DELETE /follow/:userId` - Unfollow a user
- `GET /follow/:userId/status` - Check follow status
- `GET /users/:userId/followers` - Get user's followers
- `GET /users/:userId/following` - Get user's following
- `GET /activity` - Get user's activity feed

### Notifications
- `GET /notifications` - Get user's notifications (paginated)
- `GET /notifications/unread-count` - Get unread notification count
- `POST /notifications/:id/read` - Mark notification as read
- `POST /notifications/read-all` - Mark all notifications as read

### Notification Preferences
- `GET /notification-preferences` - Get user's notification preferences
- `PUT /notification-preferences` - Update notification preferences

### Stats
- `GET /stats/public` - Get public platform statistics
- `GET /stats/donate` - Get donation progress stats

### Upload
- `POST /upload/avatar` - Upload user avatar
- `POST /upload/cover/:gameId` - Upload cover image for a game
- `POST /upload/collection-cover/:colId` - Upload cover image for a collection entry

### Admin
- `GET /admin/users` - List all users (admin only)
- `PUT /admin/users/:id/role` - Update user role (admin only)
- `PUT /admin/users/:id/toggle-active` - Toggle user active status (admin only)
- `GET /admin/games` - List all games (admin only)

## 🗄️ Database Schema

### Models
- **User**: id, email, username, displayName, password, bio, avatarUrl, role, isActive, isEmailVerified, emailVerificationToken, timestamps
- **Game**: id, title, platformId, genreId, releaseYear, developer, publisher, description, coverImageUrl, timestamps, relations
- **Collection**: id, userId, gameId, condition, region, notes, personalRating, estimatedValue, ownershipStatus, coverImage, acquiredAt, timestamps
- **Wishlist**: id, userId, gameId, priority, notes, timestamps
- **Review**: id, userId, gameId, rating, title, body, timestamps
- **Follow**: id, followerId, followingId, timestamps
- **Notification**: id, recipientId, senderId, type, title, body, isRead, link, metadata, timestamps
- **NotificationPreference**: id, userId, email, push, follows, reviews, wishlist, timestamps
- **ActivityLog**: id, userId, type, metadata, timestamps

### Enums
- **Condition**: MINT, NEAR_MINT, VERY_GOOD, GOOD, ACCEPTABLE, POOR
- **Region**: NTSC, PAL, NTSC_J, REGION_FREE
- **OwnershipStatus**: OWNED, FOR_TRADE, WANTED
- **NotificationType**: NEW_FOLLOWER, NEW_REVIEW, WISHLIST_AVAILABLE, COLLECTION_UPDATE, SYSTEM
- **UserRole**: USER, ADMIN, MODERATOR

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Installation
1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Configure database connection in backend `.env`
   - Set RAWG API key in backend `.env` (get from https://rawg.io/apidoc)
5. Initialize database: `cd backend && npx prisma migrate dev`
6. Seed database: `cd backend && npx prisma db seed`
7. Start development servers:
   - Backend: `npm run start:dev` (runs on http://localhost:3000)
   - Frontend: `npm run dev` (runs on http://localhost:5173)

### Production Build
- Backend: `npm run build` then `npm run start:prod`
- Frontend: `npm run build` then serve the `dist` directory

## 🔧 Development Notes

### Backend
- REST API built with NestJS
- Prisma ORM for database operations
- JWT authentication with refresh token rotation
- Modular architecture with clear separation of concerns
- Comprehensive validation and error handling
- Rate limiting and security headers

### Frontend
- React 19 with hooks
- Vite for fast development builds
- SCSS modules for component-scoped styling
- Lazy loading for route-based code splitting
- Custom hook patterns for data fetching and state management
- Accessibility-focused component design

## 📱 Responsive Design
- Mobile-first approach with breakpoints at 640px, 768px, 1024px, and 1280px
- Flexible grid layouts that adapt to screen size
- Touch-friendly controls and navigation
- Optimized image loading and caching

## 🧪 Testing
- Backend: Jest for unit and integration tests
- Frontend: Vitest for unit tests, React Testing Library for component tests
- End-to-end testing: Cypress (planned)

## 📚 License
MIT License

## 🙏 Acknowledgements
- RAWG API for game data
- NestJS team for the excellent backend framework
- React team for the frontend library
- Open-source contributors worldwide

---
*Last updated: $(date)*