// ==============================
// JWT Authentication Middleware
// ==============================
// This script provides a middleware function for the MERN stack, using JSON Web Tokens (JWT)
// for authentication. It ensures that only authenticated users can access specific routes.

import jwt from "jsonwebtoken"; // Importing the jsonwebtoken module for token verification
import { User } from "../models/User.js"; // Importing the User model from the database models
import ErrorResponse from "../utils/errorResponse.js"; // Importing a custom error response utility


// Asynchronous Middleware Function: protect
// =========================================
// This function acts as a middleware to authenticate users based on the JWT token.
// It checks the authorization header, validates the token, and ensures user existence in the database.

export const protect = async (req, res, next) => {
  // Retrieving the authorization header from the incoming request
  const authorization = req.headers.authorization;

  // Checking for the presence of the authorization header
  if (!authorization) {
    // Triggering an error response if the authorization header is missing
    return next(new ErrorResponse("No Authorization Header", 401));
  }

  // Extracting the token from the 'Bearer' scheme in the authorization header
  const token = authorization.split("Bearer ")[1];

  // Checking if the token is present in the authorization header
  if (!token) {
    // Triggering an error response if the token is missing
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verifying the JWT token with the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Finding the user in the database based on the ID in the decoded token
    const user = await User.findById(decoded.id);

    // Checking if the user exists in the database
    if (!user) {
      // Triggering an error response if no user is found with the given ID
      return next(new ErrorResponse("No user found this id", 404));
    }

    // Attaching the user object to the request for further use in the application
    req.user = user;
    // Proceeding to the next middleware in the chain
    next();
  } catch (error) {
    // Handling any token verification errors or other exceptions
    return next(
      new ErrorResponse("Not authorized to access this route", 401)
    );
  }
};
