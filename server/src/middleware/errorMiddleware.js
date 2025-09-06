// file: backend/src/middleware/errorMiddleware.js

/**
 * Handles requests for routes that do not exist (404 Not Found).
 * Creates an error object and passes it to the next error handling middleware.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global error handler for Express application.
 * Catches errors passed from other middleware or routes.
 * Sends a structured JSON response. Includes stack trace in development mode.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come through with a successful status code (200).
  // If so, default to a 500 Internal Server Error.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };