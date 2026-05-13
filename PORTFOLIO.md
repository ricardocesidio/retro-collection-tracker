# Portfolio Materials — Retro Collection Tracker

---

## LinkedIn Summary

**Headline-friendly version (for experience section):**

> Built **Retro Collection Tracker**, a full-stack React + NestJS web application for retro gaming collectors to catalog, rate, follow, and analyze their personal game libraries. Architected a normalized PostgreSQL database with 10 tables and 30+ REST endpoints. Implemented JWT authentication, social features (follows, reviews, notifications), and a real-time analytics dashboard. Built with TypeScript end-to-end, featuring lazy-loaded pages, responsive dark-themed UI, and production-ready error handling.

**Long-form post version:**

> I built **Retro Collection Tracker** — a full-stack platform for retro gaming collectors.
>
> **Stack:** React 19 + TypeScript (frontend) · NestJS (backend) · PostgreSQL + Prisma (database)
>
> **What it does:** Users create accounts, build their retro game collection with detailed metadata, browse a searchable public catalog, write reviews, follow other collectors, and track analytics on a dashboard.
>
> **Technical highlights:**
> - 14 lazy-loaded React pages with a custom dark-themed component library (8 reusable components)
> - 30+ REST API endpoints with JWT auth, class-validator DTOs, and Passport strategies
> - Normalized relational schema (10 tables, 6 enums) with cascade deletes and composite unique constraints
> - Real-time notification system auto-triggered on follows, reviews, and wishlist events
> - Aggregated analytics: platform distribution, condition breakdown, collection valuation
> - TypeScript across the entire stack — zero `any` types in critical paths
>
> **Why it matters:** This isn't a tutorial CRUD app. It's a real product with auth, social features, analytics, and a production-grade architecture. It demonstrates the kind of full-stack thinking that goes into building real software.
>
> Repo: github.com/ricardocesidio/retro-collection-tracker

---

## Portfolio Website Summary

**For a personal portfolio / project card:**

### Retro Collection Tracker
*Full-Stack Web Application*

A collector platform for retro gaming enthusiasts. Users build their personal game libraries, browse a searchable catalog, write reviews, follow other collectors, and track analytics.

**Role:** Solo developer — full-stack architecture, design, and implementation

**Tech:** React · TypeScript · NestJS · PostgreSQL · Prisma · JWT · SCSS

**Highlights:**
- 14-page SPA with lazy loading and responsive dark UI
- 30+ REST endpoints with validated DTOs and role-based guards
- Normalized 10-table schema with cascading relations
- Real-time notification pipeline triggered by social events
- Analytics dashboard with aggregated collection stats

[View on GitHub →](https://github.com/ricardocesidio/retro-collection-tracker)

---

## Interview Talking Points

**If asked "Tell me about a project you're proud of":**

> I built Retro Collection Tracker, a full-stack platform for retro game collectors. It's a React frontend with a NestJS backend and PostgreSQL database.
>
> The project has 14 pages — everything from authentication to a public catalog, personal collection management, social features like follows and reviews, and a real analytics dashboard.
>
> What I'm most proud of is the architecture. The database has 10 normalized tables with proper foreign keys and cascading deletes. The API has 30+ endpoints with DTO validation and JWT guards. The frontend uses lazy loading so the initial bundle is under 300 kB.
>
> I built it to simulate a real production environment — not just a simple CRUD demo. There's a notification system that auto-generates alerts when someone follows you or reviews a game, and the dashboard aggregates stats from multiple tables in real time.

**If asked about technical decisions:**

> I chose React with Vite because it's fast and modern. NestJS on the backend because its module system makes the codebase scalable — each feature (auth, games, collections, social) is its own module with clear boundaries.
>
> For the database, I normalized platform and genre into separate tables rather than using string columns. This makes filtering and analytics much cleaner, and it prevents data inconsistency.
>
> I used JWT for auth because it's stateless and works well with a SPA. The token is stored in localStorage and validated on every API request through a Passport strategy.

**If asked about challenges:**

> The biggest challenge was keeping the architecture clean while adding features. When I added notifications, I had to wire them into three different services (follows, reviews, wishlists) without creating circular dependencies. I solved this by making the NotificationsService a standalone provider that gets injected into other modules.
>
> Another challenge was the SCSS build setup. Vite handles CSS differently than Angular, so I had to configure `additionalData` to auto-inject design tokens into every SCSS file, avoiding manual imports across 30+ component files.

**If asked "What would you improve?":**

> I'd add end-to-end tests with Playwright, set up a CI/CD pipeline with GitHub Actions, add image upload for game covers, and implement real-time WebSocket notifications instead of polling. The architecture supports all of these — they're just the next logical steps.

---

## Quick Stats (for resume bullet points)

- **2,800+** lines of TypeScript across frontend and backend
- **30+** REST API endpoints
- **10** normalized PostgreSQL tables with **6** enums
- **14** lazy-loaded React pages
- **8** reusable UI components with dark theme design system
- **0** production dependencies on frontend beyond React and React Router
- **95+** files in the repository
