// ─── IMPORT MODULES ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import crypto from "crypto";

// ─── USER SCHEMA DEFINITION ─────────────────────────────────────────────────────
/**
 * Mongoose schema for user model.
 * Includes fields for username, email, password, reset token, and reset date.
 * Uses bcrypt for password hashing.
 */

const userSchema = new mongoose.Schema({
  // Username Field
  // Unique and required field for user identification.
  username: {
    type: String,
    unique: true,
    required: [true, "Enter a valid username"],
  },

  // Email Field
  // Must be unique and follow a valid email format.
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },

  // Password Field
  // Required field with a minimum length. Not selected by default for security.
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
    required: [true, "Please enter a valid password"],
    select: false,
  },

  // Reset Password Token
  // Used for password recovery processes.
  resetPasswordToken: String,

  // Reset Password Expiry Date
  // Tracks the expiration of the password reset token.
  resetPasswordDate: Date,
});

// ─── USER SCHEMA PRE-SAVE HOOK ──────────────────────────────────────────────────
/**
 * Pre-save hook for user schema.
 * Hashes the password before saving it to the database.
 * Make sure to use function key instead of the arrow key.
 */

// Anything you want to run or change before the creation or saving of the user model will be managed by the line below.

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

// ─── USER SCHEMA METHODS ────────────────────────────────────────────────────────
/**
 * Method to compare provided password with hashed password in the database.
 */

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

/**
 * Method to generate jwt token
 */

userSchema.methods.getSignedToken = function () {
  // used at helper method in the auth.js controller
  return Jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token (private key) and save to database
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

  return resetToken;
};

// ─── EXPORT USER MODEL ──────────────────────────────────────────────────────────
export const User = mongoose.model("User", userSchema);
