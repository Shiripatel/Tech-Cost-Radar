# TechSpend AI
### Enterprise Technology Spend Decision Intelligence Platform

TechSpend AI is an enterprise SaaS platform built for CFOs, CIOs, Procurement, Finance, Internal Audit, and IT leaders to govern, optimize, and forecast technology spending.

---

## Technical Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS, ECharts 
- **Backend:** Python FastAPI, SQLAlchemy 2, Alembic, Pydantic, PostgreSQL, Redis
- **Infra:** Docker, Docker Compose

---

## Local Development Setup

To start the full-stack development environment (web server, backend API, database, and Redis cache):

### Prerequisites
- Docker & Docker Compose
- Node.js (for optional local package installation)
- Python 3.11 (for local linting/testing)

### Spin up Services
Run the following command at the root directory:
```bash
docker-compose up --build
```

Ports:
- **Frontend Dashboard:** `http://localhost:3000`
- **FastAPI Backend Spec:** `http://localhost:8000/api/docs` (Swagger UI)
- **Postgres Database:** `localhost:5432`
- **Redis Cache:** `localhost:6379`