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
