#  Yomi — Reading Tracker

> Track what you're reading across manga, manhwa, manhua and light novels — with graceful fallback when your data source goes down.

Yomi is a full-stack reading tracker built as a training project (RNCP 6). It emphasizes real-world engineering concerns: resilience against flaky external APIs, defense-in-depth security, and a clean architectural boundary between concerns.

<!-- TODO: screenshots / GIF here -->
<!-- ![Home page](docs/screenshots/home.png) -->

---

##  Features

**Discovery & Library**
- Browse trending works and search across two data sources
- **Resilient fallback**: primary source is Jikan (MyAnimeList scraper), automatic fallback to MangaDex (official API) when Jikan is down
- Import works to your personal library, track current volume and chapter, remove items

**Authentication & Security**
- Register / login with JWT (HS256, 1h default, 30d with "remember me")
- Bean-validated inputs (`@NotBlank`, `@Email`, `@Size(min=8)`)
- BCrypt password hashing
- Change password endpoint with fresh JWT regeneration
- IDOR protection on progress mutations (`ProgressService.update`, `delete`)
- Graceful HTTP status semantics: `401` (bad credentials), `403` (forbidden), `503` (external API down), `500` (only for actual server bugs)

**UX**
- Responsive design (mobile drawer + bottom nav, desktop sidebar)
- Custom design tokens (magenta accent), dark theme
- Warning banner when the manga data source is degraded

---

##  Architecture

```
┌──────────────┐   HTTP + JWT   ┌───────────────────┐
│  React 19    │◄──────────────►│  Spring Boot 4    │
│  Vite + TS   │                │  Java 25          │
└──────────────┘                └────────┬──────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
              ┌──────────┐         ┌──────────┐        ┌──────────────┐
              │ MySQL 8  │         │  Jikan   │        │  MangaDex    │
              │ (Docker) │         │ (scraper │        │  (official   │
              └──────────┘         │   MAL)   │        │    API)      │
                                   └──────────┘        └──────────────┘
                                        └────── fallback ────────┘
```

**Backend layers**
- Controllers → Services → Repositories (JPA) → MySQL
- External clients (`JikanClient`, `MangaDexClient`) wrapped with `try/catch → ExternalApiUnavailableException`
- `WorkSearchService` orchestrates the fallback pattern
- `GlobalExceptionHandler` maps domain exceptions to HTTP status codes

---

##  Tech Stack

**Backend** — Spring Boot 4, Java 25, JPA/Hibernate, Spring Security, jjwt 0.11.5, Lombok, Bean Validation
**Frontend** — React 19, TypeScript, Vite, Tailwind 4, React Router
**Database** — MySQL 8
**Infra** — Docker Compose (mysql + phpmyadmin + springboot)
**Testing** — JUnit 5, Mockito, AssertJ

---

##  Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 20+
- [Node.js](https://nodejs.org/) 20+ (for the frontend)
- Java 25 (optional, only for local IDE work — Docker builds inside the container)

### 1. Clone & configure

```bash
git clone <your-repo-url>
cd projet-fil-rouge
cp .env.example .env  # then edit .env with your values
```

Example `.env`:

```env
MYSQL_ROOT_PASSWORD=change_me
MYSQL_DATABASE=bdd_manga
JWT_SECRET=aVeryLongSecretForJWTAtLeast256BitsForHS256
```

### 2. Start the backend + database

```bash
docker compose up -d --build
```

This launches three containers:

| Service    | Port  | Description               |
| ---------- | ----- | ------------------------- |
| springboot | 8082  | REST API (localhost:8082) |
| mysql      | 3306  | Database                  |
| phpmyadmin | 8081  | DB inspection UI          |

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, proxying `/api/*` to the backend.

---

## 🔧 Environment Variables

| Variable                | Purpose                            | Default                                 |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| `MYSQL_ROOT_PASSWORD`   | MySQL root password (Docker)       | *required*                              |
| `MYSQL_DATABASE`        | Database name                      | `bdd_manga`                             |
| `JWT_SECRET`            | HS256 signing key (≥ 256 bits)     | *required*                              |
| `CORS_ALLOWED_ORIGINS`  | Comma-separated allowed origins    | `http://localhost:5173,http://127.0.0.1:5173` |
| `PORT`                  | Backend server port (inside container) | `8080`                              |

---

##  Project Structure

```
projet-fil-rouge/
├── demo/                            # Spring Boot backend
│   ├── src/main/java/com/example/demo/
│   │   ├── client/                  # External API clients (Jikan, MangaDex)
│   │   ├── config/                  # HttpClient, CORS
│   │   ├── controller/              # REST endpoints
│   │   ├── dto/                     # Request/response DTOs
│   │   ├── exception/               # Domain exceptions + global handler
│   │   ├── model/                   # JPA entities
│   │   ├── repository/              # Spring Data JPA repositories
│   │   ├── security/                # JWT filter, service, security config
│   │   └── service/                 # Business logic
│   └── src/test/java/               # JUnit + Mockito tests
├── frontend/                        # React + Vite frontend
│   └── src/
│       ├── components/              # Reusable UI + shared modals
│       ├── context/                 # AuthContext
│       ├── pages/                   # Route pages
│       ├── services/                # API client (fetch wrapper)
│       └── types/                   # TypeScript definitions
├── docker-compose.yml
├── dockerfile
└── README.md
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`. Endpoints marked 🔒 require a valid JWT in `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| POST   | `/auth/register`     | Create account                     |
| POST   | `/auth/login`        | Login (optional `rememberMe: true`) |

### Users 

| Method | Endpoint                    | Description                              |
| ------ | --------------------------- | ---------------------------------------- |
| GET    | `/users/me`                 | Get current user                         |
| PUT    | `/users/me/password`        | Change password, returns fresh JWT       |

### Works 

| Method | Endpoint              | Description                                        |
| ------ | --------------------- | -------------------------------------------------- |
| GET    | `/works/search?q=`    | Search (Jikan → MangaDex fallback)                 |
| GET    | `/works/trending`     | Popular works (Jikan → MangaDex fallback)          |
| GET    | `/works/my`           | Current user's library                             |
| GET    | `/works/{id}`         | Get a single work by internal id                   |
| POST   | `/works/import`       | Import a work `{ externalId, source }`             |

### Progress 

| Method | Endpoint         | Description                              |
| ------ | ---------------- | ---------------------------------------- |
| PUT    | `/progress/{id}` | Update volume/chapter (IDOR-protected)   |
| DELETE | `/progress/{id}` | Remove from library (IDOR-protected)     |

---

##  Testing

Unit tests use JUnit 5 + Mockito + AssertJ.

```bash
cd demo
./mvnw test
```

Current coverage (8 tests):

- `JwtServiceTest` — token generation, extraction, tamper detection
- `ProgressServiceTest` — IDOR protection, defensive verification of DB writes
- `WorkImportServiceTest` — Jikan client mocked, existing-vs-new work paths

---

##  Known Limitations

- **Jikan reliability** — Jikan is a scraper of MyAnimeList, so downtime is frequent. Mitigated by the MangaDex fallback.
- **`totalChapters` = 9999** — Jikan sometimes reports null for ongoing series; this is a placeholder pending a better default.
- **No email verification** — no signup email confirmation or password reset flow (documented as a next step).
- **JWT revocation** — no server-side blacklist. Password change regenerates the JWT on the client, but old tokens remain valid until expiration.
- **Categories heuristic** — MangaDex works are stored as `Manga` category by default (tag mapping not implemented).

---

##  Roadmap

- [ ] OpenAPI / Swagger documentation
- [ ] Integration tests (`@WebMvcTest`, `@SpringBootTest`)
- [ ] GitHub Actions CI (tests on every push)
- [ ] Public deployment (O2switch frontend + Render backend)
- [ ] Email verification and forgot-password flow
- [ ] Browser extension for auto-syncing chapters read on external readers

---

##  Documentation

Technical concepts learned during this project are documented in a companion Notion space (private).

---

##  Author

**Pierre M.** — Full-stack training, RNCP Level 6 project.