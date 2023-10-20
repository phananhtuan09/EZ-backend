const {
  handleShowErrorParamsInValid,
  handleShowErrorParamsDuplicate,
  generateUniqueID,
  isValidEmail,
  isValidPhone,
} = require("../utils/helperFunctions");
const responseMessage = require("../constants/responseMessage");
const db = require("../config/connectDatabase");

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
    },
    password: {
      type: "string",
      value: password,
      required: true,
    },
    phone: {
      type: "string",
      value: phone,
      required: true,
      customValidate: [isValidPhone],
    },
    email: {
      type: "string",
      value: email,
      required: true,
      customValidate: [isValidEmail],
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

    return res.status(409).json({
      success: false,
      message: errorDuplicate.message || "Email hoặc số điện thoại đã tồn tại",
      data: null,
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
        [newUserID, userName, hashedPassword, phone, email]
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
              email: email,
              role: {},
              accessToken: `Bearer ${accessToken}`,
            },
            error: null,
          });
      }
    }

    return res.status(500).json({
      success: false,
      message: responseMessage.ERROR_SERVER,
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
  handleRegister,
};
