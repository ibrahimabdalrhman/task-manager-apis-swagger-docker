# task-manager API

A RESTful **Project & Task Management System** built with Node.js, Express, TypeScript, PostgreSQL, and JWT authentication.

## Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js 18+ |
| Framework | Express.js 5 |
| Language | TypeScript |
| Database | PostgreSQL 16 |
| ORM | Sequelize |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcrypt |
| Validation | Zod |
| API Docs | Swagger / OpenAPI 3 |
| Testing | Jest + Supertest |
| Containerization | Docker & Docker Compose |

## Features

### Authentication & Authorization
- User registration (name, email, password)
- User login with JWT access token
- All protected endpoints require a valid Bearer token
- Role-based access control: **Admin** sees all projects; **Member** sees only their own

### Projects
- Create, read, update, delete projects
- Fields: title, description, status (`active` | `completed` | `archived`)
- Pagination, sorting, and status filtering on list endpoint

### Tasks
- CRUD operations nested under projects (`/projects/:projectId/tasks`)
- Fields: title, description, status (`pending` | `in_progress` | `done`), priority (`low` | `medium` | `high`), due date
- Filter by status or priority; pagination and sorting supported

## Architecture

Layered architecture with clear separation of concerns:

```
routes → controllers → services → models
         ↓
    middleware (auth, validation, error handling)
```

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14+ (or use Docker Compose)
- npm

## Quick Start (Local)

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd task-manager
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials and a secure `JWT_SECRET`.

### 3. Start PostgreSQL

**Option A — Docker (recommended):**

```bash
docker compose up db -d
```

**Option B — Local PostgreSQL:**

Create a database named `task-manager`.

### 4. Run migrations and seed data

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

## Docker (Full Stack)

Run the API and PostgreSQL together:

```bash
docker compose up --build
```

Migrations run automatically on container startup.

## API Documentation

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Postman Collection:** `postman/Task-Manager-API.postman_collection.json`

## Seed Users

After running seeds, you can log in with:

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Password123! | admin |
| member@example.com | Password123! | member |

## API Endpoints

### Auth (public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |

### Projects (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects` | List projects (paginated) |
| GET | `/api/v1/projects/:id` | Get project by ID |
| PUT | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |

**Query params for list:** `page`, `limit`, `sortBy`, `sortOrder`, `status`

### Tasks (protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/projects/:projectId/tasks` | Create task |
| GET | `/api/v1/projects/:projectId/tasks` | List tasks (paginated) |
| GET | `/api/v1/projects/:projectId/tasks/:taskId` | Get task by ID |
| PUT | `/api/v1/projects/:projectId/tasks/:taskId` | Update task |
| DELETE | `/api/v1/projects/:projectId/tasks/:taskId` | Delete task |

**Query params for list:** `page`, `limit`, `sortBy`, `sortOrder`, `status`, `priority`

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## Authentication

Include the JWT in the `Authorization` header:

```
Authorization: Bearer <your-access-token>
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:reset` | Undo all migrations, re-migrate, and seed |
| `npm test` | Run unit tests |

## Implementation Notes

1. **RBAC:** Admins can access all projects and tasks. Members are restricted to projects they own (`userId` match).
2. **Validation:** All request bodies, params, and query strings are validated with Zod before reaching controllers.
3. **Error handling:** Centralized error middleware returns consistent JSON responses with appropriate HTTP status codes.
4. **Password security:** Passwords are hashed with bcrypt (10 salt rounds). Password policy requires uppercase, lowercase, and a number.
5. **Pagination:** List endpoints return `{ data, meta: { total, page, limit, totalPages } }`.
6. **Cascade deletes:** Deleting a project removes all associated tasks (database-level CASCADE).

## Project Structure

```
src/
├── config/          # Environment, database, Swagger config
├── controllers/     # Request/response handlers
├── middleware/      # Auth, validation, error handling
├── migrations/      # Sequelize migrations
├── models/          # Sequelize models
├── routes/          # Express route definitions
├── seeders/         # Database seed files
├── services/        # Business logic
├── types/           # TypeScript type declarations
├── utils/           # Helpers (AppError, pagination)
├── app.ts           # Express app setup
└── server.ts        # Server entry point
tests/               # Jest unit tests
postman/             # Postman collection
```

## License

MIT
