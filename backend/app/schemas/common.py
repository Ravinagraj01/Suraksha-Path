from __future__ import annotations
from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ScopedBase(BaseModel):
    state_id: Optional[UUID] = None
    district_id: Optional[UUID] = None


class EntityResponse(ScopedBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
