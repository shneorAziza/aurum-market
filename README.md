# Aurum Market

A full-stack eCommerce platform generated from an AI blueprint. The project includes the final working codebase, the AI orchestration files used to guide generation, and documentation of manual fixes.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL 8
- Auth: JWT
- Styling: custom premium CSS

## Repository Structure

```text
ai-blueprint/
  initial.md
  engineering-guidelines.md
  capabilities.md
  ai-interactions.md
backend/
  src/
frontend/
  src/
docker-compose.yml
README.md
```

## Quick Start

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Start MySQL:

```bash
docker compose up -d mysql
```

The compose file maps MySQL to local port `3307` to avoid collisions with an existing local MySQL installation.

3. Copy backend env:

```bash
cp backend/.env.example backend/.env
```

4. Seed demo data:

```bash
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:4000/health`

Demo login:

```text
demo@commerce.dev
Password123!
```

## Features

- Login and sign-up with JWT.
- Product catalog with search, category filters, sort, and detail modal.
- Persistent authenticated cart.
- Multi-step checkout.
- Account section with profile update and order history.
- MySQL schema and seed data.

## AI Boilerplate

The AI orchestration layer is in `ai-blueprint/`:

- `initial.md`: bootstrap prompt for the AI agent.
- `engineering-guidelines.md`: coding, architecture, API, data, and UX constraints.
- `capabilities.md`: reusable functional building blocks.
- `ai-interactions.md`: prompt/model/tool log.

## Manual Interventions and AI Gap

The project was generated and assembled through Codex. Manual human/agent interventions were:

- Created a focused repository structure before code generation so the AI would produce maintainable modules instead of one large app file.
- Corrected the cart quantity update validation so the backend validates `quantity` from the request body while reading `productId` from the URL.
- Added an explicit Vite React plugin configuration after browser QA exposed a runtime JSX transform issue.
- Expanded local CORS handling to allow both `localhost:5173` and `127.0.0.1:5173`, because Vite can advertise either host during local review.
- Chose JavaScript rather than TypeScript because the time-box favored a runnable, reviewable product over extra compile configuration. In a production follow-up, TypeScript would be the preferred upgrade.
- Wrote explicit README run instructions and demo credentials because AI-generated projects often under-document the reviewer path.

## Known Production Follow-ups

- Add automated tests for auth, cart, and checkout.
- Add payment provider integration.
- Add admin product management.
- Add refresh tokens or secure httpOnly cookie sessions.
- Add inventory locking during checkout.
