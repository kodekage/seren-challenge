const ResponseModel = require("../models/response.model");

const userResponseController = async (req, res) => {
    const user = await ResponseModel.findOne({ userName: req.params.userName }).exec();

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
