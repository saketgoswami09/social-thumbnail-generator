const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/auth.routes"); // Import the new router

const app = express();

// --- Middleware ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standaedHeaders: true,
  leagacyHeaders: false,
});

app.use(limiter);

// Set security-related HTTP response headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Log HTTP requests to the console
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(express.json());

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});
// All routes starting with /api/auth will be handled by this router
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});
module.exports = app;
