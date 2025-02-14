import { io } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(SOCKET_SERVER_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("🟢 Connected to WebSocket Server: ", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Disconnected from WebSocket Server");
});
