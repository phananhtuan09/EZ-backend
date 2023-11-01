const Redis = require("ioredis");

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: "127.0.0.1",
});
module.exports = redis;
