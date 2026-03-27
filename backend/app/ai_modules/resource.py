def resource_optimizer(state_id: str, district_id: str) -> dict:
    return {
        "state_id": state_id,
        "district_id": district_id,
        "model": "mock-resource-v1",
        "recommendations": [
            {"resource": "water_tanker", "count": 4, "priority": "high"},
            {"resource": "medical_kit", "count": 120, "priority": "critical"},
        ],
    }
