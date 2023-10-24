const multer = require("multer");
const path = require("path");

const { errorParamAvatar } = require("../constants/enumImage");

// Config path save file and fileName
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads", "avatars"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar" + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Check valid image
const fileFilter = (req, file, cb) => {
  // Check file extension
  const allowedFileTypes = [".jpg", ".jpeg", ".png"];
  const extname = path.extname(file.originalname).toLowerCase();
  if (!allowedFileTypes.includes(extname)) {
    cb(null, false);
    req.avatarError = errorParamAvatar.invalidExtension;
    return;
  }
  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB in bytes
  },
});

module.exports = {
  uploadAvatar,
};
