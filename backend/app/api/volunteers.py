from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.volunteer import Volunteer
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse, VolunteerStatusUpdate
from app.services.dependencies import get_current_user, require_role

router = APIRouter(prefix="/volunteers", tags=["volunteers"])


@router.post("", response_model=VolunteerResponse)
def create_volunteer(payload: VolunteerCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    volunteer = Volunteer(
        user_id=user.id,
        state_id=payload.state_id,
        district_id=payload.district_id,
        full_name=payload.full_name,
        phone=payload.phone,
        skills=payload.skills,
        availability=payload.availability,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    db.add(volunteer)
    db.commit()
    db.refresh(volunteer)
    return volunteer


@router.get("", response_model=list[VolunteerResponse])
def list_volunteers(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(Volunteer).order_by(Volunteer.created_at.desc())
    if user.role != "ADMIN":
        query = query.filter(Volunteer.user_id == user.id)
    return query.limit(300).all()


@router.patch("/{volunteer_id}/status", response_model=VolunteerResponse)
def update_volunteer_status(
    volunteer_id: UUID,
    payload: VolunteerStatusUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("ADMIN")),
):
    volunteer = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    volunteer.status = payload.status
    volunteer.assigned_task = payload.assigned_task
    db.commit()
    db.refresh(volunteer)
    return volunteer
