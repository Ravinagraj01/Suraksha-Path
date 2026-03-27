from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import EntityResponse


class VolunteerCreate(BaseModel):
    state_id: UUID
    district_id: UUID
    full_name: str
    phone: str
    skills: list[str]
    availability: str
    latitude: float
    longitude: float


class VolunteerStatusUpdate(BaseModel):
    status: str
    assigned_task: str


class VolunteerResponse(EntityResponse):
    user_id: UUID
    full_name: str
    phone: str
    skills: list[str]
    availability: str
    latitude: float
    longitude: float
    status: str
    assigned_task: str

    class Config:
        from_attributes = True
