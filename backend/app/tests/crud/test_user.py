from fastapi.encoders import jsonable_encoder
from sqlmodel import Session

from app import crud
from app.core.security import verify_password
from app.models import User, UserCreate, UserUpdate
from app.tests.utils.utils import random_email, random_lower_string


def test_create_user(db: Session) -> None:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.create_user(session=db, user_create=user_in)
    assert user.email == email
    assert hasattr(user, "hashed_password")


def test_authenticate_user(random_user: tuple[User, str], db: Session) -> None:
    user, password = random_user
    authenticated_user = crud.authenticate(
        session=db, email=user.email, password=password
    )
    assert authenticated_user
    assert user.email == authenticated_user.email


def test_not_authenticate_user(simple_user: User, db: Session) -> None:
    password = random_lower_string()
    user = crud.authenticate(session=db, email=simple_user.email, password=password)
    assert user is None


def test_get_user_by_email(simple_user: User, db: Session) -> None:
    user = crud.get_user_by_email(session=db, email=simple_user.email)
    assert user
    assert user.email == user.email
    assert jsonable_encoder(user) == jsonable_encoder(simple_user)


def test_update_user(random_user: tuple[User, str], db: Session) -> None:
    user, _ = random_user
    new_password = random_lower_string()
    user_in_update = UserUpdate(password=new_password)
    crud.update_user(session=db, db_user=user, user_in=user_in_update)
    user_db = db.get(User, user.id)
    assert user_db
    assert user.email == user_db.email
    assert verify_password(new_password, user_db.hashed_password)
