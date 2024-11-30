from fastapi.testclient import TestClient

from app.core.config import settings
from app.models import User


def test_get_access_token(client: TestClient, simple_user: User) -> None:
    login_data = {
        "username": simple_user.email,
        "password": "simple-password",
    }
    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    tokens = r.json()
    assert r.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]


def test_get_access_token_incorrect_password(
    client: TestClient, simple_user: User
) -> None:
    login_data = {
        "username": simple_user.email,
        "password": "incorrect",
    }
    r = client.post(f"{settings.API_V1_STR}/login/access-token", data=login_data)
    assert r.status_code == 400
