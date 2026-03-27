import uuid

from sqlalchemy import Float, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String, Uuid

from app.models.base import BaseEntity


class Volunteer(BaseEntity):
    __tablename__ = "volunteers"

    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(25))
    skills: Mapped[list] = mapped_column(JSON, default=list)
    availability: Mapped[str] = mapped_column(String(60), default="weekends")
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)
    assigned_task: Mapped[str] = mapped_column(String(200), default="unassigned")

    __table_args__ = (Index("ix_volunteer_scope_status", "state_id", "district_id", "created_at", "status"),)
