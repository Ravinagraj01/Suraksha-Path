from fastapi import APIRouter

from app.ai_modules.damage import damage_assessment
from app.ai_modules.flood import flood_prediction
from app.ai_modules.resource import resource_optimizer

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/flood-prediction")
def ai_flood_prediction(state_id: str, district_id: str):
    return flood_prediction(state_id, district_id)


@router.get("/damage-assessment")
def ai_damage_assess(report_id: str):
    return damage_assessment(report_id)


@router.get("/resource-optimizer")
def ai_resource_optimizer(state_id: str, district_id: str):
    return resource_optimizer(state_id, district_id)
