def flood_prediction(state_id: str, district_id: str) -> dict:
    return {
        "state_id": state_id,
        "district_id": district_id,
        "model": "mock-flood-v1",
        "risk_level": "moderate",
        "confidence": 0.81,
        "next_24h": {"flood_probability": 0.38, "alert": "Watch"},
    }
