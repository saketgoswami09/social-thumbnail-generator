require('dotenv').config();
const connectDB = require('./src/config/db'); // Import the connectDB function
const app = require('./src/app');

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
    console.error("Failed to start server", error);
  }
};

startServer();