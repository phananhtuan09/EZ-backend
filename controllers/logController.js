const db = require("../config/connectDatabase");

const handleWriteLogDB = async (message) => {
  if (message && process.env.IS_WRITE_LOG_DB === "true") {
    try {
      await db.query("INSERT INTO logs (message) VALUES (?)", message);
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  handleWriteLogDB,
};
