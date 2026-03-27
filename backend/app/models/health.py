from sqlalchemy import Integer, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String

from app.models.base import BaseEntity


class HealthIncident(BaseEntity):
    __tablename__ = "health_incidents"

    disease_name: Mapped[str] = mapped_column(String(120), index=True)
    cases_reported: Mapped[int] = mapped_column(Integer)
    notes: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="monitoring", index=True)

    __table_args__ = (Index("ix_health_scope_status", "state_id", "district_id", "created_at", "status"),)
