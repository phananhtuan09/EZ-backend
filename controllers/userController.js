const responseMessage = require("../constants/responseMessage");
const {
  errorParamAvatar,
  typeImageStorage,
} = require("../constants/enumImage");
const {
  handleShowErrorParamsInValid,
  customValidateParamsRequest,
  helperReturnURLImage,
  helperResponse,
} = require("../utils/helperFunctions");
const enumParamsRequest = require("../constants/enumParamsRequest");
const db = require("../config/connectDatabase");
const path = require("path");

const handleUpdateAvatar = async (req, res) => {
  try {
    const { userID } = req.body;
    if (req.avatarError === errorParamAvatar.invalidExtension) {
      // Response error invalid file upload
      return helperResponse(res, 400, {
        message: "Vui lòng chọn ảnh có đuôi là .jpg, .jpeg, .png",
        error: {
          typeError: errorParamAvatar.invalidExtension,
          paramsError: "file",
        },
      });
    }

    if (req.avatarError === errorParamAvatar.invalidMaxSize) {
      return helperResponse(res, 400, {
        message: "Vui lòng chọn ảnh dưới 3 mb",
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
      return helperResponse(res, 400, {
        message: errorInvalid.message,
        error: errorInvalid.error || null,
      });
    }

    const [matchUser] = await db.query(
      "SELECT * FROM users WHERE userID = ?  LIMIT 1",
      [userID]
    );

    if (!Array.isArray(matchUser) || matchUser.length === 0) {
      // User not exist in DB
      return helperResponse(res, 404, {
        message: "userID không hợp lệ",
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["userID"],
        },
      });
    }

    if (!matchUser[0].isActive) {
      // Account disabled
      return helperResponse(res, 403, {
        message: "Không thể cập nhật tài khoản đã bị khoá",
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
      return helperResponse(res, 200, {
        success: true,
        message: "Cập nhật ảnh đại diện thành công",
        data: {
          avatar: urlAvatar,
        },
      });
    }

    return helperResponse(res, 500, {
      message: responseMessage.ERROR_SERVER,
    });
  } catch (error) {
    return helperResponse(res, 500, {
      message: error.message || responseMessage.ERROR_SERVER,
    });
  }
};

module.exports = {
  handleUpdateAvatar,
};
