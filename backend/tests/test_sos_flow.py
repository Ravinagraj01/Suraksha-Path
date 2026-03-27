import uuid


def _admin_token(client):
    email = f"admin_{uuid.uuid4()}@example.com"
    payload = {
        "full_name": "Admin User",
        "email": email,
        "password": "password123",
        "role": "ADMIN",
        "state_id": str(uuid.uuid4()),
        "district_id": str(uuid.uuid4()),
    }
    client.post("/auth/register", json=payload)
    response = client.post("/auth/login", json={"email": email, "password": payload["password"]})
    return response.json()["access_token"]


def test_sos_create(client):
    token = _admin_token(client)
    payload = {
        "state_id": str(uuid.uuid4()),
        "district_id": str(uuid.uuid4()),
        "message": "Need rescue support",
        "severity": "critical",
        "latitude": 19.07,
        "longitude": 72.87,
        "meta": {"people": 4},
    }
    response = client.post("/sos", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["status"] == "open"
