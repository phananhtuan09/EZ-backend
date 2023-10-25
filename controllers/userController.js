const responseMessage = require("../constants/responseMessage");
const {
  errorParamAvatar,
  typeImageStorage,
} = require("../constants/enumImage");
const {
  handleShowErrorParamsInValid,
  customValidateParamsRequest,
  helperReturnURLImage,
} = require("../utils/helperFunctions");
const enumParamsRequest = require("../constants/enumParamsRequest");
const db = require("../config/connectDatabase");
const path = require("path");

const handleUpdateAvatar = async (req, res) => {
  try {
    const { userID } = req.body;
    if (req.avatarError === errorParamAvatar.invalidExtension) {
      // Response error invalid file upload
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ảnh có đuôi là .jpg, .jpeg, .png",
        data: null,
        error: {
          typeError: errorParamAvatar.invalidExtension,
          paramsError: "file",
        },
      });
    }

    if (req.avatarError === errorParamAvatar.invalidMaxSize) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn ảnh dưới 3 mb",
        data: null,
        error: {
          typeError: errorParamAvatar.invalidMaxSize,
          paramsError: "file",
        },
      });
    }

    // Check error required and invalid type
    const errorInvalid = handleShowErrorParamsInValid({
      userID: {
        type: "string",
        value: userID,
        required: true,
        customValidate: [customValidateParamsRequest.isLengthValid],
      },
    });

    if (errorInvalid && errorInvalid.message) {
      return res.status(400).json({
        success: false,
        message: errorInvalid.message,
        data: null,
        error: errorInvalid.error || null,
      });
    }

    const [matchUser] = await db.query(
      "SELECT * FROM users WHERE userID = ?  LIMIT 1",
      [userID]
    );

    if (!Array.isArray(matchUser) || matchUser.length === 0) {
      // User not exist in DB
      return res.status(404).json({
        success: false,
        message: "userID không hợp lệ",
        data: null,
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["userID"],
        },
      });
    }

    if (!matchUser[0].isActive) {
      // Account disabled
      return res.status(403).json({
        success: false,
        message: "Không thể cập nhật tài khoản đã bị khoá",
        data: null,
        error: {
          typeError: enumParamsRequest.typeErrorKey.unauthorized,
          paramsError: ["isActive"],
        },
      });
    }

    // Get image name after storage image in folder uploads/avatars
    const avatarName = path.basename(req.file.path);

    // Update avatar in DB
    const [updateUser] = await db.query(
      "UPDATE users SET avatar  = ? WHERE userID = ?",
      [avatarName, userID]
    );

    if (updateUser.affectedRows) {
      const urlAvatar = await helperReturnURLImage(
        avatarName,
        typeImageStorage.avatar
      );
      return res.status(200).json({
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        data: {
          avatar: urlAvatar,
        },
        error: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: responseMessage.ERROR_SERVER,
      data: null,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || responseMessage.ERROR_SERVER,
      data: null,
      error: null,
    });
  }
};

module.exports = {
  handleUpdateAvatar,
};
