import { v4 as uuidv4 } from "uuid";
import { User, Message } from "types";

const port = import.meta.env.VITE_PORT || 3000;
const apiRoute = `http://localhost:${port}/api/chats`;

export async function getMessages() {
  const response = await fetch(apiRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  const data: Message[] = await response.json();
  return data;
}

export async function getMessageByUuid(uuid: string) {
  const response = await fetch(apiRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Registration failed");
  }
  const data: Message[] = await response.json();
  if (data) {
    const message = data.find((d) => d.uuid === uuid);
    if (message) {
      return message;
    } else {
      return null;
    }
  }
}

export async function getMessagesByChat(chatId: string) {
  const response = await fetch(`${apiRoute}/${chatId}/messages`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return [];
  }
  const data: Message[] = await response.json();
  return data;
}

export async function createMessage(
  chatId: string,
  userId: string,
  read: boolean | null,
  message: string,
  uuid: string | null,
  user: User | null
): Promise<Message | null> {
  const date = Date.now();
  const getUuid = uuid ? uuid : uuidv4();
  const response = await fetch(apiRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date,
      userId,
      chatId,
      read,
      message,
      user,
      uuid: getUuid,
    }),
  });

  if (!response.ok) {
    return null;
  }
  const data = await response.json();

  return data;
}

export async function markMessageRead(
  messageId: string,
  chatId: string
): Promise<Message | null> {
  const response = await fetch(`${apiRoute}/read/${messageId}/${chatId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, messageId, read: true }),
  });

  if (!response || !response.ok) {
    return null;
  }
  const message = await response.json();

  return message;
}
