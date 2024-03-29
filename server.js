// ─── IMPORT MODULES ─────────────────────────────────────────────────────────────
import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import { connectDatabase } from "./config/database.js";
import errorHandler from "./middleware/error.js";
import privateRouter from "./routes/private.js";

// ─── ENVIRONMENT CONFIGURATION ──────────────────────────────────────────────────
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;

// ─── DATABASE CONNECTION ────────────────────────────────────────────────────────
connectDatabase();

// ─── EXPRESS APP SETUP ──────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// ─── ROUTES ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/private", privateRouter);

// ─── SERVER INITIALIZATION ──────────────────────────────────────────────────────
const server = app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);

// ─── GLOBAL ERROR HANDLER ───────────────────────────────────────────────────────
app.use(errorHandler);

// ─── UNHANDLED PROMISE REJECTION HANDLER ────────────────────────────────────────
process.on("unhandledrejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});
