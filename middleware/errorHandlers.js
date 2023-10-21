const responseMessage = require("../constants/responseMessage");

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

const catchErrors = (fn) => {
  return function (req, res, next) {
    const resp = fn(req, res, next);
    if (resp instanceof Promise) {
      return resp.catch(next);
    }
    return resp;
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
const notFound = (req, res, next) => {
  if (process.env.IS_WRITE_LOG_FILE === "true") {
    logger.error(`Request for ${req.url} not found`);
  }
  res.status(404).json({
    success: false,
    message: responseMessage.PATH_NOT_FOUND,
    data: null,
    error: null,
  });
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
const developmentErrors = (err, req, res, next) => {
  if (req.typeError === "Invalid JSON") {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ",
      data: null,
      error: {
        typeError: req.typeError,
      },
    });
  }

  err.stack = err.stack || "";
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };

  res.status(500).json({
    success: false,
    message: responseMessage.ERROR_SERVER,
    data: null,
    error: errorDetails,
  });
};

/*
  Production Error Handler

  No stacktraces are leaked to admin
*/
const productionErrors = (err, req, res, next) => {
  if (req.errorJSON) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đầu vào không hợp lệ",
      data: null,
      error: req.errorMessage,
    });
  }
  res.status(500).json({
    success: false,
    message: responseMessage.ERROR_SERVER,
    data: null,
    error: err,
  });
};

module.exports = {
  catchErrors,
  notFound,
  developmentErrors,
  productionErrors,
};
