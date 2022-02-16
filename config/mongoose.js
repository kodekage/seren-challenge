const mongoose = require('mongoose');

module.exports = () => {
  return mongoose.connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  ).catch(err => {
      console.log(err)
    process.exit(1);
  });
};
