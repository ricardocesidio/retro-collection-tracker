# Retro Collection Tracker

A full-stack web application for retro gaming collectors to organize, track, and showcase their personal game collections.

## Tech Stack

**Frontend:** Angular, TypeScript, SCSS, RxJS  
**Backend:** NestJS, TypeScript, Prisma  
**Database:** PostgreSQL

## Project Structure

```
retro-collection-tracker/
├── frontend/          # Angular application
│   └── src/
│       ├── app/
│       │   ├── core/          # Singleton services, guards, interceptors
│       │   ├── shared/        # Shared components, directives, pipes
│       │   ├── features/      # Feature modules (collection, wishlist, etc.)
│       │   └── models/        # TypeScript interfaces
│       ├── environments/      # Environment configuration
│       └── styles/            # Global SCSS styles
├── backend/           # NestJS API server
│   └── src/
│       ├── common/            # Shared guards, decorators, filters
│       ├── config/            # Configuration module
│       ├── auth/              # Authentication module
│       ├── users/             # User management
│       ├── games/             # Game catalog
│       ├── collections/       # Collection management
│       ├── wishlist/          # Wishlist system
│       ├── reviews/           # Reviews and ratings
│       ├── social/            # Follow system
│       └── prisma/            # Database service
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14

### Setup

1. **Clone and install dependencies:**

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

2. **Configure environment:**

```bash
# backend/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/retro_collection_tracker?schema=public"
JWT_SECRET="your-secure-random-string"
```

3. **Set up the database:**

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

4. **Start development servers:**

```bash
# Backend (port 3000)
cd backend
npm run start:dev

# Frontend (port 4200)
cd frontend
npm start
```

## Features

- User authentication (JWT)
- Personal collection management
- Searchable retro game catalog
- Wishlist system
- Reviews and ratings
- Collector profiles
- Social follow system
- Dashboard analytics
- Responsive design

## License

MIT
