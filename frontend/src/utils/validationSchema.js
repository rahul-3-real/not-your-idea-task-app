import * as yup from "yup";

// Login Schema Validation
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter Email Address"),
  password: yup
    .string()
    .trim()
    .min(6, "Password must be 6 characters long")
    .required("Please enter Password"),
});

// Register Schema Validation
export const registerSchema = yup.object().shape({
  fullName: yup.string().required("Please enter Full Name"),
  email: yup
    .string()
    .trim()
    .email("Please enter a valid email")
    .required("Please enter Email Address"),
  password: yup
    .string()
    .trim()
    .min(6, "Password must be 6 characters long")
    .required("Please enter Password"),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Password must match")
    .required("Please confirm your password"),
});

// Task Schema Validation
export const taskSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: yup
    .string()
    .nullable()
    .max(500, "Description cannot exceed 500 characters"),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["To Do", "In Progress", "Done"], "Invalid status selected"),
  priority: yup
    .string()
    .required("Priority is required")
    .oneOf(["Low", "Medium", "High"], "Invalid priority selected"),
  dueDate: yup
    .date()
    .nullable()
    .min(new Date(), "Due date cannot be in the past")
    .required("Due date is required"),
});
