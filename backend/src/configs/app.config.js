import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Imports
import UserRoutes from "../routes/user.routes.js";
import TaskRoutes from "../routes/task.routes.js";

const app = express();

// CORS Options
const corsOptions = {
  origin: process.env.CORS_OPTIONS.split(","),
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/tasks", TaskRoutes);

// Test Route
app.get("/api", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

export default app;
