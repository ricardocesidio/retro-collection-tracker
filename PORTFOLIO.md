# Retro Collection Tracker — Portfolio Materials

## Project Type
Full-stack web application — retro game collection management platform

## Role
Solo developer — full-stack architecture, design, implementation

---

## LinkedIn Summary

> Architected and built a full-stack retro game collection platform from the ground up. Features include RAWG API integration (800K+ games), real-time WebSocket chat, a complete trade system with QR code shipping workflow, gamified XP progression, community reviews with comments/likes, and a premium dark-theme dashboard with interactive charts. Backend: NestJS + Prisma + PostgreSQL. Frontend: React 19 + TypeScript + SCSS. Real-time: Socket.IO. 25 pages, 17 database models, 14 migrations, 12 tests passing.

---

## Key Technical Highlights

| Achievement | Details |
|-------------|---------|
| **Full-stack from scratch** | NestJS backend + React 19 frontend + PostgreSQL database |
| **RAWG API integration** | Real-time search across 800K+ games with import, covers, ratings |
| **Real-time WebSocket** | Chat widget, notifications, all live via Socket.IO |
| **Trade system** | Two-party address exchange, QR tracking codes, DPD/UPS/FedEx |
| **XP progression** | 4 collector levels, 5 action types, real XP tracking |
| **Community features** | Reviews, comments, likes, follows, activity feeds |
| **Premium UI** | Dark theme, responsive, 25 pages, consistent design system |
| **25 pages** | Dashboard, Explore, Collection, Messages, Trade, Admin, etc. |
| **17 database models** | User, Game, Collection, Trade, Message, Review, etc. |
| **Backend tests** | 12 tests, 3 suites — all passing |

---

## Architecture Overview

```
React 19 SPA (Vite) ──proxy──▶ NestJS API ──Prisma──▶ PostgreSQL
                                    │
                              Socket.IO (WebSocket)
                                    │
                              RAWG API (external)
```

---

## Skills Demonstrated

- **Backend**: NestJS, TypeScript, REST APIs, Prisma ORM, PostgreSQL, JWT auth, WebSocket, rate limiting, file upload
- **Frontend**: React 19, TypeScript, SCSS, Vite, React Router, lazy loading, real-time updates, responsive design
- **Architecture**: Modular monolith, clean architecture, DTO validation, guard-based auth, service layer
- **DevOps**: Git, migrations, seeding, environment config, CORS, deployment-ready
- **External APIs**: RAWG video games database (800K+ games), Wikipedia fallback, QR code generation

---

## Live Demo

Demo accounts available with pre-seeded data:
- `retro_alice` / `password123` — full collection, trades, reviews
- `bob_collector` / `password123` — Genesis collector
- `retro_charlie` / `password123` — JRPG enthusiast

---

## GitHub

[github.com/ricardocesidio/retro-collection-tracker](https://github.com/ricardocesidio/retro-collection-tracker)
