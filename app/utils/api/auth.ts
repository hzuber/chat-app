import { User, UserResponse } from "types";
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<UserResponse> {
  const response = await fetch(`/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  console.log(username, email, password, response);

  if (!response.ok) {
    throw new Error("Registration failed");
  }
  console.log(response);

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
    // body: JSON.stringify({ id }),
  });
  console.log("token", token, response);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  console.log(token, response, data);
  return data.user;
}
