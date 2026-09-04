import express from "express";
import { getDashboard } from "./admin.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import ROLES from "../../constants/roles.js";

const router = express.Router();

// Admin dashboard statistics
router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles(ROLES.SYSTEM_ADMIN),
  getDashboard
);

export default router;
