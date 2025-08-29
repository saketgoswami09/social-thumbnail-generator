const express = require("express");

const app = express();

const PORT = 3001;

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' }); // Send JSON for better API practice
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
