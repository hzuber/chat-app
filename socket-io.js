import { Server } from "socket.io";

const createSocketServer = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    socket.on("join-chat", ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on("send-message", ({ chatId, authId, message, uuid }) => {
      if (!chatId || !authId || !message || !uuid) {
        console.error(
          "Missing data for send-message event",
          chatId,
          authId,
          message,
          uuid
        );
        return;
      }
      io.to(chatId).emit("receive-message", { chatId, authId, message, uuid });
    });

    socket.on("message_read", ({ messageId, chatId }) => {
      if (!chatId || !messageId) {
        console.error("Missing data for send-message event", messageId, chatId);
        return;
      }
      io.to(chatId).emit("message_marked_read", { messageId, chatId });
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });
};
export default createSocketServer;
