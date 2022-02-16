const mongoose = require('mongoose');

module.exports = () => {
  console.log(process.env.MONGO_DB_URL);
  return mongoose.connect(
    process.env.MONGO_DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
  ).catch(err => {
      console.log(err)
    process.exit(1);
  });
};
