from sqlalchemy import text

from app.core.database import engine


def ensure_sqlite_schema() -> None:
    if not str(engine.url).startswith("sqlite"):
        return

    with engine.begin() as conn:
        table_info = conn.execute(text("PRAGMA table_info('damage_reports')")).mappings().all()
        if table_info:
            cols = {row["name"] for row in table_info}
            if "latitude" not in cols:
                conn.execute(text("ALTER TABLE damage_reports ADD COLUMN latitude FLOAT DEFAULT 0"))
            if "longitude" not in cols:
                conn.execute(text("ALTER TABLE damage_reports ADD COLUMN longitude FLOAT DEFAULT 0"))
