from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.health import HealthIncident
from app.services.dependencies import require_role

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def list_incidents(db: Session = Depends(get_db), user=Depends(require_role("ADMIN", "USER"))):
    return db.query(HealthIncident).order_by(HealthIncident.created_at.desc()).limit(200).all()


@router.post("")
def create_incident(payload: dict, db: Session = Depends(get_db), user=Depends(require_role("ADMIN"))):
    incident = HealthIncident(**payload)
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident
