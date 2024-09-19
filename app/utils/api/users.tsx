import { User, CreateUser, UserResponse } from "types";
import { hashPassword } from "../bcrypt";
import { createToken } from "../jwt";

export async function getUsers() {
  try {
    const response = await fetch("/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    const data: User[] = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export async function createUser(user: CreateUser) {
  const hashedPassword = await hashPassword(user.password);
  const newUser: CreateUser = {
    ...user,
    password: hashedPassword,
  };
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    console.log(data);
    // const res: UserResponse = { user: data,  };
    return data;
  } catch (err) {
    console.log(err);
  }
}
