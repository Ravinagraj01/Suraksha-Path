def damage_assessment(report_id: str) -> dict:
    return {
        "report_id": report_id,
        "model": "mock-damage-v1",
        "severity": "high",
        "estimated_loss_inr": 180000,
        "confidence": 0.77,
    }
