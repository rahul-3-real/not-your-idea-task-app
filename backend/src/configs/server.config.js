import { createServer } from "http";

import app from "./app.config.js";
import { initSocketIo } from "../utils/socket.js";

const connectServer = () => {
  const PORT = process.env.PORT || 8000;
  const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
  const ENV = process.env.NODE_ENV || "dev"; // ["dev", "prod"]

  try {
    const appUrl = ENV === "dev" ? `http://localhost:${PORT}` : APP_URL;

    // Create an HTTP server
    const server = createServer(app);

    // Initialize Socket.io
    initSocketIo(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`😊 Server connected on ${appUrl}`);
    });

    return server;

    // const connection = app.listen(PORT, () => {
    //   console.log(`😊 Server connected on ${appUrl}`);
    // });
    // return connection;
  } catch (error) {
    console.log(`😒 Error connecting server :: ${error}`);
  }
};

export default connectServer;
