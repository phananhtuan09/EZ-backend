const mongoose = require("mongoose");

const connectDatabase = () => {
  try {
    mongoose
      .connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log("Connected to MongoDB");
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDatabase;
