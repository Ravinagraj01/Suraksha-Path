from __future__ import annotations
from enum import Enum
from typing import Optional

from sqlalchemy import Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import String

from app.models.base import BaseEntity


class UserRole(str, Enum):
    USER = "USER"
    ADMIN = "ADMIN"


class User(BaseEntity):
    __tablename__ = "users"

    full_name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    phone: Mapped[Optional[str]] = mapped_column(String(25), nullable=True)
    role: Mapped[str] = mapped_column(String(16), default=UserRole.USER.value, index=True)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)

    __table_args__ = (Index("ix_users_scope_status", "state_id", "district_id", "created_at", "status"),)
