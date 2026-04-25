import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import ai, auth, damage_reports, health, meta, news, risk_zones, shelters, sos, users, volunteers
from app.core.config import get_settings
from app.core.db_bootstrap import ensure_sqlite_schema
from app.core.database import Base, engine
from app.core.logging import configure_logging
from app.websocket import routes as websocket_routes

configure_logging()
settings = get_settings()
Base.metadata.create_all(bind=engine)
ensure_sqlite_schema()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(title="Disaster Management Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(sos.router)
app.include_router(shelters.router)
app.include_router(risk_zones.router)
app.include_router(health.router)
app.include_router(damage_reports.router)
app.include_router(volunteers.router)
app.include_router(meta.router)
app.include_router(news.router)
app.include_router(users.router)
app.include_router(ai.router)
app.include_router(websocket_routes.router)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
