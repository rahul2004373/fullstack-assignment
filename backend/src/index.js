import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import appRoutes from "./routes/index.js";

const app = express();
dotenv.config();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", appRoutes);

// global error handler
app.use(errorMiddleware)


// listener
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
