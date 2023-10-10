const mongoose = require("mongoose");

const connectDatabase = () => {
  try {
    mongoose
      .connect(process.env.DATABASE_URL, {
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log(`MongoDb connected with server: ${data.connection.host}`);
      });
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDatabase;
