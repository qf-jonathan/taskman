export type Credentials = {
  username: string;
  password: string;
};

export type UserBase = {
  email: string;
  fullName?: string;
};

export type UserCreate = UserBase & {
  password: string;
};

export type UserRegister = {
  email: string;
  password: string;
  fullName?: string;
};

export type UserUpdate = Partial<UserBase> & {
  email?: string;
  password?: string;
};

export type UpdatePassword = {
  currentPassword: string;
  newPassword: string;
};

export type User = UserBase & {
  id?: number;
  hashedPassword: string;
  tasks: Task[];
};

export type UserPublic = UserBase & {
  id: number;
};

export enum TaskStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
}

export type TaskBase = {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
};

export type TaskCreate = TaskBase;

export type TaskUpdate = Partial<TaskBase>;

export type Task = TaskBase & {
  id?: number;
  ownerId: number;
  owner: User;
};

export type TaskPublic = TaskBase & {
  id: number;
  ownerId: number;
};

export type TasksPublic = {
  data: TaskPublic[];
  count: number;
};

export type Message = {
  message: string;
};

export type Token = {
  accessToken: string;
  tokenType: string;
};

export type TokenPayload = {
  sub?: string;
};

export type NewPassword = {
  token: string;
  newPassword: string;
};
