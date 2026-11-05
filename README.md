# DevOps API

![CI](https://github.com/Janderscj/devops-api/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Tested_with-Jest-C21325?logo=jest&logoColor=white)

![Last commit](https://img.shields.io/github/last-commit/Janderscj/devops-api)
![License](https://img.shields.io/badge/license-ISC-blue)

A Node.js REST API with user authentication and user management, containerized with Docker and tested and published through GitHub Actions.

## Tech Stack

- Node.js 20, Express 5 (ES modules)
- PostgreSQL on [Neon](https://neon.tech) with Drizzle ORM
- JWT auth, bcrypt, Zod validation
- Helmet, CORS, [Arcjet](https://arcjet.com) (rate limiting, bot detection, shield)
- Swagger UI docs, Winston and Morgan logging
- Docker, Docker Compose, GitHub Actions
- Jest and Supertest, ESLint and Prettier

## API Endpoints

| Method | Path                 | Description     |
| ------ | -------------------- | --------------- |
| GET    | `/health`            | Health check    |
| GET    | `/api`               | API status      |
| POST   | `/api/auth/sign-up`  | Register a user |
| POST   | `/api/auth/sign-in`  | Sign in         |
| POST   | `/api/auth/sign-out` | Sign out        |
| GET    | `/api/users`         | List users      |
| GET    | `/api/users/:id`     | Get a user      |
| PUT    | `/api/users/:id`     | Update a user   |
| DELETE | `/api/users/:id`     | Delete a user   |
| GET    | `/docs`              | Swagger UI      |

## Getting Started

### Environment variables

Create `.env.development`:

```
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=<connection string>
NEON_API_KEY=<your key>
NEON_PROJECT_ID=<your project id>
PARENT_BRANCH_ID=<your branch id>
JWT_SECRET=<a strong secret>
ARCJET_KEY=<your key>
```

### Run with Docker (development)

```
docker compose -f compose.dev.yml up --build
```

This starts a Neon Local proxy and the app with hot reload. Inside Docker, the database host is `neon-local`, not `localhost`.

### Run locally

```
npm ci
npm run dev
```

## Scripts

| Command                | Description                 |
| ---------------------- | --------------------------- |
| `npm run dev`          | Start with file watching    |
| `npm start`            | Start the server            |
| `npm test`             | Run Jest tests              |
| `npm run lint`         | Run ESLint                  |
| `npm run format:check` | Check Prettier formatting   |
| `npm run db:generate`  | Generate Drizzle migrations |
| `npm run db:migrate`   | Apply migrations            |
| `npm run db:studio`    | Open Drizzle Studio         |

## CI/CD

`.github/workflows/ci.yml` runs in order: **lint**, then **test**, then **build and push** a Docker image. The image is only published from `main`. It needs the repo secrets `DOCKER_USERNAME`, `DOCKER_PASSWORD` and `ARCJET_KEY`.

## Project Structure

```
src/
  config/       database, logger, arcjet, swagger
  controllers/  request handlers
  middleware/   security (Arcjet) middleware
  models/       Drizzle schemas
  routes/       route definitions
  services/     business logic
  validations/  Zod schemas
tests/          Jest tests
```
