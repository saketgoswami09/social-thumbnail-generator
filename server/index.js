// file: backend/index.js

// --- Load Environment Variables FIRST ---
// By importing 'dotenv/config', we ensure environment variables are loaded immediately,
// before any other module (like app.js) tries to access them.
import 'dotenv/config';

// --- Imports ---
import connectDB from "./src/config/db.js"; // Import the connectDB function
import app from "./src/app.js"; // Import the Express app

// --- Server Startup Logic ---
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Connect to the database first
    await connectDB();

    // Then start the Express server
    app.listen(PORT, () => {
      console.log(`Server is listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();