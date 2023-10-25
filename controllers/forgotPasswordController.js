const {
  handleShowErrorParamsInValid,
  customValidateParamsRequest,
  generateOtp,
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
      return res.status(400).json({
        success: false,
        message: errorInvalid.message,
        data: null,
        error: errorInvalid.error || null,
      });
    }

    const [matchUser] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!Array.isArray(matchUser) || matchUser.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại trong hệ thống",
        data: null,
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["email"],
        },
      });
    }

    if (!matchUser[0].isActive) {
      // Account disabled
      return res.status(403).json({
        success: false,
        message:
          "Tài khoản đã bị khoá. Vui lòng liên hệ admin để biết thêm chi tiết",
        data: null,
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
      return res.status(400).json({
        success: false,
        message: "Vui lòng thử lại sau một phút",
        data: null,
        error: null,
      });
    }

    const newOtp = generateOtp();

    redis.set(`otp-forgot-password-${matchUser[0].userID}`, newOtp, "EX", 60);
    redis.set(`delayTime-sendMail-${matchUser[0].userID}`, true, "EX", 60);

    const sendEmailResults = await sendEmail(
      email,
      "EliteZone cấp lại mật khẩu",
      { otp: newOtp },
      "../templateEmail/forgotPassword.handlebars"
    );

    if (sendEmailResults.success) {
      return res.status(200).json({
        success: true,
        message: "Vui lòng try cập mail để lấy mã otp",
        data: null,
        error: null,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra! Vui lòng thử lại sau",
      data: null,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || responseMessage.ERROR_SERVER,
      data: null,
      error: null,
    });
  }
};

module.exports = {
  handleForgotPassword,
};
