const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Get token from header
  const authHeader = req.header("Authorization");

  // 2. Check if token doesn't exist
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. Check for "Bearer <token>" format and get the token part
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token format is incorrect, authorization denied" });
  }

  // 4. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Add user from payload to request object
    next(); // Move to the next middleware/controller
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;