from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user_profile import UserProfileResponse, UserProfileUpdate
from app.services.dependencies import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(user: User = Depends(get_current_user)):
    return user


@router.patch("/me", response_model=UserProfileResponse)
def update_my_profile(payload: UserProfileUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.phone is not None:
        user.phone = payload.phone
    if payload.password:
        user.password_hash = get_password_hash(payload.password)
    db.commit()
    db.refresh(user)
    return user


@router.get("", response_model=list[UserProfileResponse])
def list_users(db: Session = Depends(get_db), _admin=Depends(require_role("ADMIN"))):
    return db.query(User).order_by(User.created_at.desc()).limit(500).all()
