import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Chat, Message } from "types";
// import { getMessagesByChat as getMessageHistory } from "../chatRooms/utils";

// Path to the JSON "database"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../chatRooms/db.chats.json");

// Define a User type to represent the data structure

// Function to read the JSON file and parse the data
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    //console.log("read db", data);
    return JSON.parse(data);
  } catch (err) {
    //console.error("Error reading database:", err);
    return [];
  }
}

// Function to write the data back to the JSON file
async function writeDB(message: Message) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(message, null, 2), "utf-8");
  } catch (err) {
    //console.error("Error writing to database:", err);
  }
}

// CRUD Operations

// Get all records
export async function getAll() {
  const chats: Chat[] = await readDB();
  const messages: Message[] = [];
  chats.map((c) => c.messages && messages.push(...c.messages));
  return messages;
}

// Get a record by ID
export async function getById(id: string) {
  const messages = await getAll();
  return messages.find((message: Message) => message.id === id);
}
// Get a record by ChatRoom ID
export async function getMessagesByChat(chatId: string): Promise<Message[]> {
  const all = await getAll(); // Assuming `readDB()` reads your database
  const messages = all.filter((message: Message) => message.chatId === chatId);

  if (!messages) {
    return []; // Assuming `writeDB()` writes the updated DB
  }

  return messages;
}

export async function addMessageToChat(message: Message) {
  //console.log("add message to chat 1", message);
  const db = await readDB();
  const chat: Chat = db.find((msg: Message) => msg.id === message.chatId);

  if (!chat) {
    return null;
  }
  //console.log("add message to chat 2", message);
  if (!chat.messages) {
    //console.log("!chat.messages");
    chat.messages = [message];
  } else if (!chat.messages.includes(message)) {
    chat.messages.push(message); // Add user to the chat
    chat.lastRead = message;
    // console.log("add last read to chat", chat.lastRead);
    await writeDB(db); // Save the changes
  }

  return message;
}

// Create a new record
export async function create(message: Message) {
  const messages = await getAll();
  const lastDb: Message | null =
    messages.length > 0 ? messages[messages.length - 1] : null;
  const newId: number = lastDb ? parseInt(lastDb.id) + 1 : 1;

  const newMessage: Message = {
    ...message,
    id: newId.toString(),
  };
  console.log("create message in the db", newMessage);

  // messages.push(newMessage);
  const response = await addMessageToChat(newMessage);
  if (response) return response;
  else return null;
}

// Update a record by ID
export async function markRead(messageId: string, chatId: string) {
  const allChats = await readDB();
  const chatIndex = allChats.findIndex((chat: Chat) => chat.id === chatId);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  const messageIndex = allChats[chatIndex].messages.findIndex(
    (message: Message) => message.id === messageId
  );
  console.log("messageIndex", chatIndex, messageIndex);
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }

  allChats[chatIndex].messages[messageIndex].read = true;

  await writeDB(allChats);

  return allChats[chatIndex].messages[messageIndex];
}

// Update a record by ID
export async function update(id: string, updatedData: Partial<Message>) {
  const allChats = await readDB();
  const chatIndex = allChats.findIndex((chat: Chat) => chat.id === id);

  if (chatIndex === -1) {
    throw new Error("Chat not found");
  }

  const messageIndex = allChats[chatIndex].messages.findIndex(
    (message: Message) => message.id === updatedData.id
  );
  console.log("messageIndex", chatIndex, messageIndex, updatedData);
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

// Delete a record by ID
export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((message: Message) => message.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
