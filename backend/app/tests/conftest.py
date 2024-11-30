from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine

from app import crud
from app.api.deps import get_db
from app.core.config import settings
from app.main import app
from app.models import SQLModel, User, UserCreate  # type: ignore
from app.tests.utils.user import create_random_user, get_token_headers_from_user

test_engine = create_engine(str(settings.SQLALCHEMY_TEST_DATABASE_URI))


def get_test_session(rollback: bool = False) -> Generator[Session, None, None]:
    with Session(test_engine) as session:
        yield session
        if rollback:
            session.rollback()


def override_get_db() -> Generator[Session, None, None]:
    yield from get_test_session()


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> Generator[None, None, None]:
    SQLModel.metadata.create_all(bind=test_engine)
    yield
    SQLModel.metadata.drop_all(bind=test_engine)


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    yield from get_test_session(rollback=True)


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture(scope="module")
def simple_user() -> User:
    email = "test@example.com"
    with Session(test_engine) as session:
        user = crud.get_user_by_email(session=session, email=email)
        if user:
            return user
        return crud.create_user(
            session,
            UserCreate(
                email="test@example.com",
                full_name="simple user",
                password="simple-password",
            ),
        )


@pytest.fixture(scope="function")
def random_user() -> tuple[User, str]:
    with Session(test_engine) as session:
        return create_random_user(session)


@pytest.fixture(scope="module")
def simple_user_token_headers(simple_user: User) -> dict[str, str]:
    return get_token_headers_from_user(simple_user)
