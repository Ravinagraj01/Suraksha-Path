from fastapi import APIRouter, HTTPException

from app.ai_modules.damage import damage_assessment
from app.ai_modules.flood import flood_prediction
from app.ai_modules.resource import resource_optimizer
from app.ai_modules.disaster_prediction import predict_disaster_risk, get_all_districts

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


@router.get("/disaster-predict")
def ai_disaster_predict(location: str):
    """
    Predict disaster risk for a Karnataka district.
    - location: district name (e.g. 'Kodagu', 'Bengaluru Urban') or
                coordinates as 'lat,lon' (e.g. '12.97,77.59')
    """
    result = predict_disaster_risk(location)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.get("/disaster-districts")
def ai_disaster_districts():
    """Return the list of all Karnataka districts supported by the prediction model."""
    return {"districts": get_all_districts()}
