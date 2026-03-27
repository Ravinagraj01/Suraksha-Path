from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.sos import SOSCreate, SOSResponse
from app.services.dependencies import get_current_user, require_role
from app.services.rate_limiter import sos_limiter
from app.services.sos_service import create_sos
from app.websocket.manager import ws_manager

router = APIRouter(prefix="/sos", tags=["sos"])


@router.post("", response_model=SOSResponse)
async def create_sos_route(payload: SOSCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    sos_limiter.hit(str(user.id))
    record = create_sos(db, payload, user)
    await ws_manager.broadcast("sos-feed", {"event": "sos_created", "data": SOSResponse.model_validate(record).model_dump(mode="json")})
    return record


@router.get("", response_model=list[SOSResponse])
def list_sos(db: Session = Depends(get_db), user=Depends(require_role("ADMIN", "USER"))):
    from app.models.sos import SOSRequest

    query = db.query(SOSRequest).order_by(SOSRequest.created_at.desc())
    if user.role != "ADMIN":
        query = query.filter(SOSRequest.user_id == user.id)
    return query.limit(200).all()
