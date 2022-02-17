const pinoLogger = require("../config/logger");
const ResponseModel = require("../models/response.model");

/**
 * Request handler function for incoming request to the users
 * response endpoint for fecthing stored user response
 * 
 * @param {*} req 
 * @param {*} res 
 */
const userResponseController = async (req, res) => {
  pinoLogger.info({ message: "Fetching user response", params: req.params });
  const user = await ResponseModel.findOne({ userName: req.params.userName }).exec();

  pinoLogger.debug({ message: "User responses ", user });
  res.status(200).json({
    status: 200,
    data:{
      response: [
        {
          question: "How are you feeling",
          answer: user.mood
        },
        {
          question: "What are your favorite hobbies?",
          answer: user.hobbies
        },
      ]
    }
  });

};

module.exports = userResponseController;
