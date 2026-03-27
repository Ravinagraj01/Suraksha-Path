import uuid

from sqlalchemy import Float, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String, Uuid

from app.models.base import BaseEntity


class DamageReport(BaseEntity):
    __tablename__ = "damage_reports"

    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    title: Mapped[str] = mapped_column(String(150))
    description: Mapped[str] = mapped_column(String(500))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    evidence_urls: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default="submitted", index=True)

    __table_args__ = (Index("ix_damage_scope_status", "state_id", "district_id", "created_at", "status"),)
