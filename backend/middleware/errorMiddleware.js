/**
 * Middleware for handling 404 Not Found errors
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Custom error handler middleware
 * Formats and sends consistent error responses
 */
export const errorHandler = (err, req, res, next) => {
  // If status code is still 200, set to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  
  // Send error response
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    error: true
  });
};