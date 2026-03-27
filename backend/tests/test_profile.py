import uuid


def _token(client, role="USER"):
    email = f"profile_{role.lower()}_{uuid.uuid4()}@example.com"
    payload = {
        "full_name": "Profile User",
        "email": email,
        "password": "password123",
        "role": role,
        "state_id": str(uuid.uuid4()),
        "district_id": str(uuid.uuid4()),
    }
    client.post("/auth/register", json=payload)
    login = client.post("/auth/login", json={"email": email, "password": payload["password"]})
    return login.json()["access_token"]


def test_profile_get_and_update(client):
    token = _token(client, "USER")

    me = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["role"] == "USER"

    updated = client.patch(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"},
        json={"full_name": "Updated Name", "phone": "+91-9999999999"},
    )
    assert updated.status_code == 200
    assert updated.json()["full_name"] == "Updated Name"
