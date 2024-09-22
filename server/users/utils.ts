import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { User, CreateUser, UserResponse } from "types";
import { createToken } from "../auth/jwt.server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "db.users.json");

async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database:", err);
    return [];
  }
}

async function writeDB(user: User) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(user, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

export async function getAll() {
  const users: User[] = await readDB();
  return users;
}

export async function getById(id: string) {
  const db = await readDB();
  return db.find((user: User) => user.id === id);
}

export async function getByEmail(email: string) {
  const db = await readDB();
  return db.find((user: User) => user.email === email);
}

export async function create(user: CreateUser) {
  const db = await getAll();
  const lastDb: User | null = db && db.length > 0 ? db[db.length - 1] : null;
  const newId: number = !lastDb ? 1 : parseInt(lastDb.id) + 1;
  const newUser: User = {
    ...user,
    id: newId.toString(),
  };
  await writeDB(newUser);
  const token = createToken(newUser);
  const res: UserResponse = { user: newUser, token, status: 200 };
  return res;
}

export async function update(id: string, updatedData: Partial<User>) {
  const db = await readDB();
  const index = db.findIndex((user: User) => user.id === id);

  if (index === -1) {
    throw new Error("User not found");
  }

  db[index] = { ...db[index], ...updatedData };
  await writeDB(db);
  return db[index];
}

export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((user: User) => user.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
