const jwt = require("jsonwebtoken");

const enumParamsRequest = require("../constants/enumParamsRequest");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    // Check request is include accessToken in header
    return res.status(401).json({
      success: false,
      message: "Bạn không có quyền truy cập chức năng này",
      data: null,
      error: {
        typeError: enumParamsRequest.typeErrorKey.unauthorized,
        paramsError: ["accessToken"],
      },
    });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // Check token is valid
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Bạn không có quyền truy cập chức năng này",
        data: null,
        error: {
          typeError: enumParamsRequest.typeErrorKey.unauthorized,
          paramsError: ["accessToken"],
          errorDetail: err,
        },
      });
    }
    req.userID = decoded.userID;
    next();
  });
};

module.exports = verifyAccessToken;
