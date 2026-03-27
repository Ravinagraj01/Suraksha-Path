from __future__ import annotations
import uuid
from typing import Optional

from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.core.database import Base
from app.models.base import TimestampMixin


class State(Base, TimestampMixin):
    __tablename__ = "states"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    state_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, nullable=True, index=True)
    district_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, nullable=True, index=True)

    districts = relationship("District", back_populates="state")

    __table_args__ = (Index("ix_states_scope", "state_id", "district_id", "created_at"),)


class District(Base, TimestampMixin):
    __tablename__ = "districts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    state_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey("states.id"), index=True)
    district_id: Mapped[Optional[uuid.UUID]] = mapped_column(Uuid, nullable=True, index=True)
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), index=True)

    state = relationship("State", back_populates="districts")

    __table_args__ = (Index("ix_districts_scope", "state_id", "district_id", "created_at"),)
