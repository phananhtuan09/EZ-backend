const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const logSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
  },
});

module.exports = mongoose.model("Log", logSchema);
