import { User } from "types";
import { deleteChat, getChats as getAllChats } from "~/utils/api/chats";

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

export async function deleteUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }

  const allChats = await getAllChats();
  allChats &&
    allChats.map(async (chat) => {
      if (chat.type === "private" && chat.members?.find((m) => m === userId)) {
        await deleteChat(chat.id);
      }
    });

  return response;
}
