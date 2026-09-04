import express from "express";

import {
  createStore,
  getAllStores,
  search,
  getMyStoreController,
  getById,
  ownerDashboard,
} from "./store.controller.js";

import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import { createStoreSchema } from "./store.validation.js";

const router = express.Router();

// Admin creates a store
router.post(
  "/",
  authMiddleware,
  authorizeRoles("system_admin"),
  validate(createStoreSchema),
  createStore
);

// Authenticated users can view stores
router.get("/", authMiddleware, getAllStores);

// Search stores
router.get("/search", authMiddleware, search);

// Store owner can get their own store and ratings directly
router.get(
  "/owner/my-store",
  authMiddleware,
  authorizeRoles("store_owner"),
  getMyStoreController
);

// Store details
router.get("/:id", authMiddleware, getById);

// Store owner dashboard by store ID
router.get(
  "/:id/dashboard",
  authMiddleware,
  authorizeRoles("store_owner"),
  ownerDashboard
);

export default router;
