from __future__ import annotations
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Uuid

from app.core.database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class GeoScopeMixin:
    state_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, ForeignKey("states.id"), nullable=True, index=True)
    district_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, ForeignKey("districts.id"), nullable=True, index=True)


class BaseEntity(Base, TimestampMixin, GeoScopeMixin):
    __abstract__ = True

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
