import express from "express";
import { getAll, getById, remove, update, create, markRead } from "./utils";
import { getChat } from "~/utils/api/chats";

const router = express.Router();

// Get all messages
router.get("", async (req, res) => {
  const messages = await getAll();
  res.json(messages);
});

// Get message by ID
router.get("/:id", async (req, res) => {
  const message = await getById(req.params.id);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
});

// Create a new message
router.post("", async (req, res) => {
  const newMessage = await create(req.body);
  //console.log("newmessage is", newMessage);
  res.status(201).json(newMessage);
  return newMessage;
});

// Update message by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedMessage = await update(id, req.body);
    console.log("put ", id, req.body);
    res.json(updatedMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred when creating a project";
    res.status(404).json({ message: errorMessage });
  }
});

router.put("/read/:messageid/:chatid", async (req, res) => {
  const messageId = req.params.messageid;
  const chatId = req.params.chatid;

  try {
    const updatedMessage = await markRead(messageId, chatId);
    console.log("put ", messageId, req.body);
    res.json(updatedMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred when creating a project";
    res.status(404).json({ message: errorMessage });
  }
});

// Delete message by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await remove(id);
    res.json({ message: "message deleted successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred when creating a project";

    res.status(404).json({ message: errorMessage });
  }
});

export default router;
