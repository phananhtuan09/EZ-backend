const express = require("express");

const userController = require("../controllers/userController");
const { catchErrors } = require("../middleware/errorHandlers");
const { uploadAvatar } = require("../config/multerUpload");

const router = express.Router();

router.post(
  "/updateAvatar",
  uploadAvatar.single("file"),
  catchErrors(userController.handleUpdateAvatar)
);

module.exports = router;
