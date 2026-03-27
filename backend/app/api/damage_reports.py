import os
import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import get_db
from app.models.damage import DamageReport
from app.models.user import User
from app.schemas.damage import DamageResponse
from app.services.dependencies import get_current_user

router = APIRouter(prefix="/damage-reports", tags=["damage-reports"])
settings = get_settings()


@router.post("", response_model=DamageResponse)
async def create_damage_report(
    state_id: str = Form(...),
    district_id: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    files: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    evidence_urls: list[str] = []
    for upload in files:
        ext = os.path.splitext(upload.filename or "")[1] or ".jpg"
        filename = f"{uuid.uuid4()}{ext}"
        path = os.path.join(settings.UPLOAD_DIR, filename)
        content = await upload.read()
        with open(path, "wb") as f:
            f.write(content)
        evidence_urls.append(f"/uploads/{filename}")

    report = DamageReport(
        user_id=user.id,
        state_id=uuid.UUID(state_id),
        district_id=uuid.UUID(district_id),
        title=title,
        description=description,
        latitude=latitude,
        longitude=longitude,
        evidence_urls=evidence_urls,
        status="submitted",
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("", response_model=list[DamageResponse])
def list_damage_reports(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    query = db.query(DamageReport).order_by(DamageReport.created_at.desc())
    if user.role != "ADMIN":
        query = query.filter(DamageReport.user_id == user.id)
    return query.limit(200).all()
