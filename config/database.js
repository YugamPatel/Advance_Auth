// ─── IMPORT MODULES ─────────────────────────────────────────────────────────────
import mongoose from "mongoose";

// ─── DATABASE CONNECTION FUNCTION ───────────────────────────────────────────────
/**
 * Connects to the MongoDB database using Mongoose.
 * Utilizes connection string from environment variables.
 */
export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};
