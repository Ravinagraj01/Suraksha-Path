import uuid

from sqlalchemy import Float, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String, Uuid

from app.models.base import BaseEntity


class SOSRequest(BaseEntity):
    __tablename__ = "sos_requests"

    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, index=True)
    message: Mapped[str] = mapped_column(String(400))
    severity: Mapped[str] = mapped_column(String(20), default="high")
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    meta: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    __table_args__ = (Index("ix_sos_scope_status", "state_id", "district_id", "created_at", "status"),)
