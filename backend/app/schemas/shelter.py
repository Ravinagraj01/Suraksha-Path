from pydantic import BaseModel

from app.schemas.common import EntityResponse


class ShelterCapacityUpdate(BaseModel):
    available_capacity: int


class ShelterResponse(EntityResponse):
    name: str
    address: str
    latitude: float
    longitude: float
    total_capacity: int
    available_capacity: int
    amenities: dict
    status: str

    class Config:
        from_attributes = True
