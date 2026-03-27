from datetime import timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest


def register_user(db: Session, payload: RegisterRequest) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        phone=payload.phone,
        role=payload.role,
        state_id=payload.state_id,
        district_id=payload.district_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def token_for_user(user: User) -> str:
    return create_access_token(subject=str(user.id), role=user.role)


def login_user(db: Session, payload: LoginRequest) -> str:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return token_for_user(user)


def refresh_access_token(token: str) -> str:
    from app.core.security import decode_token

    decoded = decode_token(token)
    if not decoded:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return create_access_token(decoded["sub"], decoded["role"], expires_delta=timedelta(minutes=30))
