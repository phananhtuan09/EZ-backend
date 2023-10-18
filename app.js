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

const app = express();

// Middleware logger
app.use(infoLogger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cors origin resource sharing
app.use(cors(corsOptions));

// Built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Built-in middleware to handle urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Server static file
app.use(express.static(path.join(__dirname, "/public")));

// Routing
app.use("/api", authRouter);

// Config swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Testing server
app.use("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Welcome EliteZone API",
    data: null,
    error: null,
  });
});

// Handle Error 404 Not Found
app.use(errorHandlers.notFound);

/* Development Error Handler - Prints stack trace */
if (process.env.NODE_ENV === "development") {
  app.use(developmentErrors);
}

// Production error handler
if (process.env.NODE_ENV === "production") {
  app.use(productionErrors);
}

module.exports = app;
