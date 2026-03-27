from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.risk import HighRiskZone
from app.services.dependencies import require_role

router = APIRouter(prefix="/risk-zones", tags=["risk-zones"])


@router.get("")
def list_risk_zones(db: Session = Depends(get_db), user=Depends(require_role("ADMIN", "USER"))):
    return db.query(HighRiskZone).order_by(HighRiskZone.created_at.desc()).limit(300).all()


@router.post("")
def create_risk_zone(payload: dict, db: Session = Depends(get_db), user=Depends(require_role("ADMIN"))):
    zone = HighRiskZone(**payload)
    db.add(zone)
    db.commit()
    db.refresh(zone)
    return zone
