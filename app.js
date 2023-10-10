const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const corsOptions = require("./config/corsOptions");
const errorMiddleware = require("./middleware/error");
const credentials = require("./middleware/credentials");

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cors origin resource sharing
app.use(cors(corsOptions));

// Built-in middleware for json
app.use(express.json());
// Built-in middleware to handle urlencoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.get("/", (req, res) => {
  res.json("Hello...");
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
