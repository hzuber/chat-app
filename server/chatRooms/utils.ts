import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Chat } from "types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "db.chats.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");

    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

async function writeDB(Chat: Chat) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(Chat, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

export async function getAll() {
  return await readDB();
}

export async function getById(id: string) {
  const db = await readDB();
  return db.find((chat: Chat) => chat.id === id);
}

export async function getOrCreateChat(chatId: string): Promise<Chat> {
  const db = await readDB();
  const chat = db.find((chat: Chat) => chat.id === chatId);

  if (!chat) {
    const newChat: Chat = {
      ...chat,
      title: null,
    };
    await create(newChat);
  }
  return chat;
}

export async function getOrCreatePrivateChat(
  userId1: string,
  userId2: string
): Promise<Chat> {
  const db = await readDB();

  let chat = db.find(
    (chat: Chat) =>
      chat.type === "private" &&
      chat.members?.includes(userId1) &&
      chat.members.includes(userId2)
  );

  if (!chat) {
    chat = {
      members: [userId1, userId2],
      title: null,
      type: "private",
      messages: [],
    };
    await create(chat);
  }
  return chat;
}

export async function create(chat: Chat) {
  const db = await readDB();
  const lastDb: Chat = db.length > 0 ? db[db.length - 1] : null;
  const newId: number = lastDb ? parseInt(lastDb.id) + 1 : 1;
  const newChat: Chat = {
    ...chat,
    id: chat.id ? chat.id : newId.toString(),
  };
  db.push(newChat);
  await writeDB(db);
  const res: Chat = newChat;
  return res;
}

export async function update(chatId: string, field: string, value: string) {
  const db = await readDB();
  const chat = db.find((chat: Chat) => chat.id === chatId);
  if (!chat) {
    return null;
  }
  chat[field] = value;
  await writeDB(db);
  return chat;
}

export async function addUserToChat(chatId: string, userId: string) {
  const db = await readDB();
  const chat = db.find((chat: Chat) => chat.id === chatId);
  if (!chat) {
    return null;
  }
  if (!chat.members.includes(userId)) {
    chat.members.push(userId);
    await writeDB(db);
  }

  return chat;
}

export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((chat: Chat) => chat.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
