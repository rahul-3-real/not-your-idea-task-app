import { Server } from "socket.io";

let ioInstance = null;

// Function to initialize Socket.io
export const initSocketIo = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

// Function to get the existing Socket.io instance
export const getSocketIo = () => {
  if (!ioInstance) {
    console.warn("⚠️ Warning: Socket.io has not been initialized!");
    return null; // Instead of throwing an error, return null
  }
  return ioInstance;
};
