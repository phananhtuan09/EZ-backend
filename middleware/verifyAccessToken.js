const jwt = require("jsonwebtoken");

const enumParamsRequest = require("../constants/enumParamsRequest");
const responseMessage = require("../constants/responseMessage");
const { helperResponse } = require("../utils/helperFunctions");

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    // Check request is include accessToken in header
    return helperResponse(res, 401, {
      message: responseMessage.NO_UNAUTHORIZED,
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
      return helperResponse(res, 401, {
        message: responseMessage.NO_UNAUTHORIZED,
        error: {
          typeError: enumParamsRequest.typeErrorKey.unauthorized,
          paramsError: ["accessToken"],
          errorDetails: err,
        },
      });
    }
    req.userID = decoded.userID;
    next();
  });
};

module.exports = verifyAccessToken;
