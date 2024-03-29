// ==============================
// Error Handler Middleware
// Handles various error types
// ==============================

import ErrorResponse from "../utils/errorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // ------------------------------
  // Mongoose duplicate key error
  // ------------------------------
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }
  
  // ------------------------------
  // Mongoose validation error
  // ------------------------------
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  // ------------------------------
  // Mongoose cast error
  // ------------------------------
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // ------------------------------
  // JWT authentication error
  // ------------------------------
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Authorization denied.";
    error = new ErrorResponse(message, 401);
  }

  // ------------------------------
  // JWT expired error
  // ------------------------------
  if (err.name === "TokenExpiredError") {
    const message = "Token expired. Authorization denied.";
    error = new ErrorResponse(message, 401);
  }

  // Log the error for debugging
  // ==============================
  //
  // console.error(err);
  //
  // ==============================

  // ------------------------------
  // Send a generic error message if none of the above
  // ------------------------------
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
