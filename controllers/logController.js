const Log = require("../model/Log");
const { format } = require("date-fns");

const handleWriteLogDB = async (message) => {
  if (message && process.env.IS_WRITE_LOG_DB === "true") {
    try {
      const results = await Log.create({
        message,
        timestamp: `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  handleWriteLogDB,
};
