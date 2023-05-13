const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({
  path: `.env.development`,
  override: true,
});
const app = express();
const port = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/", (request, response) => {
  response.json("Welcome server of Elite Zone project");
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
