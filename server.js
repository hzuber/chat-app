import { createServer } from "http";
import { configDotenv } from "dotenv";
import { createRequestHandler } from "@remix-run/express";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import createSocketServer from "./socket-io.js";
import userRoutes from "./app/database/utils/users.js";
import { getAll } from "./app/database/db.js";

configDotenv();

const viteDevServer =
  //   import.meta.env.VITE_NODE_ENV === "production"
  //     ? undefined
  //     : await import("vite").then((vite) =>
  //         vite.createServer({
  //           server: { middlewareMode: true },
  //         })
  //       );

  await import("vite").then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    })
  );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
    : await import("./build/server/index.js"),
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const socket_port = 3002;
const server = app.listen(socket_port, function () {
  console.log("server running on port ", socket_port);
});
createSocketServer(server);

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.emit("confirmation", "connected!");

  socket.on("event", (data) => {
    console.log(socket.id, data);
    socket.emit("event", "pong");
  });
});

app.use(compression());

app.disable("x-powered-by");

if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}

app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use("/api/users", userRoutes);

app.all("*", remixHandler);

const port = 3000;

httpServer.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
