const express = require("express");

const authController = require("../controllers/authController");
const { catchErrors } = require("../middleware/errorHandlers");

const router = express.Router();

router.post("/login", catchErrors(authController.handleLogin));

router.post("/register", catchErrors(authController.handleRegister));

router.post("/logout", (req, res) => {
  // Implement logout logic here
  res.status(200).json({
    success: true,
    message: "User successfully logged out",
    data: null,
    error: null,
  });
});

router.get("/refreshToken", (req, res) => {
  // Implement refresh token logic here
  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: null,
    error: null,
  });
});

router.post("/resetPassword", (req, res) => {
  // Implement password reset logic here
  res.status(200).json({
    success: true,
    message: "Password reset successful",
    data: null,
    error: null,
  });
});

module.exports = router;
