import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { User, CreateUser, UserResponse } from "types";
import { createToken } from "../auth/jwt.server";

// Path to the JSON "database"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "db.users.json");

// Define a User type to represent the data structure

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
async function writeDB(user: User) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(user, null, 2), "utf-8");
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
  return db.find((user: User) => user.id === id);
}
// Get a record by ID
export async function getByEmail(email: string) {
  const db = await readDB();
  return db.find((user: User) => user.email === email);
}

// Create a new record
export async function create(user: CreateUser) {
  const db = await readDB();
  const lastDb: User = db.length > 0 ? db[db.length - 1] : 1;
  const newId: number = parseInt(lastDb.id) + 1;
  const newUser: User = {
    ...user,
    id: newId.toString(),
  };
  db.push(newUser);
  await writeDB(db);
  const token = createToken(newUser);
  const res: UserResponse = { user: newUser, token, status: 200 };
  console.log("function create", res, newUser, user);
  return res;
}

// Update a record by ID
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

// Delete a record by ID
export async function remove(id: string) {
  const db = await readDB();
  const filteredDB = db.filter((user: User) => user.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
