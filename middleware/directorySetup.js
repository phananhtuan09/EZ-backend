const fs = require("fs");

const uploadsAvatarDirectory = "uploads/avatars";

const createUploadsAvatarDirectory = (req, res, next) => {
  if (!fs.existsSync(uploadsAvatarDirectory)) {
    fs.mkdirSync(uploadsAvatarDirectory, { recursive: true });
  }
  next();
};

module.exports = {
  createUploadsAvatarDirectory,
};
