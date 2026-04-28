# Krishi Setu (Gamified Platform) - Thesis-Ready Project Documentation

Version: 1.0  
Last Updated: 2026-04-25

## 1. Executive Summary
Krishi Setu is a full-stack gamified learning platform for sustainable farming education. It combines practical learning content, mini-games, daily quests, progress tracking, and multilingual interaction to improve farmer engagement and retention compared to passive text-only training.

The project is implemented as:
- Frontend: Static HTML, CSS, and JavaScript pages under `Frontend/`
- Backend: Node.js + Express API under `Frontend/server/index.js`
- Data store: Local JSON file (`Frontend/server/data/users.json`) for prototype-stage persistence

This document is written for direct reuse in academic thesis chapters such as introduction, system design, implementation, evaluation, limitations, and future work.

## 2. Project Identity
- Project Name: Krishi Setu - A Gamified Learning Platform for Sustainable Farming Practices
- Domain: AgriTech + EdTech + Gamification
- Type: Full-stack web application (prototype/research implementation)
- Primary Audience:
  - Farmers
  - Rural youth and beginner learners
  - Agricultural trainees
  - Admin users

## 3. Problem Statement
Traditional agricultural education methods are often:
- Low in engagement
- Difficult to sustain over time
- Weak in progress feedback and measurable outcomes

As a result, adoption of sustainable practices may be inconsistent. Krishi Setu addresses this by combining learning + gamification + measurable performance signals in one platform.

## 4. Aim and Objectives
### Aim
To develop an accessible, secure, and engaging gamified platform that promotes continuous learning of sustainable farming practices.

### Objectives
1. Provide role-based authentication for user and admin workflows.
2. Deliver learning content through a dedicated Learning Hub.
3. Increase engagement through daily quests and mini-games.
4. Track user progress and game performance over time.
5. Support multilingual interaction for broader accessibility.
6. Provide a modular foundation for future scaling and research.

## 5. Scope
### In Scope
- User registration and login
- Admin login
- JWT-based protected endpoints
- Profile and game-stat synchronization
- Dashboard and Learning Hub interfaces
- Daily Quest game flow
- Multilingual UI elements (English, Hindi, Malayalam, Telugu)
- Voice assistant for navigation/help commands

### Out of Scope (Current Prototype)
- Production-grade database scaling
- Advanced analytics dashboards
- Full CI/CD and automated test suite coverage
- Offline-first mobile app deployment

## 6. System Architecture
Krishi Setu follows a layered architecture:

1. Presentation Layer
- Static pages: `index.html`, `auth.html`, `dashboard.html`, `learning.html`, game pages, and support pages
- Styling and UI behavior via CSS and JavaScript modules

2. Application/Service Layer
- Express API handles authentication, user retrieval, and stat updates
- Core backend file: `Frontend/server/index.js`

3. Data Layer
- File-based persistence in `Frontend/server/data/users.json`
- User records include profile fields and cumulative game statistics

4. Configuration Layer
- Environment variables in `Frontend/server/.env`
- Important variables: `PORT`, `JWT_SECRET`, `ADMIN_ID`, `ADMIN_PASSWORD_HASH`

## 7. Technology Stack
### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Backend
- Node.js
- Express
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment variable loading)
- cors (cross-origin support)

### Development Utilities
- concurrently
- http-server
- kill-port

## 8. Major Modules and Responsibilities
### 8.1 Authentication and Session Module
- Endpoints: register/login/admin-login/me
- Passwords hashed with bcrypt
- Sessions managed via JWT bearer tokens
- User/admin role-aware behavior

### 8.2 Backend Bridge (Frontend-API Integration)
- File: `Frontend/js/backend-bridge.js`
- Responsibilities:
  - Persist token in localStorage or sessionStorage
  - Attach Authorization header to requests
  - Guard protected routes
  - Sync server user profile and stats to local storage

### 8.3 Dashboard Module
- File: `Frontend/js/dashboard.js`
- Responsibilities:
  - Personalized user dashboard rendering
  - Display level, XP, coins, gameplay indicators
  - Multilingual dashboard content
  - Fetch and hydrate user profile from backend

### 8.4 Learning Hub Module
- File: `Frontend/js/learning.js`
- Responsibilities:
  - Video-based farming learning interface
  - Category and difficulty filters
  - Multi-language labels/translations
  - Learning progress indicators

### 8.5 Daily Quest Module
- File: `Frontend/games/daily-quest.js`
- Responsibilities:
  - Daily farming tasks with reward mechanics
  - Quest progression states
  - Optional geotag/photo proof workflow in UI
  - Localized quest text and guidance

### 8.6 Voice Assistant Module
- File: `Frontend/voice-assistant.js`
- Responsibilities:
  - Speech recognition and speech synthesis
  - Navigation/help commands across multiple languages
  - Farming tips and guided responses

### 8.7 Game Stats Module
- Endpoint: `POST /api/stats/game`
- Tracks cumulative metrics:
  - gamesPlayed
  - totalScore
  - winStreak
  - gameAccuracy
  - virtualFarmeryScore
  - pickOddOutScore
  - dailyQuestCompleted

## 9. API Specification (Implemented)
Base URL: `http://localhost:3001/api`

1. `GET /health`
- Purpose: service health check
- Response: `{ "status": "ok" }`

2. `GET /auth/check-email?email=<email>`
- Purpose: validate email availability before registration

3. `POST /auth/register`
- Purpose: create user account
- Required fields:
  - firstName
  - lastName
  - email
  - phone
  - password (min 8 chars)
  - farmSize
  - farmingType
  - country
  - experienceLevel
- Response: token + sanitized user

4. `POST /auth/login`
- Purpose: user login by email or phone + password
- Response: token + sanitized user

5. `POST /auth/admin/login`
- Purpose: admin login via environment-configured credentials
- Response: admin token + admin user object

6. `GET /me` (auth required)
- Purpose: fetch current authenticated profile

7. `POST /stats/game` (auth required, non-admin)
- Purpose: submit game result payload and update cumulative stats

## 10. Data Model Snapshot
Prototype user object (conceptual):

```json
{
  "id": "uuid",
  "firstName": "...",
  "lastName": "...",
  "name": "...",
  "email": "...",
  "phone": "...",
  "dateOfBirth": "... or null",
  "farmSize": "...",
  "farmingType": "...",
  "country": "...",
  "experienceLevel": "...",
  "notifications": [],
  "level": 1,
  "xp": 0,
  "coins": 0,
  "gameStats": {
    "gamesPlayed": 0,
    "totalScore": 0,
    "winStreak": 0,
    "gameAccuracy": 0,
    "virtualFarmeryScore": 0,
    "pickOddOutScore": 0,
    "dailyQuestCompleted": 0
  },
  "role": "user",
  "createdAt": "ISO date",
  "passwordHash": "bcrypt hash"
}
```

## 11. Security and Privacy Design
- Passwords are stored as bcrypt hashes, not plaintext.
- Protected routes require bearer JWT tokens.
- Admin credentials are environment-driven, not hardcoded in frontend pages.
- Sensitive configuration is externalized via `.env`.
- Session data persistence supports remember/non-remember behavior.

Research note: since storage is JSON-file based, strict enterprise controls (rotation, centralized audit logs, robust access controls) should be documented as future improvements.

## 12. Development and Execution Workflow
### Prerequisites
- Node.js 18+
- npm

### Install
Run from workspace root:

```bash
npm --prefix Frontend install
```

### Start options
- Full stack: `npm start`
- Backend only: `npm run backend`
- Backend dev watch: `npm run backend:dev`
- Frontend only: `npm run start:client`
- Backend health check: `npm run backend:health`

## 13. Validation and Testing Strategy (Thesis Use)
### Current Practical Validation
- Endpoint-level smoke checks via `/api/health`
- Registration/login/admin-login functional checks
- Auth-guarded route checks (`/api/me`, `/api/stats/game`)
- Runtime integration checks from frontend modules using backend bridge

### Recommended Additional Testing for Thesis
1. Functional test matrix for all auth endpoints (valid/invalid/error scenarios).
2. Security tests: expired token, malformed token, unauthorized role actions.
3. Performance baseline: average response time for auth and stats APIs.
4. Usability testing with target users (farmers/learners).
5. Localization testing across supported language paths.

## 14. Suggested Evaluation Metrics
Use these measurable indicators in experiments:

1. Engagement Metrics
- Daily active users (or sessions)
- Games played per user per week
- Daily quest completion rate
- Consecutive activity streak

2. Learning Progress Metrics
- Change in average quiz/game score over time
- Game accuracy trend
- Time spent in Learning Hub content
- Repeat session behavior after content consumption

3. System Metrics
- Authentication success/failure ratio
- API reliability and error rates
- Mean endpoint response time

4. User Experience Metrics
- SUS score or custom usability survey
- User-perceived usefulness and ease of use

## 15. Limitations (Current Stage)
1. JSON file persistence is suitable for prototype scale only.
2. Concurrent write robustness is limited versus database-backed systems.
3. Analytics and reporting depth is basic.
4. Automated regression testing is not fully integrated.

## 16. Future Work
1. Migrate data layer to MongoDB or PostgreSQL.
2. Build a recommendation engine for personalized learning paths.
3. Add richer admin analytics and cohort dashboards.
4. Expand voice and accessibility features with stronger offline support.
5. Introduce formal assessments and certification workflows.
6. Build mobile-first/offline-first deployment for low-connectivity regions.

## 17. Thesis Chapter Mapping Guide
You can directly reuse this project in the following thesis structure:

1. Chapter 1: Introduction
- Background, problem statement, motivation, objectives

2. Chapter 2: Literature Review
- Gamification in learning, AgriTech training systems, behavior-change platforms

3. Chapter 3: Proposed System
- Architecture, modules, user roles, data flow, API design

4. Chapter 4: Implementation
- Frontend and backend module details, environment setup, integration

5. Chapter 5: Results and Discussion
- Measured metrics, engagement findings, usability observations

6. Chapter 6: Limitations and Future Scope
- Constraints and extension roadmap

## 18. Ethical and Societal Relevance
- Supports inclusive learning through multilingual interfaces.
- Encourages sustainable farming behavior through positive reinforcement.
- Can improve access to practical agricultural education for underserved communities.

## 19. Citation and Appendix Placeholders (For Thesis Drafting)
Add these in your thesis package:
- Appendix A: API request/response samples
- Appendix B: UI screenshots (auth, dashboard, learning hub, daily quest)
- Appendix C: User test questionnaire and raw results
- Appendix D: Deployment and configuration checklist

---

## 20. Quick Facts (One-Page Summary)
- Platform: Web-based gamified agriculture learning system
- Backend: Node.js + Express with JWT auth
- Frontend: Static HTML/CSS/JS multi-page app
- Data: JSON file persistence (`users.json`)
- Languages: EN/HI/ML/TE interface support in key modules
- Core value: engagement + measurable progress for farming education
