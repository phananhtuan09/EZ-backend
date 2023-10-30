const {
  handleShowErrorParamsInValid,
  customValidateParamsRequest,
  generateOtp,
  helperResponse,
} = require("../utils/helperFunctions");
const responseMessage = require("../constants/responseMessage");
const db = require("../config/connectDatabase");
const enumParamsRequest = require("../constants/enumParamsRequest");
const sendEmail = require("../utils/sendEmail");
const redis = require("../config/connectRedis");

const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check error required and invalid type
    const errorInvalid = handleShowErrorParamsInValid({
      email: {
        type: "string",
        required: true,
        value: email,
        customValidate: [
          customValidateParamsRequest.isLengthValid,
          customValidateParamsRequest.isEmailValid,
        ],
      },
    });

    if (errorInvalid && errorInvalid.message) {
      return helperResponse(res, 400, {
        message: errorInvalid.message,
        error: errorInvalid.error || null,
      });
    }

    const [matchUser] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!Array.isArray(matchUser) || matchUser.length === 0) {
      return helperResponse(res, 404, {
        message: "Email không tồn tại trong hệ thống",
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["email"],
        },
      });
    }

    if (!matchUser[0].isActive) {
      // Account disabled
      return helperResponse(res, 403, {
        message:
          "Tài khoản đã bị khoá. Vui lòng liên hệ admin để biết thêm chi tiết",
        error: {
          typeError: enumParamsRequest.typeErrorKey.unauthorized,
          paramsError: ["email"],
        },
      });
    }

    const isDelaySendMail = await redis.get(
      `delayTime-sendMail-${matchUser[0].userID}`
    );
    if (isDelaySendMail) {
      return helperResponse(res, 400, {
        message: "Vui lòng thử lại sau một phút",
      });
    }

    const newOtp = generateOtp();

    redis.set(`otp-forgot-password-${matchUser[0].userID}`, newOtp, "EX", 60);

    const sendEmailResults = await sendEmail(
      email,
      "EliteZone cấp lại mật khẩu",
      { otp: newOtp },
      "../templateEmail/forgotPassword.handlebars"
    );

    if (sendEmailResults.success) {
      redis.set(`delayTime-sendMail-${matchUser[0].userID}`, true, "EX", 60);
      return helperResponse(res, 200, {
        success: true,
        message: "Vui lòng try cập mail để lấy mã otp",
      });
    }

    return helperResponse(res, 500, {
      message: "Có lỗi xảy ra! Vui lòng thử lại sau",
    });
  } catch (error) {
    return helperResponse(res, 500, {
      message: error.message || responseMessage.ERROR_SERVER,
    });
  }
};

module.exports = {
  handleForgotPassword,
};
