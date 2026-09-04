import express from "express";
import { register, login, getMe, logout } from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { registerSchema, loginSchema } from "./auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

export default router;