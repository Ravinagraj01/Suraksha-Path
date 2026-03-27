from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.location import District, State

router = APIRouter(prefix="/meta", tags=["meta"])


@router.get("/bootstrap")
def bootstrap_meta(db: Session = Depends(get_db)):
    state = db.query(State).order_by(State.created_at.asc()).first()
    district = db.query(District).order_by(District.created_at.asc()).first()
    return {
        "state_id": str(state.id) if state else "",
        "district_id": str(district.id) if district else "",
        "images": {
            "flood": "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
            "shelter": "https://images.unsplash.com/photo-1469571486292-b53601020848?auto=format&fit=crop&w=1200&q=80",
            "volunteer": "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
        },
    }
