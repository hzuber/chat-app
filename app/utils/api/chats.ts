import { Chat, User } from "types";

const apiRoute = "http://localhost:3000/api/chats";

export async function getChats() {
  try {
    const response = await fetch("/api/chats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    const data: Chat[] = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getChat(chatId: string) {
  const response = await fetch(`${apiRoute}/${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const data: Chat = await response.json();
  return data;
}

export async function createChat(
  chatId: string,
  members: User[] | null,
  description?: string | null,
  icon?: string | null
): Promise<Chat> {
  const response = await fetch(apiRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, members, description, icon }),
  });
  console.log(chatId, members, description, icon);

  if (!response.ok) {
    throw new Error("Create Chat failed");
  }
  console.log(response);

  return response.json();
}

export async function joinChat(chatId: string, userId: string) {
  try {
    console.log("join chat1");
    const response = await fetch(`/api/chats/${chatId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.log("join chat2");
      throw new Error("Failed to join chat");
    }

    const chatData = await response.json();
    console.log("join chat3", chatData);
    return chatData;
  } catch (error) {
    console.error("Error joining chat:", error);
  }
}

export async function fetchOrCreatePrivateChat(
  userId1: string,
  userId2: string
) {
  try {
    const response = await fetch(`/api/chats/private`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId1, userId2 }),
    });

    if (!response.ok) {
      console.log("private chat failed");
      //   throw new Error("Failed to join chat");
      return null;
    }
    console.log(response);
    const chatData = await response.json();
    console.log("private chat", chatData);
    return chatData;
  } catch (error) {
    console.error("Error joining chat:", error);
  }
}

export async function editChat(
  chatId: string,
  field: string,
  value: string
): Promise<Chat> {
  const response = await fetch(`/api/chats/${chatId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ field, value }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${field}`);
  }

  return response.json();
}
