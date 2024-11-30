from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import Message, Task, TaskCreate, TaskPublic, TasksPublic, TaskUpdate

router = APIRouter()


@router.get("/")
def read_tasks(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> TasksPublic:
    """
    Retrieve tasks.
    """
    count_statement = (
        select(func.count()).select_from(Task).where(Task.owner_id == current_user.id)
    )
    count = session.exec(count_statement).one()
    statement = (
        select(Task).where(Task.owner_id == current_user.id).offset(skip).limit(limit)
    )
    tasks = session.exec(statement).all()

    return TasksPublic(data=tasks, count=count)


@router.get("/{id}", response_model=TaskPublic)
def read_task(session: SessionDep, current_user: CurrentUser, id: int) -> Any:
    """
    Get task by ID.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return task


@router.post("/", response_model=TaskPublic)
def create_task(
    session: SessionDep, current_user: CurrentUser, task_in: TaskCreate
) -> Any:
    """
    Create new task.
    """
    task = Task.model_validate(task_in, update={"owner_id": current_user.id})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.put("/{id}", response_model=TaskPublic)
def update_task(
    session: SessionDep,
    current_user: CurrentUser,
    id: int,
    task_in: TaskUpdate,
) -> Any:
    """
    Update an task.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    update_dict = task_in.model_dump(exclude_unset=True)
    task.sqlmodel_update(update_dict)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{id}")
def delete_task(session: SessionDep, current_user: CurrentUser, id: int) -> Message:
    """
    Delete an task.
    """
    task = session.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    session.delete(task)
    session.commit()
    return Message(message="Task deleted successfully")
