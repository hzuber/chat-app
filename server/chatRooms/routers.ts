import express from "express";
import {
  getAll,
  getById,
  remove,
  update,
  create,
  getOrCreateChat,
  addUserToChat,
  getOrCreatePrivateChat,
} from "./utils.js";
import { getMessagesByChat } from "server/messages/utils.js";

const router = express.Router();

// Get all chats
router.get("", async (req, res) => {
  const chats = await getAll();
  res.json(chats);
});

// Get chat by ID
router.get("/:id", async (req, res) => {
  //console.log("chat server route", req.params);
  const chat = await getById(req.params.id);
  if (!chat) {
    return res.status(404).json({ chat: "Chat not found" });
  }

  res.json(chat);
});

// Get message by ID
router.get("/:id/messages", async (req, res) => {
  const messages = await getMessagesByChat(req.params.id);

  if (!messages) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(messages);
});

// Create a new chat
router.post("", async (req, res) => {
  const newChat = await create(req.body);
  //console.log("newChat is", newChat);
  res.status(201).json(newChat);
});

router.post("/:chatId/join", async (req, res) => {
  const { chatId } = req.params;
  const { userId } = req.body;

  try {
    // Get or create the chat
    const chat = await getOrCreateChat(chatId);

    // Add the user to the chat
    await addUserToChat(chatId, userId);
    //console.log("server", chat);
    return res.status(200).json(chat);
  } catch (error) {
    //console.error("Error joining chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/private", async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Get or create the chat
    const chat = await getOrCreatePrivateChat(userId1, userId2);
    return res.status(200).json(chat);
  } catch (error) {
    //console.error("Error joining chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update chat by ID
// Update any chat field (e.g., title, description)
router.put("/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { field, value } = req.body;

  if (!field || !value || !chatId) {
    return res
      .status(400)
      .json({ error: "Chat ID, field, and value are required" });
  }

  try {
    // Update the specified field in the database
    const updatedChat = await update(chatId, field, value);

    if (updatedChat) {
      res.status(200).json(updatedChat);
    } else {
      res.status(404).json({ error: "Chat not found" });
    }
  } catch (error) {
    //console.error(`Error updating chat ${field}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete chat by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await remove(id);
    res.json({ message: "chat deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred when creating a project";

    res.status(404).json({ message: errorMessage });
  }
});

export default router;
