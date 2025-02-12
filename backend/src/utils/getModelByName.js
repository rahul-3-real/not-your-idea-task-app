import User from "../models/user.model.js";
import Task from "../models/task.model.js";

// Get Model by name
const getModelByName = (modelName) => {
  switch (modelName) {
    case "Task":
      return Task;
    case "User":
      return User;
    default:
      return null;
  }
};

export default getModelByName;
