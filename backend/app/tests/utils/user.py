from datetime import timedelta

from sqlmodel import Session

from app import crud
from app.core import security
from app.models import Token, User, UserCreate
from app.tests.utils.utils import random_email, random_lower_string


def create_random_user(db: Session) -> tuple[User, str]:
    email = random_email()
    password = random_lower_string()
    user_in = UserCreate(email=email, password=password)
    user = crud.create_user(session=db, user_create=user_in)
    return user, password


def get_token_headers_from_user(user: User) -> dict[str, str]:
    token = Token(
        access_token=security.create_access_token(
            user.id, expires_delta=timedelta(minutes=30)
        )
    )
    return {"Authorization": f"Bearer {token.access_token}"}
