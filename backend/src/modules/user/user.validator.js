import { z } from "zod";
import ROLES from "../../constants/roles.js";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters long")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password cannot exceed 16 characters")
    .regex(
      passwordRegex,
      "Password must include at least one uppercase letter and one special character"
    ),
  address: z.string().trim().max(400, "Address cannot exceed 400 characters"),
  role: z.enum([ROLES.SYSTEM_ADMIN, ROLES.NORMAL_USER, ROLES.STORE_OWNER], {
    errorMap: () => ({
      message: `Role must be one of: ${ROLES.SYSTEM_ADMIN}, ${ROLES.NORMAL_USER}, ${ROLES.STORE_OWNER}`,
    }),
  }),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .max(16, "New password cannot exceed 16 characters")
    .regex(
      passwordRegex,
      "New password must include at least one uppercase letter and one special character"
    ),
});

export { createUserSchema, updatePasswordSchema, passwordRegex };
