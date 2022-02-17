const pino = require("pino");
// Reuse an existing logger instance
const pinoLogger = pino({
  redact: [
    "body.token",
    "body.user_id",
    "body.user_name",
    "user.userId",
    "user.userName"
  ],
  prettyPrint: {
    levelFirst: true,
    colorize: true
  },
  level: process.env.LOG_LEVEL
});

module.exports = pinoLogger;