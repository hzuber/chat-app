import { Server } from "socket.io";

const createSocketServer = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  // const ns2 = io.of("/ns2");

  // ns2.on("connection", (socket) => {
  //   console.log("ns2 connected", socket.id);
  //   socket.emit("message", `Welcome to ns2 ${socket.id}`);
  // });

  io.on("connection", (socket) => {
    console.log(`A user connected ${socket.id}`);

    // socket.on("message", (msg) => {
    //   console.log("server got a message ", msg);

    //   socket.emit("message", msg);
    // });

    // Handle joining a room
    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`${userId} joined room: ${roomId}`);
    });

    // Handle sending a message
    socket.on("send-message", ({ roomId, userId, message }) => {
      const newMessage = {
        userId,
        roomId,
        message,
        date: new Date(),
        read: false,
      };

      // Emit the message to the room
      io.to(roomId).emit("receive-message", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`user disconnected ${socket.id}`);
    });
  });
};
export default createSocketServer;
