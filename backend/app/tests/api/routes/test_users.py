from fastapi.testclient import TestClient
from sqlmodel import Session, select

from app import crud
from app.core.config import settings
from app.core.security import verify_password
from app.models import User
from app.tests.utils.user import create_random_user, get_token_headers_from_user
from app.tests.utils.utils import random_email, random_lower_string


def test_get_user_me(client: TestClient, simple_user: User) -> None:
    r = client.get(
        f"{settings.API_V1_STR}/users/me",
        headers=get_token_headers_from_user(simple_user),
    )
    current_user = r.json()
    assert current_user
    assert current_user["email"] == "test@example.com"


def test_get_existing_user_current_user(
    client: TestClient, simple_user: User, db: Session
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/users/me",
        headers=get_token_headers_from_user(simple_user),
    )
    assert 200 <= response.status_code < 300
    api_user = response.json()
    existing_user = crud.get_user_by_email(session=db, email=simple_user.email)
    assert existing_user
    assert existing_user.email == api_user["email"]


def test_create_user_existing_username(client: TestClient, simple_user: User) -> None:
    data = {"email": simple_user.email, "password": "test-password"}
    response = client.post(
        f"{settings.API_V1_STR}/users/signup",
        json=data,
    )
    assert response.status_code == 400


def test_update_password_me(
    client: TestClient, random_user: tuple[User, str], db: Session
) -> None:
    user, current_password = random_user
    new_password = random_lower_string()
    data = {
        "current_password": current_password,
        "new_password": new_password,
    }
    r = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=get_token_headers_from_user(user),
        json=data,
    )
    assert r.status_code == 200
    updated_user = r.json()
    assert updated_user["message"] == "Password updated successfully"

    user_query = select(User).where(User.email == user.email)
    user_db = db.exec(user_query).first()
    assert user_db
    assert user_db.email == user.email
    assert verify_password(new_password, user_db.hashed_password)


def test_update_password_me_incorrect_password(
    client: TestClient, random_user: tuple[User, str]
) -> None:
    user, _ = random_user
    new_password = random_lower_string()
    data = {"current_password": new_password, "new_password": new_password}
    r = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=get_token_headers_from_user(user),
        json=data,
    )
    assert r.status_code == 400
    updated_user = r.json()
    assert updated_user["detail"] == "Incorrect password"


def test_update_user_me(
    client: TestClient, simple_user: User, random_user: tuple[User, str]
) -> None:
    user, _ = random_user
    data = {"email": simple_user.email}
    r = client.patch(
        f"{settings.API_V1_STR}/users/me",
        headers=get_token_headers_from_user(user),
        json=data,
    )
    assert r.status_code == 409
    assert r.json()["detail"] == "User with this email already exists"


def test_update_password_me_same_password_error(
    client: TestClient, random_user: tuple[User, str]
) -> None:
    user, current_password = random_user
    data = {
        "current_password": current_password,
        "new_password": current_password,
    }
    r = client.patch(
        f"{settings.API_V1_STR}/users/me/password",
        headers=get_token_headers_from_user(user),
        json=data,
    )
    assert r.status_code == 400
    updated_user = r.json()
    assert (
        updated_user["detail"] == "New password cannot be the same as the current one"
    )


def test_register_user(client: TestClient, db: Session) -> None:
    username = random_email()
    password = random_lower_string()
    full_name = random_lower_string()
    data = {"email": username, "password": password, "full_name": full_name}
    r = client.post(
        f"{settings.API_V1_STR}/users/signup",
        json=data,
    )
    assert r.status_code == 200
    created_user = r.json()
    assert created_user["email"] == username
    assert created_user["full_name"] == full_name

    user_query = select(User).where(User.email == username)
    user_db = db.exec(user_query).first()
    assert user_db
    assert user_db.email == username
    assert user_db.full_name == full_name
    assert verify_password(password, user_db.hashed_password)


def test_register_user_already_exists_error(
    client: TestClient, random_user: tuple[User, str]
) -> None:
    user, password = random_user
    data = {
        "email": user.email,
        "password": password,
        "full_name": "test full name",
    }
    r = client.post(
        f"{settings.API_V1_STR}/users/signup",
        json=data,
    )
    assert r.status_code == 400
    assert r.json()["detail"] == "The user with this email already exists in the system"


def test_update_user_email_exists(
    client: TestClient, random_user: tuple[User, str], db: Session
) -> None:
    user_1, _ = random_user
    user_2, _ = create_random_user(db)

    data = {"email": user_2.email}
    r = client.patch(
        f"{settings.API_V1_STR}/users/me",
        headers=get_token_headers_from_user(user_1),
        json=data,
    )
    assert r.status_code == 409
    assert r.json()["detail"] == "User with this email already exists"


def test_delete_user_me(
    client: TestClient, random_user: tuple[User, str], db: Session
) -> None:
    user, _ = random_user
    response = client.delete(
        f"{settings.API_V1_STR}/users/me",
        headers=get_token_headers_from_user(user),
    )
    assert response.status_code == 200
    deleted_user = response.json()
    assert deleted_user["message"] == "User deleted successfully"
    result = db.exec(select(User).where(User.id == user.id)).first()
    assert result is None
