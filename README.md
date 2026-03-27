# SurakshaPath - Disaster Management Platform

SurakshaPath is a full-stack disaster management web application designed for **state-level deployment** and built to scale to **national level**. It supports prevention, emergency response, post-disaster recovery workflows, live updates, and AI-powered situational intelligence.

## Tech Stack

### Frontend
- React (Vite)
- TailwindCSS
- React Router
- Axios
- Recharts
- Leaflet (OpenStreetMap)

### Backend
- FastAPI
- SQLAlchemy ORM
- Alembic
- SQLite (local dev) / PostgreSQL-ready
- JWT Authentication + Role-based access
- FastAPI WebSockets

### Database
- SQLite for local development
- PostgreSQL (Supabase) compatible without model changes

---

## Core Modules

### 1) Prevention & Early Warning
- High-risk zones
- AI disaster news feed (India-focused)
- Flood-related preparedness insights

### 2) Emergency Response
- SOS creation and live SOS feed
- Shelter locator and capacity updates
- Volunteer registration and admin assignment flow

### 3) Post-Disaster Recovery
- Damage report uploads with image evidence
- Location-tagged reports
- Role-scoped report visibility

---

## Roles

### USER (Citizen)
- Raise SOS
- Upload damage evidence
- Register as volunteer
- View own SOS/reports/volunteer entries
- View AI disaster news
- Manage profile

### ADMIN
- Monitor all SOS and shelter status
- View all damage reports
- View all users
- Access operational dashboards and analytics
- View AI disaster news

> Volunteer registration is intentionally user-focused; admin can still view and update volunteer status via backend APIs.

---

## Real-time Features

- WebSocket: `/ws/sos-feed`
- WebSocket: `/ws/shelter-updates`

SOS submissions and shelter capacity updates are broadcast live.

---

## AI & Real-world News Integration

### AI Adapter Endpoints (stubbed)
- `GET /ai/flood-prediction`
- `GET /ai/damage-assessment`
- `GET /ai/resource-optimizer`

### Live AI Disaster News
- `GET /news/ai-disaster-updates`
- Aggregates free sources:
  - ReliefWeb API
  - NASA EONET API
- Adds risk labels and AI summary notes

---

## Project Structure

```text
Suraksha Path 2.0/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ai_modules/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── websocket/
│   │   ├── main.py
│   │   └── seed.py
│   ├── alembic/
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── layout/
    │   ├── pages/
    │   ├── services/
    │   └── theme/
    ├── package.json
    └── tailwind.config.js
```

---

## Prerequisites

- Python **3.9** recommended
- Node.js 18+
- npm

---

## Backend Setup

```powershell
cd backend
py -3.9 -m venv venv
.\venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create env file:

```powershell
Copy-Item .env.example .env
```

Run DB migration (if you use alembic flow):

```powershell
python -m alembic revision --autogenerate -m "initial"
python -m alembic upgrade head
```

Seed demo data:

```powershell
python -m app.seed
```

Run backend:

```powershell
uvicorn app.main:app --reload
```

Backend URLs:
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

---

## Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:
- `http://localhost:5173`

---

## Default Credentials

- Admin
  - Email: `admin@surakshapath.in`
  - Password: `Admin@123`
- User
  - Email: `user@surakshapath.in`
  - Password: `User@123`

You can also register additional users from the login/register screen.

---

## Profile & Multi-user Support

The application supports multiple users with protected routes and profile management.

### Profile APIs
- `GET /users/me`
- `PATCH /users/me`
- `GET /users` (ADMIN only)

Frontend includes a dedicated **Profile** page under dashboard.

---

## Key API Overview

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`

### SOS
- `POST /sos`
- `GET /sos`

### Shelters
- `GET /shelters`
- `PATCH /shelters/{id}/capacity`

### Damage Reports
- `POST /damage-reports` (multipart with files)
- `GET /damage-reports`

### Volunteers
- `POST /volunteers`
- `GET /volunteers`
- `PATCH /volunteers/{id}/status` (ADMIN)

### News
- `GET /news/ai-disaster-updates`

### Utility
- `GET /meta/bootstrap`
- `GET /healthz`

---

## Testing

Run backend tests:

```powershell
cd backend
.\venv\Scripts\activate
pytest -q
```

Current suite includes:
- Auth tests
- SOS flow tests
- End-to-end tests for upload/visibility/volunteer flow
- Profile tests

---

## PostgreSQL / Supabase Migration Guide

1. Update `.env`:

```env
DATABASE_URL=postgresql+psycopg2://user:password@host:port/db
```

2. Install driver:

```powershell
pip install psycopg2-binary
```

3. Apply migrations:

```powershell
python -m alembic upgrade head
```

> Models are written to remain PostgreSQL-compatible (UUID, JSON, timezone timestamps, scoped indexes).

---

## Deployment Notes

- Backend is Docker-ready (`backend/Dockerfile`)
- Use environment variables for secrets and DB config
- Serve frontend via static hosting/CDN
- Run backend behind reverse proxy in production

---

## Troubleshooting

### 1) Login redirects without valid session
- Ensure backend is running
- Ensure token is valid (`/auth/me` check)
- Clear localStorage if needed

### 2) Uploaded images not visible
- Confirm backend serves `/uploads`
- Check `UPLOAD_DIR` in `.env`

### 3) SQLite schema mismatch after model changes
- Re-run migration or seed flow
- App includes SQLite bootstrap patch for key added columns

### 4) Tailwind/PostCSS class errors
- Restart Vite server after config/style changes
- Ensure files are UTF-8 without BOM

---

## License

Internal project / demo use. Add your preferred license for production distribution.
