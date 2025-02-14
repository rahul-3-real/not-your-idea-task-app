import { Server } from "socket.io";

let ioInstance = null;

export const initSocketIo = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Debugging: Test if the frontend receives this event
    socket.emit("task_created", { _id: "test123", title: "Test Task" });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

// Emit events when a task is created, updated, or deleted
export const emitTaskEvent = (eventName, data) => {
  if (!ioInstance) {
    console.error("Socket.io not initialized!");
    return;
  }
  ioInstance.emit(eventName, data);
};

export const getSocketIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized!");
  }
  return ioInstance;
};
