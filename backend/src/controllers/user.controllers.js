import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import {
  compareFieldValidator,
  emailValidator,
  minLengthValidator,
  notEmptyValidator,
} from "../utils/validators.js";
import {
  generateAccessRefreshToken,
  options,
} from "../utils/generateTokens.js";

// Register Controller
export const registerController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from frontend
   * TODO: Validate data
   * TODO: Check if the user exists
   * TODO: Create a new User
   * TODO: Check if the user is created
   * TODO: Generate Access & Refresh Token
   * TODO: Send Response to user
   * **/

  // * Get data from frontend
  const { fullName, email, password, password2 } = req.body;

  // * Validate data
  notEmptyValidator([fullName, email, password, password2]);
  emailValidator(email);
  minLengthValidator(fullName, 3, "Full Name");
  minLengthValidator(password, 6, "Password");
  compareFieldValidator(password, password2, "Password does not match");

  // * Check if the user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // * Create a new user
  const createdUser = await User.create({
    fullName,
    email,
    password,
  });

  // * Check if user is created
  const user = await User.findById(createdUser._id);
  if (!user) {
    throw new ApiError(500, "Error creating user, Please try again!");
  }

  // * Generate Access & Refresh Token
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );

  // * Sending Response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User created successfully!"
      )
    );
});

// Login Controller
export const loginController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get data from user
   * TODO: Validate data
   * TODO: Check if user exists
   * TODO: Check Password
   * TODO: Generate Token
   * TODO: Sending Response
   * **/

  // * Get data from user
  const { email, password } = req.body;

  // * Validate data
  notEmptyValidator([email, password]);
  emailValidator(email);

  // * Check if user exists
  const user = await User.findOne({ email }).select("password");
  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  // * Check Password
  const passwordCheck = await user.comparePassword(password);
  if (!passwordCheck) {
    throw new ApiError(401, "Invalid password");
  }

  // * Generate Token
  const { accessToken, refreshToken } = await generateAccessRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id);

  // * Sending Response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!"
      )
    );
});

// Logout Controller
export const logoutController = asyncHandler(async (req, res) => {
  /**
   * TODO: Update token in backend
   * TODO: Delete cookie from frontend
   * TODO: Sending Response
   * **/

  // * Update token in backend
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  // * Sending Response & Delete cookie from frontend
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!"));
});

// Refresh Access Token Controller
export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get Refresh token from cookie
   * TODO: Decode Refresh Token
   * TODO: Check if user exists
   * TODO: Compare cookie refresh token with refresh token stored in database
   * TODO: Generate new access token
   * TODO: Sending Response
   * **/

  // * Get Refresh token from cookie or body
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    // * Decode refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // * Check if user exists
    const user = await User.findById(decodedToken._id).select("refreshToken");
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // * Compare cookie refresh token with refresh token stored in database
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({ message: "Refresh token is expired!" }); // Fix: Added return
    }

    // * Generate new access token
    const { accessToken, refreshToken } = await generateAccessRefreshToken(
      user._id
    );

    // * Save new refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // * Sending Response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed!"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Invalid or expired refresh token"
    );
  }
});

// Fetch User Profile Controller
export const fetchUserProfileController = asyncHandler(async (req, res) => {
  /**
   * TODO: Get User from Request
   * TODO: Send Response
   * **/

  // * Get User from Request
  const requestUser = req.user;
  const user = await User.findById(requestUser._id);

  // * Check if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // * Sending Response
  res
    .status(200)
    .json(new ApiResponse(200, user, "Fetched User Profile Successfully!"));
});
