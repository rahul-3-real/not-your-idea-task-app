import ApiError from "../utils/apiError.js";

// Not Empty Validator
export const notEmptyValidator = (fields) => {
  if (fields.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "fields with * are required");
  }
  return fields;
};

// Email Validator
export const emailValidator = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please enter a valid email!");
  }
  return email;
};

// Min Length Validator
export const minLengthValidator = (input, length, fieldName = "Input") => {
  console.log("Input", input);
  console.log("Length", length);
  console.log("Field Name", fieldName);

  if (!input || input.length < length) {
    throw new ApiError(
      400,
      `${fieldName} length must be at least ${length} characters`
    );
  }

  return true;
};

// Compare Field Validator
export const compareFieldValidator = (
  input1,
  input2,
  errMsg = "Inputs does not match"
) => {
  if (input1 !== input2) {
    throw new ApiError(400, errMsg);
  }
  return true;
};

// Date Expired Validator
export const dateExpiredValidator = (date, fieldName = "Date") => {
  if (!date) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  const inputDate = new Date(date);
  const currentDate = new Date();

  if (isNaN(inputDate.getTime())) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }

  if (inputDate < currentDate) {
    throw new ApiError(400, `${fieldName} cannot be in the past`);
  }

  return true;
};
