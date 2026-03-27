from sqlalchemy import Float, Index, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String

from app.models.base import BaseEntity


class Shelter(BaseEntity):
    __tablename__ = "shelters"

    name: Mapped[str] = mapped_column(String(140), index=True)
    address: Mapped[str] = mapped_column(String(255))
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    total_capacity: Mapped[int] = mapped_column(Integer)
    available_capacity: Mapped[int] = mapped_column(Integer)
    amenities: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)

    __table_args__ = (Index("ix_shelters_scope_status", "state_id", "district_id", "created_at", "status"),)
