const mongoose = require("mongoose");

const Response = () => {
    const modelName = 'Response';
    const mongooseClient = mongoose;
    const schema = new mongooseClient.Schema({
      userId: { type: String, unique: true },
      userName: { type: String },
      mood: { type: String },
      hobbies: { type: [String] },
    }, {
      timestamps: true
    });
  
    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
      mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);
  };

  module.exports = Response();
  