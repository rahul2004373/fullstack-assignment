import {
  addUser,
  getUsersList,
  getUserDetails,
  updatePassword as updatePasswordService,
} from "./user.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  const user = await addUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", user));
});

const getUsers = asyncHandler(async (req, res) => {
  const { name, email, address, role, sortBy, sortOrder } = req.query;

  const users = await getUsersList({
    name,
    email,
    address,
    role,
    sortBy,
    sortOrder,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserDetails(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await updatePasswordService(
    req.user.id,
    currentPassword,
    newPassword
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Password updated successfully", result));
});

export { createUser, getUsers, getUserById, updatePassword };
