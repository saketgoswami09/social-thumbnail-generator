// file: backend/src/app.js

import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// --- Route Imports ---
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js"; // Renamed from projectRoutes.js based on your import path
import generationRoutes from './routes/generationRoutes.js';

// --- Middleware Imports ---
import { protect } from './middleware/authMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// --- Core Middleware ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());
app.use(cors()); // Configure CORS options properly for production later

// Log HTTP requests during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

app.use(express.json()); // Parse incoming JSON requests

// --- API Routes ---
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", protect, projectRoutes); // Protect all project routes
app.use('/api/generate', protect, generationRoutes); // Protect all generation routes

// --- Error Handling Middleware ---
// Re-enable our standard notFound and errorHandler from Module 1/2
app.use(notFound);
app.use(errorHandler);

export default app;