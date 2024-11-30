from sqlmodel import Session

from app import crud
from app.models import Task, TaskCreate
from app.tests.utils.utils import random_lower_string


def create_random_task(db: Session, owner_id: int | None) -> Task:
    assert owner_id is not None
    title = random_lower_string()
    description = random_lower_string()
    task_in = TaskCreate(title=title, description=description)
    return crud.create_task(session=db, task_in=task_in, owner_id=owner_id)
