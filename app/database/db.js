import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Path to the JSON "database"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = path.resolve(__dirname, "databases/db.users.json");

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
async function writeDB(data) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
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
export async function getById(id) {
  const db = await readDB();
  return db.find((user) => user.id === id);
}

// Create a new record
export async function create(data) {
  const db = await readDB();
  const newUser = {
    id: (db.length > 0 ? db[db.length - 1].id + 1 : 1).toString(), // Auto-increment the ID
    ...data,
  };
  db.push(newUser);
  await writeDB(db);
  return newUser;
}

// Update a record by ID
export async function update(id, updatedData) {
  const db = await readDB();
  const index = db.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error("User not found");
  }

  db[index] = { ...db[index], ...updatedData };
  await writeDB(db);
  return db[index];
}

// Delete a record by ID
export async function remove(id) {
  const db = await readDB();
  const filteredDB = db.filter((user) => user.id !== id);

  if (db.length === filteredDB.length) {
    throw new Error("User not found");
  }

  await writeDB(filteredDB);
  return id;
}
