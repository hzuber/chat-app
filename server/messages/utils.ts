import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Chat, Message } from "types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../chatRooms/db.chats.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeDB(message: Message) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(message, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

export async function getAll() {
  const chats: Chat[] = await readDB();
  const messages: Message[] = [];
  chats.map((c) => c.messages && messages.push(...c.messages));
  return messages;
}

export async function getById(id: string) {
  const messages = await getAll();
  return messages.find((message: Message) => message.id === id);
}

export async function getMessagesByChat(chatId: string): Promise<Message[]> {
  const all = await getAll();
  const messages = all.filter((message: Message) => message.chatId === chatId);

  if (!messages) {
    return [];
  }

  return messages;
}

export async function addMessageToChat(message: Message) {
  const db = await readDB();
  const chat: Chat = db.find((chat: Chat) => chat.id === message.chatId);
  if (!chat) {
    return null;
  }
  if (!chat.messages) {
    chat.messages = [message];
  } else if (!chat.messages.includes(message)) {
    chat.messages.push(message);
    chat.lastRead = message;
    await writeDB(db);
  }

  return message;
}

export async function create(message: Message) {
  const messages = await getAll();
  const lastDb: Message | null =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const newId: number = lastDb ? parseInt(lastDb.id) + 1 : 1;

  const newMessage: Message = {
    ...message,
    id: newId.toString(),
  };

  const response = await addMessageToChat(newMessage);
  if (response) return response;
  else return null;
}

export async function markRead(messageId: string, chatId: string) {
  const allChats = await readDB();
  const chatIndex = allChats.findIndex((chat: Chat) => chat.id === chatId);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  const messageIndex = allChats[chatIndex].messages.findIndex(
    (message: Message) => message.id === messageId
  );
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }

  allChats[chatIndex].messages[messageIndex].read = true;

  await writeDB(allChats);

  return allChats[chatIndex].messages[messageIndex];
}

export async function update(id: string, updatedData: Partial<Message>) {
  const allChats = await readDB();
  const chatIndex = allChats.findIndex((chat: Chat) => chat.id === id);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  const messageIndex = allChats[chatIndex].messages.findIndex(
    (message: Message) => message.id === updatedData.id
  );
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }

  allChats[chatIndex].messages[messageIndex] = {
    ...allChats[chatIndex].messages[messageIndex],
    ...updatedData,
  };

  await writeDB(allChats);

  return allChats[chatIndex].messages[messageIndex];
}

export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((message: Message) => message.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
