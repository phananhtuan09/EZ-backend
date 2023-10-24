const express = require("express");

const imageController = require("../controllers/imageController");
const { catchErrors } = require("../middleware/errorHandlers");
const { uploadAvatar } = require("../config/multerUpload");

const router = express.Router();

router.post(
  "/updateAvatar",
  uploadAvatar.single("file"),
  catchErrors(imageController.handleUpdateAvatar)
);

module.exports = router;
