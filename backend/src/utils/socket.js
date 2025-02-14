import { Server } from "socket.io";

let ioInstance = null;

export const initSocketIo = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`🔌 User Connected: ${socket.id}`);

    // Debug Event Emit
    socket.emit("test_event", { message: "Hello from server!" });

    socket.on("disconnect", () => {
      console.log(`🔴 User Disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getSocketIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized!");
  }
  return ioInstance;
};
