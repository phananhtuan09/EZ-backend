const winston = require("winston");
const responseMessage = require("../constants/responseMessage");

const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    printf(({ timestamp, message }) => `\n[${timestamp}] ${message}`)
  ),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `info.log`
    //
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/info.log" }),
  ],

  // Write all logs when server  uncaught exception
  exceptionHandlers: [
    new winston.transports.File({
      filename: "./logs/exception.log",
    }),
  ],

  // Write all logs when server  reject exception
  rejectionHandlers: [
    new winston.transports.File({
      filename: "./logs/rejections.log",
    }),
  ],
});

const infoLogger = (req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  logger.error(
    `${err.name || "error"}: ${err.message || responseMessage.ERROR_SERVER}`
  );
};

module.exports = {
  logger,
  infoLogger,
  errorLogger,
};
