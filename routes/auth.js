import express from "express";
import {
  register,
  login,
  forgotpassword,
  resetpassword,
} from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/reset-password/:resetToken").put(resetpassword);

export default router;
