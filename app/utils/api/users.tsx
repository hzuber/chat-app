import { User } from "types";

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
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUserById(chatId: string) {
  const response = await fetch(`/api/users/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const data: User = await response.json();
  return data;
}
