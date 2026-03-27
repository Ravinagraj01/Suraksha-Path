import uuid


def test_register_and_login(client):
    payload = {
        "full_name": "Test User",
        "email": f"test_{uuid.uuid4()}@example.com",
        "password": "password123",
        "role": "ADMIN",
        "state_id": str(uuid.uuid4()),
        "district_id": str(uuid.uuid4()),
    }
    r1 = client.post("/auth/register", json=payload)
    assert r1.status_code == 200

    r2 = client.post("/auth/login", json={"email": payload["email"], "password": payload["password"]})
    assert r2.status_code == 200
    assert "access_token" in r2.json()
