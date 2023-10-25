const express = require("express");

const forgotPasswordController = require("../controllers/forgotPasswordController");
const { catchErrors } = require("../middleware/errorHandlers");

const router = express.Router();

router.post(
  "/forgotPassword",
  catchErrors(forgotPasswordController.handleForgotPassword)
);

module.exports = router;
