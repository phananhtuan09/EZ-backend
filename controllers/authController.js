const {
  handleShowErrorParamsInValid,
  handleShowErrorParamsDuplicate,
  generateUniqueID,
  helperReturnURLImage,
  customValidateParamsRequest,
  helperResponse,
} = require("../utils/helperFunctions");
const responseMessage = require("../constants/responseMessage");
const db = require("../config/connectDatabase");
const enumParamsRequest = require("../constants/enumParamsRequest");
const { typeImageStorage } = require("../constants/enumImage");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleRegister = async (req, res) => {
  const { userName, password, phone, email } = req.body;

  // Check error required and invalid type
  const errorInvalid = handleShowErrorParamsInValid({
    userName: {
      type: "string",
      value: userName,
      required: true,
      customValidate: [customValidateParamsRequest.isLengthValid],
    },
    password: {
      type: "string",
      value: password,
      required: true,
      customValidate: [
        customValidateParamsRequest.isLengthValid,
        customValidateParamsRequest.isPasswordValid,
      ],
    },
    phone: {
      type: "string",
      value: phone,
      required: true,
      customValidate: [
        customValidateParamsRequest.isLengthValid,
        customValidateParamsRequest.isPhoneValid,
      ],
    },
    email: {
      type: "string",
      value: email,
      required: true,
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

  // Check phone or email is exist in DB
  const [duplicate] = await db.query(
    "SELECT * FROM users WHERE email = ? OR phone = ?",
    [email, phone]
  );

  if (Array.isArray(duplicate) && duplicate.length > 0) {
    const errorDuplicate = handleShowErrorParamsDuplicate(
      {
        email,
        phone,
      },
      {
        email: duplicate[0].email || "",
        phone: duplicate[0].phone || "",
      }
    );

    return helperResponse(res, 409, {
      message: errorDuplicate.message || "Email hoặc số điện thoại đã tồn tại",
      error: errorDuplicate.error || null,
    });
  }
  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Find last user in DB
    const [lastUser] = await db.query(
      "SELECT * FROM users ORDER BY userID DESC LIMIT 1"
    );

    let newUserID = "0001";

    if (Array.isArray(lastUser) && lastUser.length > 0 && lastUser[0].userID) {
      // Generate new userID
      newUserID = generateUniqueID(lastUser[0].userID);
    }

    if (newUserID) {
      //  Create new user
      const [insertInfo] = await db.query(
        "INSERT INTO users (userID, userName, password, phone, email) VALUES(?, ?, ?, ?, ?)",
        [newUserID, userName, hashedPassword, phone, email.toLowerCase()]
      );

      if (insertInfo && insertInfo.affectedRows) {
        // Create JWTs
        const accessToken = jwt.sign(
          {
            userID: newUserID,
            userName: userName,
            phone: phone,
            email: email,
            role: {},
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          {
            userID: newUserID,
          },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "3d" }
        );

        return res
          .status(201)
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite:
              process.env.NODE_ENV === "development" ? "none" : "strict",
            secure: process.env.NODE_ENV === "development" ? false : true,
            maxAge: 24 * 3 * 60 * 60 * 1000,
          })
          .json({
            success: true,
            message: "Đăng ký tài khoản thành công",
            data: {
              userID: newUserID,
              userName: userName,
              phone: phone,
              email: email.toLowerCase(),
              role: {},
              accessToken,
              avatar: "",
            },
            error: null,
          });
      }
    }

    return helperResponse(res, 400, {
      message: "Không thể đăng ký tài khoản và lúc này",
    });
  } catch (error) {
    return helperResponse(res, 500, {
      message: error.message || responseMessage.ERROR_SERVER,
    });
  }
};

const handleLogin = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Check error required and invalid type
  const errorInvalid = handleShowErrorParamsInValid({
    emailOrPhone: {
      type: "string",
      value: emailOrPhone,
      required: true,
      customValidate: [
        customValidateParamsRequest.isLengthValid,
        customValidateParamsRequest.isEmailOrPhoneValid,
      ],
    },
    password: {
      type: "string",
      value: password,
      required: true,
      customValidate: [
        customValidateParamsRequest.isLengthValid,
        customValidateParamsRequest.isPasswordValid,
      ],
    },
  });

  if (errorInvalid && errorInvalid.message) {
    return helperResponse(res, 400, {
      message: errorInvalid.message,
      error: errorInvalid.error || null,
    });
  }

  try {
    const [matchUser] = await db.query(
      "SELECT * FROM users WHERE email = ? OR phone = ? LIMIT 1",
      [emailOrPhone.toLowerCase(), emailOrPhone.toLowerCase()]
    );
    if (!Array.isArray(matchUser) || matchUser.length === 0) {
      // User not exist in DB
      return helperResponse(res, 404, {
        message: responseMessage.LOGIN_NOT_FOUND,
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["emailOrPhone"],
        },
      });
    }

    //Evaluate password
    const matchPassword = await bcrypt.compare(password, matchUser[0].password);
    if (!matchPassword) {
      return helperResponse(res, 404, {
        message: responseMessage.LOGIN_NOT_FOUND,
        error: {
          typeError: enumParamsRequest.typeErrorKey.notFoundError,
          paramsError: ["password"],
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
          paramsError: ["emailOrPhone", "password"],
        },
      });
    }

    // Create JWTs
    const accessToken = jwt.sign(
      {
        userID: matchUser[0].userID,
        userName: matchUser[0].userName,
        phone: matchUser[0].phone,
        email: matchUser[0].email,
        role: {},
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        userID: matchUser[0].userID,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    const urlAvatar = await helperReturnURLImage(
      matchUser[0].avatar,
      typeImageStorage.avatar
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "none" : "strict",
        secure: process.env.NODE_ENV === "development" ? false : true,
        maxAge: 24 * 3 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          userID: matchUser[0].userID,
          userName: matchUser[0].userName,
          phone: matchUser[0].phone,
          email: matchUser[0].email,
          role: {},
          accessToken,
          avatar: urlAvatar,
        },
        error: null,
      });
  } catch (error) {
    return helperResponse(res, 500, {
      message: error.message || responseMessage.ERROR_SERVER,
    });
  }
};

module.exports = {
  handleRegister,
  handleLogin,
};
