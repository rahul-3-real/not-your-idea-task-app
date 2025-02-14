import { Router } from "express";
import {
  createTaskController,
  searchTaskController,
  taskDeleteController,
  taskDetailController,
  taskListController,
  taskPositionController,
  taskUpdateController,
} from "../controllers/task.controllers.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/auth.middlewares.js";

// Router
const router = new Router();

router.route("/").post(isAuthenticated, createTaskController);
router.route("/all").get(isAuthenticated, taskListController);
router
  .route("/:id")
  .get(isAuthenticated, isAuthorized("Task"), taskDetailController);
router
  .route("/:id")
  .patch(isAuthenticated, isAuthorized("Task"), taskUpdateController);
router
  .route("/:id")
  .put(isAuthenticated, isAuthorized("Task"), taskPositionController);
router
  .route("/:id")
  .delete(isAuthenticated, isAuthorized("Task"), taskDeleteController);
router
  .route("/search")
  .delete(isAuthenticated, isAuthorized("Task"), searchTaskController);

export default router;
