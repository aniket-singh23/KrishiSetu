# Krishi Setu (Gamified Platform)

A full-stack farming learning/gamification project with:
- Frontend: static HTML/CSS/JS pages
- Backend: Node.js + Express auth/game stats API
- Data store: local JSON file (`Frontend/server/data/users.json`)

## About The Project

### Project Name
**Krishi Setu: A Gamified Learning Platform for Sustainable Farming Practices**

### Project Domain
- AgriTech
- Educational Technology (EdTech)
- Gamification for behavior change

### Project Summary
Krishi Setu is a full-stack web platform that helps farmers and agriculture learners improve practical knowledge through interactive, game-based experiences. The system combines learning content, daily quests, and mini-games with progress tracking, authentication, and role-based access (user/admin). The primary goal is to increase engagement and retention of sustainable farming practices compared to static learning content.

### Problem Statement
Traditional agricultural training methods are often text-heavy, passive, and difficult to sustain over time. Many learners need a more engaging and repeatable way to understand modern and sustainable farming methods. Krishi Setu addresses this gap by applying gamification techniques to agricultural education.

### Aim
To design and implement an accessible gamified platform that motivates farmers to learn and repeatedly apply sustainable agriculture concepts.

### Objectives
1. Build a user-friendly learning platform for farming knowledge.
2. Improve engagement using gamified mechanics such as points, streaks, and quests.
3. Track user progress and game performance through measurable stats.
4. Provide secure authentication and role-based access for users and admin.
5. Create a modular architecture that can be extended for future research and deployment.

### Target Users
1. Farmers and farm trainees.
2. Rural youth and beginners in agriculture.
3. Agricultural trainers/institutions.
4. Administrators managing platform users and content workflows.

### Core Features
1. User registration and login with JWT-based session management.
2. Admin login with environment-secured credentials.
3. Protected routes and session checks on dashboard/learning pages.
4. Game stats sync API (`/api/stats/game`) for activity tracking.
5. Learning hub and gamified challenge pages.
6. Dashboard with profile-level indicators such as XP, level, coins, and game metrics.

### Technical Architecture
1. **Frontend Layer**: Static pages and client scripts (`Frontend/`) for UI, route guards, and user interactions.
2. **Service Layer**: Express API server (`Frontend/server/index.js`) for authentication, profile fetch, and gameplay stat updates.
3. **Data Layer**: File-based persistence in `Frontend/server/data/users.json`.
4. **Configuration Layer**: `.env`-driven runtime configuration (`PORT`, `JWT_SECRET`, admin credentials).

### Methodology (Thesis-Friendly)
1. Requirement analysis for user engagement and secure access.
2. UI/UX design for multilingual, game-oriented learning screens.
3. Incremental backend API development and endpoint validation.
4. Integration of frontend route guards with backend token/session checks.
5. Smoke testing of critical routes (`health`, `auth`, `me`, `stats`).
6. Iterative debugging based on runtime logs and command-level checks.

### Data and Security Design
1. Passwords are stored as bcrypt hashes, not plaintext.
2. Auth sessions are token-based (JWT).
3. Sensitive secrets are externalized via environment variables.
4. User data includes profile and gameplay metrics to support learning analytics.

### Suggested Evaluation Metrics (For Thesis)
1. Authentication success/failure rates.
2. API reliability (HTTP success rate for key endpoints).
3. User engagement indicators: daily quests completed, games played, streak duration.
4. Learning progression indicators: score improvements and accuracy trends.
5. System usability feedback (SUS or custom survey).
6. Response-time benchmarks for key API routes.

### Current Limitations
1. Local JSON storage is suitable for prototype/small-scale use only.
2. No production-grade database or horizontal scaling yet.
3. Advanced analytics dashboards are limited.
4. No automated test suite integrated in CI pipeline currently.

### Future Scope
1. Migrate persistence from JSON to MongoDB/PostgreSQL.
2. Add recommendation engine for personalized farming lessons.
3. Introduce offline-first/mobile app support for rural connectivity constraints.
4. Implement advanced admin analytics and cohort-level reporting.
5. Add structured assessment modules and certification workflows.
6. Integrate multilingual voice assistant and accessibility enhancements.

### Thesis Reuse Notes
You can directly reuse this section in thesis chapters such as:
1. Introduction (problem, aim, objectives)
2. Proposed System (architecture and modules)
3. Methodology (implementation flow)
4. Results and Discussion (evaluation metrics)
5. Limitations and Future Work

## Tech Stack
- Node.js
- Express
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- http-server (for frontend)
- concurrently

## Project Structure
- `Frontend/` -> UI pages, JS, CSS, games
- `Frontend/server/index.js` -> backend API server
- `Frontend/server/.env` -> backend environment variables
- `Frontend/server/data/users.json` -> local user data
- `package.json` -> root helper scripts
- `Frontend/package.json` -> app scripts and dependencies

## Prerequisites
- Node.js 18+ recommended
- npm

## Install
From workspace root:

```bash
npm --prefix Frontend install
```

## Environment Setup
Create/update:
- `Frontend/server/.env`

Required keys:

```env
PORT=3001
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_ID=admin
ADMIN_PASSWORD_HASH=replace-with-bcrypt-hash
```

Generate admin password hash:

```bash
npm run admin:hash -- yourAdminPassword
```

Copy the printed hash into `ADMIN_PASSWORD_HASH`.

## Run Commands
From workspace root (`D:\GAMIFIED_PLAT - Copy`):

- Full stack (frontend + backend):

```bash
npm start
```

- Backend only:

```bash
npm run backend
```

- Backend dev watch mode:

```bash
npm run backend:dev
```

- Frontend only:

```bash
npm run start:client
```

- Backend health check:

```bash
npm run backend:health
```

## API Endpoints
Base URL: `http://localhost:3001/api`

- `GET /health`
- `GET /auth/check-email?email=<email>`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/admin/login`
- `GET /me` (Bearer token required)
- `POST /stats/game` (Bearer token required)

## Common Issues
### 1) `python app.py` fails
This project backend is Node.js, not Python. Use npm scripts above.

### 2) `npm run backend` exits with code 1
Check in order:

1. Dependencies installed:
```bash
npm --prefix Frontend install
```

2. `.env` exists and has required keys:
- `Frontend/server/.env`

3. Port 3001 not blocked by another process.

4. Verify backend directly:
```bash
npm run backend:health
```

If health check fails, start backend and review console error logs:
```bash
npm run backend
```

## Notes
- Frontend auth/session bridge is in `Frontend/js/backend-bridge.js`.
- Protected pages use backend session/token validation.
