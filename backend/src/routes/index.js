import express from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import storeRoutes from "../modules/store/store.routes.js";
import ratingRoutes from "../modules/rating/rating.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/stores", storeRoutes);
router.use("/ratings", ratingRoutes);

export default router;