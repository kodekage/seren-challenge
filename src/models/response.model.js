const mongoose = require("mongoose");

const Response = () => {
  const modelName = "Response";
  const mongooseClient = mongoose;
  const schema = new mongooseClient.Schema({
    userId: { type: String, unique: true },
    userName: { type: String },
    mood: { type: String },
    hobbies: { type: [String] },
  }, {
    timestamps: true
  });
  
  return mongooseClient.model(modelName, schema);
};

module.exports = Response();
  