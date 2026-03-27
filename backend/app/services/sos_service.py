from sqlalchemy.orm import Session

from app.models.sos import SOSRequest
from app.models.user import User
from app.schemas.sos import SOSCreate


def create_sos(db: Session, payload: SOSCreate, user: User) -> SOSRequest:
    sos = SOSRequest(
        user_id=user.id,
        state_id=payload.state_id,
        district_id=payload.district_id,
        message=payload.message,
        severity=payload.severity,
        latitude=payload.latitude,
        longitude=payload.longitude,
        meta=payload.meta,
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    return sos
