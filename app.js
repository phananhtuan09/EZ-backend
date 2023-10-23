const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
require("dotenv").config();

const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const errorHandlers = require("./middleware/errorHandlers");
const { infoLogger } = require("./middleware/logger");
const swaggerOptions = require("./config/swaggerOptions");
const authRouter = require("./routes/authRouter");
const imageRouter = require("./routes/imageRouter");
const verifyAccessToken = require("./middleware/verifyAccessToken");
const { createUploadsAvatarDirectory } = require("./middleware/directorySetup");

const app = express();

// Middleware logger
app.use(infoLogger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cors origin resource sharing
app.use(cors(corsOptions));

// Built-in middleware for json
app.use(
  express.json({
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (error) {
        // Handle request data not valid JSON
        req.typeError = "Invalid JSON";
      }
    },
  })
);

// Middleware for cookies
app.use(cookieParser());

// Built-in middleware to handle urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Server static file
app.use(express.static(path.join(__dirname, "/public")));

// Serve static image for FE show image
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Setup Directory
app.use(createUploadsAvatarDirectory);

// Config swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routing
app.use("/api", authRouter);

// Verify Access Token before handle logic
app.use(verifyAccessToken);

// Protected routes
app.use("/api", imageRouter);

// Handle Error 404 Not Found
app.use(errorHandlers.notFound);

/* Development Error Handler - Prints stack trace */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandlers.developmentErrors);
}

// Production error handler
if (process.env.NODE_ENV === "production") {
  app.use(errorHandlers.productionErrors);
}

module.exports = app;
