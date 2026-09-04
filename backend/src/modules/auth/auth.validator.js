import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Name must be at least 20 characters long")
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
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export { registerSchema, loginSchema, passwordRegex };
 