import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {
  dateExpiredValidator,
  notEmptyValidator,
} from "../utils/validators.js";

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

  // * Send Response
  return res.json(new ApiResponse(200, null, "Task deleted successfully!"));
});

// Task List Controller
export const TaskListController = asyncHandler(async (req, res) => {
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
