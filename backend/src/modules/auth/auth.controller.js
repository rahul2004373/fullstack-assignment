import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "./auth.service.js";

import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const register = asyncHandler(async (req, res) => {
  const userData = req.body;
  const user = await registerUser(userData);

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", user));
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, "Login successful", result));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", user));
});

const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Logged out successfully", null));
});

export { register, login, getMe, logout };
 