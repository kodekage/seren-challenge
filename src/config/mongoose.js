const mongoose = require("mongoose");
const pinoLogger = require("./logger");

module.exports = () => {
  pinoLogger.debug("connecting to Mongo..");
  return mongoose.connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  ).catch(err => {
    pinoLogger.error(err);
    process.exit(1);
  });
};
