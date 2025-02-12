import { Router } from "express";
import {
  createTaskController,
  taskDeleteController,
  taskDetailController,
  TaskListController,
  taskUpdateController,
} from "../controllers/task.controllers.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middlewares.js";

// Router
const router = new Router();

router.route("/").post(isAuthenticated, createTaskController);
router.route("/all").get(isAuthenticated, TaskListController);
router
  .route("/:id")
  .get(isAuthenticated, isAuthorized("Task"), taskDetailController);
router
  .route("/:id")
  .patch(isAuthenticated, isAuthorized("Task"), taskUpdateController);
router
  .route("/:id")
  .delete(isAuthenticated, isAuthorized("Task"), taskDeleteController);

export default router;
