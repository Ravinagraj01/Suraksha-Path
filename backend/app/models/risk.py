from sqlalchemy import Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String

from app.models.base import BaseEntity


class HighRiskZone(BaseEntity):
    __tablename__ = "high_risk_zones"

    name: Mapped[str] = mapped_column(String(140), index=True)
    zone_type: Mapped[str] = mapped_column(String(50), default="flood")
    geojson: Mapped[dict] = mapped_column(JSON)
    risk_score: Mapped[float] = mapped_column(default=0.0)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)

    __table_args__ = (Index("ix_risk_scope_status", "state_id", "district_id", "created_at", "status"),)
