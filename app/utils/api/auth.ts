import { User, UserResponse } from "types";
import bcrypt from "bcryptjs";

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<UserResponse> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await fetch(`/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password: hashedPassword }),
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  return response.json();
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserResponse> {
  const response = await fetch(`/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function validateToken(): Promise<User | null> {
  const token = localStorage.getItem("token");
  const response = await fetch(`/auth/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.user;
}
