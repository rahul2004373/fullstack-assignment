import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updatePassword,
} from "./user.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  createUserSchema,
  updatePasswordSchema,
} from "./user.validator.js";
import ROLES from "../../constants/roles.js";

const router = express.Router();

// Update password (any authenticated user)
router.put(
  "/update-password",
  authMiddleware,
  validate(updatePasswordSchema),
  updatePassword
);

// Admin: Create new user (normal, admin, or store_owner)
router.post(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SYSTEM_ADMIN),
  validate(createUserSchema),
  createUser
);

// Admin: Get all users with filters & sorting
router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLES.SYSTEM_ADMIN),
  getUsers
);

// Admin: Get user details by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(ROLES.SYSTEM_ADMIN),
  getUserById
);

export default router;
