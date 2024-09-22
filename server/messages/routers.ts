import express from "express";
import { getAll, getById, remove, update, create, markRead } from "./utils";
const router = express.Router();

router.get("", async (req, res) => {
  const messages = await getAll();
  res.json(messages);
});

router.get("/:id", async (req, res) => {
  const message = await getById(req.params.id);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  res.json(message);
});

router.post("", async (req, res) => {
  const newMessage = await create(req.body);
  res.status(201).json(newMessage);
  return newMessage;
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedMessage = await update(id, req.body);
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
    res.json(updatedMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred when creating a project";
    res.status(404).json({ message: errorMessage });
  }
});

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
