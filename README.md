# Skitouren-Website

A full-stack web application for publishing and managing ski touring routes. Features a public-facing tour catalogue with filtering, GPX downloads, a photo gallery, and a news section — backed by a password-protected admin area.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v6, TanStack Query |
| Backend | Spring Boot 3.3.5 (Java 21), Spring Security, Spring Data JPA |
| Database | PostgreSQL 16, Flyway migrations |
| Auth | JWT (JJWT 0.12) |
| Storage | Local filesystem (Docker volume) |
| Serving | Nginx (SPA + API reverse proxy) |
| Runtime | Docker Compose |

## Features

**Public**
- Tour listing with filtering by region, difficulty, and tour type
- Tour detail pages with elevation profile data, photo gallery, and GPX download
- Statistics page
- News / blog posts

**Admin** (JWT-protected)
- Create, edit, and publish tours and news posts
- Photo upload with automatic resizing (imgscalr)
- GPX file upload

## Project structure

```
skitouren-website/
├── backend/          # Spring Boot application
│   └── src/main/
│       ├── java/ch/skitouren/
│       └── resources/db/migration/   # Flyway SQL migrations
├── frontend/         # Vite + React SPA
│   └── src/
│       ├── api/      # Typed API clients
│       ├── components/
│       ├── hooks/
│       └── pages/
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Development overrides
└── .env.example
```

## Getting started

### Prerequisites

- Docker and Docker Compose

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values (see comments in the file):

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | PostgreSQL password |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | BCrypt hash (cost 12) of the admin password — **must be in single quotes** |
| `JWT_SECRET` | 64-character hex string for signing JWTs |

**Generate a BCrypt hash:**
```bash
docker run --rm node:22-alpine node -e \
  "require('bcryptjs').hash('yourPassword',12).then(h=>console.log(\"'\"+h+\"'\"))"
```

**Generate a JWT secret:**
```bash
openssl rand -hex 32
```

### 2. Run in production mode

```bash
docker compose up -d --build
```

The app is available at `http://localhost`.

### 3. Run in development mode

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

| Service | URL |
|---------|-----|
| Frontend (Vite HMR) | http://localhost:5173 |
| Backend (Spring Boot) | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Source files are mounted as volumes, so changes to `frontend/src/` and `backend/src/` are picked up without rebuilding the image.

## Database migrations

Flyway runs automatically on startup. Migration scripts live in `backend/src/main/resources/db/migration/` and follow the `V{n}__{description}.sql` naming convention.

## Admin access

Navigate to `/anmelden` (or `/admin/login`) and sign in with the credentials configured in `.env`. The admin area is at `/admin`.
