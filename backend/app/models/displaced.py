from __future__ import annotations
from sqlalchemy import Integer, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON, String
from typing import Optional

from app.models.base import BaseEntity


class DisplacedFamily(BaseEntity):
    __tablename__ = "displaced_families"

    family_head_name: Mapped[str] = mapped_column(String(120), index=True)
    members_count: Mapped[int] = mapped_column(Integer)
    assigned_shelter_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    needs: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(20), default="unassigned", index=True)

    __table_args__ = (Index("ix_displaced_scope_status", "state_id", "district_id", "created_at", "status"),)
