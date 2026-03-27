import io
import uuid


def _register_and_login(client, role="USER"):
    email = f"{role.lower()}_{uuid.uuid4()}@example.com"
    payload = {
        "full_name": f"{role} Tester",
        "email": email,
        "password": "password123",
        "role": role,
        "state_id": str(uuid.uuid4()),
        "district_id": str(uuid.uuid4()),
    }
    client.post("/auth/register", json=payload)
    login = client.post("/auth/login", json={"email": email, "password": payload["password"]})
    token = login.json()["access_token"]
    return token, payload["state_id"], payload["district_id"]


def test_damage_upload_and_visibility(client):
    admin_token, state_id, district_id = _register_and_login(client, "ADMIN")
    user1_token, _, _ = _register_and_login(client, "USER")
    user2_token, _, _ = _register_and_login(client, "USER")

    file_data = io.BytesIO(b"fake image bytes")
    create = client.post(
        "/damage-reports",
        headers={"Authorization": f"Bearer {user1_token}"},
        data={
            "state_id": state_id,
            "district_id": district_id,
            "title": "Flooded house",
            "description": "Ground floor damaged by flood water",
            "latitude": "20.56",
            "longitude": "78.93",
        },
        files=[("files", ("flood.jpg", file_data, "image/jpeg"))],
    )
    assert create.status_code == 200
    assert len(create.json()["evidence_urls"]) == 1

    admin_list = client.get("/damage-reports", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_list.status_code == 200
    assert len(admin_list.json()) >= 1

    user1_list = client.get("/damage-reports", headers={"Authorization": f"Bearer {user1_token}"})
    assert user1_list.status_code == 200
    assert len(user1_list.json()) == 1

    user2_list = client.get("/damage-reports", headers={"Authorization": f"Bearer {user2_token}"})
    assert user2_list.status_code == 200
    assert len(user2_list.json()) == 0


def test_volunteer_creation_and_admin_update(client):
    admin_token, state_id, district_id = _register_and_login(client, "ADMIN")
    user_token, _, _ = _register_and_login(client, "USER")

    create = client.post(
        "/volunteers",
        headers={"Authorization": f"Bearer {user_token}"},
        json={
            "state_id": state_id,
            "district_id": district_id,
            "full_name": "Volunteer One",
            "phone": "+91-9000000000",
            "skills": ["first_aid", "logistics"],
            "availability": "weekends",
            "latitude": 20.6,
            "longitude": 78.9,
        },
    )
    assert create.status_code == 200
    volunteer_id = create.json()["id"]

    user_list = client.get("/volunteers", headers={"Authorization": f"Bearer {user_token}"})
    assert user_list.status_code == 200
    assert len(user_list.json()) == 1

    admin_update = client.patch(
        f"/volunteers/{volunteer_id}/status",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"status": "approved", "assigned_task": "Shelter intake support"},
    )
    assert admin_update.status_code == 200
    assert admin_update.json()["status"] == "approved"
