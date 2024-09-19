import express from "express";
import { getAll, getById, remove, update, create } from "../db.js";

const router = express.Router();

// Get all users
router.get("", async (req, res) => {
  const users = await getAll();
  res.json(users);
});

// Get user by ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await getById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Create a new user
router.post("", async (req, res) => {
  const newUser = await create(req.body);
  res.status(201).json(newUser);
});

// Update user by ID
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const updatedUser = await update(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await remove(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
