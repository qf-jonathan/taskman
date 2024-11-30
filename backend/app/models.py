from datetime import datetime
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    tasks: list["Task"] = Relationship(back_populates="owner", cascade_delete=True)


class UserPublic(UserBase):
    id: int


class TaskStatus(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"


class TaskBase(SQLModel):
    title: str = Field(max_length=255)
    description: str = Field(default="", max_length=1000)
    status: TaskStatus = Field(default=TaskStatus.NEW)
    due_date: datetime = Field(default_factory=datetime.now)


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, max_length=255)  # type: ignore
    description: str | None = Field(default=None, max_length=1000)  # type: ignore
    status: TaskStatus | None = Field(default=None)  # type: ignore
    due_date: datetime | None = Field(default=None)  # type: ignore


class Task(TaskBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User = Relationship(back_populates="tasks")


class TaskPublic(TaskBase):
    id: int
    owner_id: int


class TasksPublic(SQLModel):
    data: list[TaskPublic]
    count: int


class Message(SQLModel):
    message: str


class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
