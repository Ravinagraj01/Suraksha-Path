from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.common import EntityResponse


class SOSCreate(BaseModel):
    state_id: UUID
    district_id: UUID
    message: str = Field(min_length=4, max_length=400)
    severity: str = "high"
    latitude: float
    longitude: float
    meta: dict = Field(default_factory=dict)


class SOSResponse(EntityResponse):
    user_id: UUID
    message: str
    severity: str
    status: str
    latitude: float
    longitude: float
    meta: dict

    class Config:
        from_attributes = True
