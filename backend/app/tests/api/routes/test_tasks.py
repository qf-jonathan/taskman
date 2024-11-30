from fastapi.testclient import TestClient
from sqlmodel import Session

from app.core.config import settings
from app.models import User
from app.tests.utils.task import create_random_task


def test_create_task(
    client: TestClient, simple_user_token_headers: dict[str, str]
) -> None:
    data = {"title": "Foo", "description": "Fighters"}
    response = client.post(
        f"{settings.API_V1_STR}/tasks/",
        headers=simple_user_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert "id" in content
    assert "owner_id" in content


def test_read_task(
    client: TestClient,
    simple_user: User,
    simple_user_token_headers: dict[str, str],
    db: Session,
) -> None:
    task = create_random_task(db, simple_user.id)
    response = client.get(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=simple_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == task.title
    assert content["description"] == task.description
    assert content["id"] == task.id
    assert content["owner_id"] == task.owner_id


def test_read_task_not_found(
    client: TestClient, simple_user_token_headers: dict[str, str]
) -> None:
    response = client.get(
        f"{settings.API_V1_STR}/tasks/0",
        headers=simple_user_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"


def test_read_tasks(
    client: TestClient,
    simple_user: User,
    simple_user_token_headers: dict[str, str],
    db: Session,
) -> None:
    create_random_task(db, simple_user.id)
    create_random_task(db, simple_user.id)
    response = client.get(
        f"{settings.API_V1_STR}/tasks/",
        headers=simple_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert len(content["data"]) >= 2


def test_update_task(
    client: TestClient,
    simple_user: User,
    simple_user_token_headers: dict[str, str],
    db: Session,
) -> None:
    task = create_random_task(db, simple_user.id)
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=simple_user_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["id"] == task.id
    assert content["owner_id"] == task.owner_id


def test_update_task_not_found(
    client: TestClient, simple_user_token_headers: dict[str, str]
) -> None:
    data = {"title": "Updated title", "description": "Updated description"}
    response = client.put(
        f"{settings.API_V1_STR}/tasks/0",
        headers=simple_user_token_headers,
        json=data,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"


def test_delete_task(
    client: TestClient,
    simple_user: User,
    simple_user_token_headers: dict[str, str],
    db: Session,
) -> None:
    task = create_random_task(db, simple_user.id)
    response = client.delete(
        f"{settings.API_V1_STR}/tasks/{task.id}",
        headers=simple_user_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["message"] == "Task deleted successfully"


def test_delete_task_not_found(
    client: TestClient, simple_user_token_headers: dict[str, str]
) -> None:
    response = client.delete(
        f"{settings.API_V1_STR}/tasks/0",
        headers=simple_user_token_headers,
    )
    assert response.status_code == 404
    content = response.json()
    assert content["detail"] == "Task not found"
