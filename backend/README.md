# State-Level Disaster Management Platform

## Architecture Diagram (Logical)

```text
[React Vite Dashboard + Leaflet + Recharts]
                 |
        HTTPS / WebSocket
                 |
        [FastAPI API Gateway]
       /       |         \
 [Auth]   [Disaster]   [AI Adapters]
    |         |            |
 [JWT/RBAC] [SOS/Shelter/Risk/Health/Reports]
                 |
         [SQLAlchemy ORM]
                 |
      [SQLite local / PostgreSQL Supabase prod]
```

## Backend Setup (venv)
1. `python -m venv venv`
2. Windows: `venv\\Scripts\\activate`
3. Mac/Linux: `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `copy .env.example .env` (Windows) or `cp .env.example .env`
6. `pip freeze > requirements.txt`

## Run Backend
1. `uvicorn app.main:app --reload`
2. Seed sample data: `python -m app.seed`

## Alembic Migration Instructions
1. `alembic revision --autogenerate -m "initial"`
2. `alembic upgrade head`

## Switch to Supabase PostgreSQL (No Model Changes)
1. Update `.env`:
   - `DATABASE_URL=postgresql+psycopg2://user:password@host:port/db`
2. Install driver: `pip install psycopg2-binary`
3. Run: `alembic upgrade head`

## API Overview
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /sos` (rate limited)
- `GET /sos`
- `GET /shelters`
- `PATCH /shelters/{id}/capacity`
- `GET /risk-zones`, `POST /risk-zones`
- `GET /health`, `POST /health`
- `GET /ai/flood-prediction`
- `GET /ai/damage-assessment`
- `GET /ai/resource-optimizer`
- `WS /ws/sos-feed`
- `WS /ws/shelter-updates`

## Security Model
- JWT bearer auth
- Role-based access (`USER`, `ADMIN`)
- Password hashing with bcrypt
- SOS in-memory rate limiting
- CORS configured from environment

## Scalability Strategy
- State/district scoped schema for national expansion
- UUID keys for distributed writes
- SQLAlchemy generic JSON/DateTime for DB portability
- Service-oriented module boundaries for horizontal scaling
- WebSocket channel abstraction for future Redis pub/sub fanout

## Deployment Strategy
- Docker-ready backend
- Env-based config for staging/prod
- Alembic migrations for controlled schema evolution
- Supabase PostgreSQL target for managed operations
