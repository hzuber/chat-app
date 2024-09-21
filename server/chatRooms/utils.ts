import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Chat, Message } from "types";

// Path to the JSON "database"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "db.chats.json");

// Function to read the JSON file and parse the data
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return [];
  }
}

// Function to write the data back to the JSON file
async function writeDB(Chat: Chat) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(Chat, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

// CRUD Operations

// Get all records
export async function getAll() {
  return await readDB();
}

// Get a record by ID
export async function getById(id: string) {
  const db = await readDB();
  return db.find((chat: Chat) => chat.id === id);
}

export async function getOrCreateChat(chatId: string): Promise<Chat> {
  const db = await readDB(); // Assuming `readDB()` reads your database
  const chat = db.find((chat: Chat) => chat.id === chatId);

  if (!chat) {
    // If chat doesn't exist, create a new one

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

  // Check if there's already a one-on-one chat between these two users
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
    };
    await create(chat);
  }
  return chat;
}

// Create a new record
export async function create(chat: Chat) {
  const db = await readDB();
  const lastDb: Chat = db.length > 0 ? db[db.length - 1] : 1;
  const newId: number = parseInt(lastDb.id) + 1;
  const newChat: Chat = {
    ...chat,
    id: newId.toString(),
  };
  db.push(newChat);
  await writeDB(db);
  const res: Chat = newChat;
  return res;
}

// Update a record by ID
export async function update(chatId: string, field: string, value: string) {
  const db = await readDB();
  const chat = db.find((chat: Chat) => chat.id === chatId);
  if (!chat) {
    return null; // Chat not found
  }

  // Dynamically update the specified field
  chat[field] = value;

  // Write the updated data back to the database
  await writeDB(db);

  return chat;
}

export async function addUserToChat(chatId: string, userId: string) {
  const db = await readDB();
  const chat = db.find((chat: Chat) => chat.id === chatId);

  if (!chat) {
    return null;
  }

  // Check if the user is already a member of the chat
  if (!chat.members.includes(userId)) {
    chat.members.push(userId); // Add user to the chat
    await writeDB(db); // Save the changes
  }

  return chat;
}

export async function addMessageToChat(message: Message) {
  const db = await readDB();
  const chat: Chat = db.find((msg: Message) => msg.id === message.chatId);

  if (!chat || !chat.messages) {
    return null;
  }

  if (!chat.messages.includes(message)) {
    chat.messages.push(message); // Add user to the chat
    chat.lastRead = message;
    await writeDB(db); // Save the changes
  }

  return message;
}

// Delete a record by ID
export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((chat: Chat) => chat.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
