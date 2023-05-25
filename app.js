const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

//setting cors
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
  ],
  credentials: true,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
require("dotenv").config();

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/test", (request, response) => {
  response.json("Testing API...");
});

app.use(cors(corsOptions));

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
