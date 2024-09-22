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
      // const newMessage = {
      //   userId,
      //   chatId,
      //   message,
      //   date: new Date(),
      //   read: false,
      // };
      if (!chatId || !authId || !message || !uuid) {
        console.error(
          "Missing data for send-message event",
          chatId,
          authId,
          message,
          uuid
        );
        console.log(chatId, authId, message, uuid);
        return;
      }
      console.log("socket receive-message", chatId, authId, message, uuid);

      io.to(chatId).emit("receive-message", { chatId, authId, message, uuid });
    });

    socket.on("message_read", ({ messageId, chatId }) => {
      // const newMessage = {
      //   userId,
      //   chatId,
      //   message,
      //   date: new Date(),
      //   read: false,
      // };
      if (!chatId || !messageId) {
        console.error("Missing data for send-message event", messageId, chatId);
        console.log(messageId, chatId);
        return;
      }
      console.log("socket message_marked_read", messageId, chatId);

      io.to(chatId).emit("message_marked_read", { messageId, chatId });
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });
};
export default createSocketServer;
