const express = require("express");

const userController = require("../controllers/userController");
const { catchErrors } = require("../middleware/errorHandlers");
const { uploadAvatar } = require("../config/multerUpload");
const verifyAccessToken = require("../middleware/verifyAccessToken");

const router = express.Router();

router.post(
  "/updateAvatar",
  verifyAccessToken,
  uploadAvatar.single("file"),
  catchErrors(userController.handleUpdateAvatar)
);

module.exports = router;
