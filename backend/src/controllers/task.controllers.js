import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {
  dateExpiredValidator,
  notEmptyValidator,
} from "../utils/validators.js";
import { getSocketIo } from "../utils/socket.js";

// Create Task Controller
export const createTaskController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate Data
   * TODO: Save Data
   * TODO: Sending Response
   * **/

  // * Get data from frontend
  const userId = await req.user._id;
  const { title, description, status, dueDate, priority } = req.body;

  // * Validate data
  notEmptyValidator([title, description, status, dueDate, priority]);
  dateExpiredValidator(dueDate, "Due Date");

  const lastTask = await Task.findOne({ userId, status })
    .sort("-position")
    .select("position");

  const newPosition = lastTask ? lastTask.position + 1 : 1;

  // * Save Data
  const task = await Task.create({
    title,
    description,
    status,
    position: newPosition,
    dueDate,
    priority,
    userId,
  });

  const user = await User.findById(userId);
  user.tasks.push(task._id);
  await user.save();

  // * Emit event to all users
  const io = getSocketIo();
  if (io) {
    io.emit("task_created", task);
  } else {
    console.warn("Warning: Socket.io is not initialized, cannot emit event.");
  }

  // * Sending Response
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully!"));
});

// Task Detail Controller
export const taskDetailController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Id from request
   * TODO: Search task
   * TODO: Send Response
   * **/

  // * Get Id from request
  const taskId = req.params.id;

  // * Search task
  const task = await Task.findById(taskId).populate("userId");
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // * Send Response
  return res.json(new ApiResponse(200, task, "Task found successfully!"));
});

// Task Update Controller
export const taskUpdateController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get id from params
   * TODO: Get data from Frontend
   * TODO: Validate data
   * TODO: Sending Response
   * **/

  // * Get id from params
  const taskId = req.params.id;

  // * Get data from frontend
  const { title, description, status, position, dueDate, priority } = req.body;

  // * Validate data
  notEmptyValidator([title, description, status, position, dueDate, priority]);
  dateExpiredValidator(dueDate, "Due Date");

  // * Search task
  const task = await Task.findByIdAndUpdate(
    taskId,
    { title, description, status, position, dueDate, priority },
    { new: true, runValidators: true }
  ).populate("userId");
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // * Emit event to notify users of update
  const io = getSocketIo();
  if (io) {
    io.emit("task_updated", task);
  } else {
    console.warn("Warning: Socket.io is not initialized, cannot emit event.");
  }

  // * Send Response
  return res.json(new ApiResponse(200, task, "Task updated successfully!"));
});

// Task Delete Controller
export const taskDeleteController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Id from params
   * TODO: Search for Task & Delete
   * TODO: Sending Response
   * **/

  // * Get Id from params
  const taskId = req.params.id;

  // * Search for Task & Delete
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // * Update User's Task List
  const user = await User.findById(task.userId);
  user.tasks.pull(taskId);
  await user.save();

  // * Emit event to notify users of task deletion
  const io = getSocketIo();
  if (io) {
    io.emit("task_deleted", { taskId, message: "Task has been deleted" });
  } else {
    console.warn("Warning: Socket.io is not initialized, cannot emit event.");
  }

  // * Send Response
  return res.json(new ApiResponse(200, null, "Task deleted successfully!"));
});

// Task List Controller
export const taskListController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get User from Request
   * TODO: Search tasks
   * TODO: Sending Response
   * **/

  // * Get User from Request
  const requestUser = req.user;
  const user = await User.findById(requestUser._id).populate("tasks");

  // * Search tasks
  const tasks = user.tasks;

  // * Send Response
  return res.json(new ApiResponse(200, tasks, "Tasks found successfully!"));
});

// Update Task Position Controller
export const taskPositionController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Data from Frontend
   * TODO: Find Task
   * TODO: Update Task Positions
   * TODO: Sending Response
   * **/

  // * Get data from Frontend
  const { id } = req.params;
  let { newStatus, newPosition } = req.body;

  // * Validate newPosition
  if (newPosition === undefined || newPosition === null || isNaN(newPosition)) {
    throw new ApiError(
      400,
      "New position is required and must be a valid number"
    );
  }
  newPosition = Number(newPosition);

  // * Find the task
  const task = await Task.findById(id);

  if (!task) throw new ApiError(404, "Task not found");

  const oldStatus = task.status;
  const oldPosition = task.position;

  // * If status is changing, adjust the positions in both columns
  if (oldStatus !== newStatus) {
    // Remove task from old column & shift positions
    await Task.updateMany(
      { status: oldStatus, position: { $gt: oldPosition } },
      { $inc: { position: -1 } }
    );

    // Shift positions in new column for insertion
    await Task.updateMany(
      { status: newStatus, position: { $gte: newPosition } },
      { $inc: { position: 1 } }
    );
  } else {
    // Reordering within the same column
    if (oldPosition < newPosition) {
      // Moving down → shift tasks up
      await Task.updateMany(
        {
          status: oldStatus,
          position: { $gt: oldPosition, $lte: newPosition },
        },
        { $inc: { position: -1 } }
      );
    } else {
      // Moving up → shift tasks down
      await Task.updateMany(
        {
          status: oldStatus,
          position: { $gte: newPosition, $lt: oldPosition },
        },
        { $inc: { position: 1 } }
      );
    }
  }

  // * Update dragged task position
  task.status = newStatus;
  task.position = newPosition;
  await task.save();

  // * Sending Response
  return res.json(new ApiResponse(200, task, "Tasks updated successfully!"));
});
