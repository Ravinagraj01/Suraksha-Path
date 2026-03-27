from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.shelter import Shelter
from app.schemas.shelter import ShelterCapacityUpdate, ShelterResponse
from app.services.dependencies import require_role
from app.websocket.manager import ws_manager

router = APIRouter(prefix="/shelters", tags=["shelters"])


@router.get("", response_model=list[ShelterResponse])
def list_shelters(db: Session = Depends(get_db), user=Depends(require_role("ADMIN", "USER"))):
    return db.query(Shelter).order_by(Shelter.created_at.desc()).limit(200).all()


@router.patch("/{shelter_id}/capacity", response_model=ShelterResponse)
async def update_capacity(shelter_id: UUID, payload: ShelterCapacityUpdate, db: Session = Depends(get_db), user=Depends(require_role("ADMIN"))):
    shelter = db.query(Shelter).filter(Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    shelter.available_capacity = payload.available_capacity
    db.commit()
    db.refresh(shelter)
    await ws_manager.broadcast("shelter-updates", {"event": "capacity_updated", "data": ShelterResponse.model_validate(shelter).model_dump(mode="json")})
    return shelter
