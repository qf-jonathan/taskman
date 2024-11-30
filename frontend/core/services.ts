"use client";

import { apiClient } from "@/core/common";
import {
  Credentials,
  Message,
  TaskCreate,
  TaskPublic,
  TasksPublic,
  TaskUpdate,
  Token,
  UpdatePassword,
  UserPublic,
  UserRegister,
  UserUpdate,
} from "@/core/models";

export class LoginService {
  public static async login(data: Credentials): Promise<Token> {
    const formData = new URLSearchParams(data).toString();
    const response = await apiClient.post("/login/access-token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    localStorage.setItem("token", response.data.accessToken);
    return response.data;
  }

  public static async logout() {
    localStorage.removeItem("token");
  }
}

export class UserService {
  public static async signup(data: UserRegister): Promise<UserPublic> {
    const response = await apiClient.post("/users/signup", data);
    return response.data;
  }

  public static async changePassword(data: UpdatePassword): Promise<Message> {
    const response = await apiClient.patch("/users/me/password", data);
    return response.data;
  }

  public static async updateMe(data: UserUpdate): Promise<UserPublic> {
    const response = await apiClient.patch("/users/me", data);
    return response.data;
  }

  public static async getMe(): Promise<UserPublic> {
    const response = await apiClient.get("/users/me");
    return response.data;
  }

  public static async deleteMe(): Promise<Message> {
    const response = await apiClient.delete("/users/me");
    return response.data;
  }
}

export class TaskService {
  public static async getMany(
    skip: number = 0,
    limit: number = 20
  ): Promise<TasksPublic> {
    const response = await apiClient.get("/tasks", { params: { skip, limit } });
    return response.data;
  }

  public static async create(data: TaskCreate): Promise<TaskPublic> {
    const response = await apiClient.post("/tasks", data);
    return response.data;
  }

  public static async get(id: number): Promise<TaskPublic> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  }

  public static async update(
    id: number,
    data: TaskUpdate
  ): Promise<TaskPublic> {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response.data;
  }

  public static async delete(id: number): Promise<Message> {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  }
}
