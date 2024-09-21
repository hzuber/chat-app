import { getById as getUserById } from "server/users/utils";
import { User, Message } from "types";

const apiRoute = "http://localhost:3000/api/messages";

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

export async function getMessagesByChat(chatId: string) {
  console.log("getMessagesByChat", chatId);
  const response = await fetch(
    `http://localhost:3000/api/chats/${chatId}/messages`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
  user: User | null
): Promise<Message> {
  const date = Date.now();
  //   const user = await getUserById(userId);
  const response = await fetch(apiRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, userId, chatId, read, message, user }),
  });
  console.log(date, userId, chatId, read, message, response);

  if (!response.ok) {
    throw new Error("Create Message failed");
  }
  console.log(response);

  return response.json();
}
