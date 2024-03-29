import { User } from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// ************************************************************
// ***************** User Authentication Routes ***************
// ************************************************************

// -------------------------------------------------------------
// --------------- Route handler for USER REGISTRATION ---------
// -------------------------------------------------------------
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });

    sendToken(user, 200, res, "User created successfully");

    // res.status(200).json({
    //   success: true,
    //   message: "User created successfully",
    //   user: user,
    // });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// -------------------------------------------------------------
// --------------- Route handler for USER LOGIN ----------------
// -------------------------------------------------------------
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Email or Password field is missing", 401));
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    const compare = await user.matchPassword(password);

    if (compare) {
      sendToken(user, 200, res, "Login successful");
    } else {
      return next(new ErrorResponse("Incorrect credentials", 404));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      userError: "User not found please check if your email is correct",
      developerError: error.message,
    });
  }
};

// -------------------------------------------------------------
// --------------- Route handler for FORGOT PASSWORD -----------
// -------------------------------------------------------------
export const forgotpassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("Email could not be send", 404));
    }

    const resetToken = await user.getResetPasswordToken();

    await user.save();

    const resetUrl =
      "http://localhost:5173/reset-password/" + resetToken;

    const message = `<h1>You have requested a password reset</h1>
    <p>Please go to </p><br>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`;

    try {
      sendEmail({
        to: user.email,
        subject: "Password reset request",
        text: message,
      });

      res
        .status(200)
        .json({ success: true, data: "email sent", resetLink: resetUrl });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordDate = undefined;
      await user.save();
      console.log(error, "eeror");
      return next(new ErrorResponse("Email could not be send", 500));
    }
  } catch (error) {
    return next(new ErrorResponse("Reset Password Failed", 404));
  }
};

// -------------------------------------------------------------
// --------------- Route handler for RESET PASSWORD ------------
// -------------------------------------------------------------

export const resetpassword = async (req, res, next) => {
  console.log(req.params.resetToken);
  // const resetPasswordToken = crypto
  //   .createHash("sha256")
  //   .update(req.params.resetToken)
  //   .digest("hex");

  const resetPasswordToken = req.params.resetToken;

  console.log(resetPasswordToken);

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse("Invalid Token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      data: "Password Updated Success",
      token: user.getSignedJwtToken(),
    });
  } catch (err) {
    next(err);
  }
};

// -------------------------------------------------------------
// --------------- Helper Methods ------------------------------
// -------------------------------------------------------------
const sendToken = (user, statusCode, res, message) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, message, token, user });
};
