from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import EntityResponse


class DamageCreate(BaseModel):
    state_id: UUID
    district_id: UUID
    title: str
    description: str
    latitude: float
    longitude: float


class DamageResponse(EntityResponse):
    user_id: UUID
    title: str
    description: str
    latitude: float
    longitude: float
    evidence_urls: list[str]
    status: str

    class Config:
        from_attributes = True
