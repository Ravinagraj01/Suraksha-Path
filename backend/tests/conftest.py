import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./test_disaster.db"
os.environ["SECRET_KEY"] = "test-secret"
os.environ["UPLOAD_DIR"] = "test_uploads"

db_file = Path("test_disaster.db")
if db_file.exists():
    db_file.unlink()

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
