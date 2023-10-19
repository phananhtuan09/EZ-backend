const express = require("express");

const imageController = require("../controllers/imageController");
const { catchErrors } = require("../middleware/errorHandlers");

const router = express.Router();

router.post("/updateAvatar", catchErrors(imageController.handleUpdateAvatar));

module.exports = router;
