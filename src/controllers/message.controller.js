const { WebClient } = require("@slack/web-api");
const pinoLogger = require("../config/logger");
const ResponseModel = require("../models/response.model");
const { Mood, CallbackTypes } = require("../utils/enums");

/**
 * Request handler function for incoming request to the message
 * endpoint
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns string
 */
const messageController = async (req, res) => {
  const logger = pinoLogger;
  //init slack web api
  const web = new WebClient(process.env.SLACK_BOT_TOKEN);
  logger.info({ message: "Bot Received a message", body: req.body });

  if (req.body.text !== "hello") {
    logger.warn({ message: "Command test not hello", text: req.body.text });
    return res.end(`Hi <@${req.body.user_id}>, to interact with me, you need to send 'Hello' messge`);
  }
    
  const user = await ResponseModel.findOne({ userId: req.body.user_id }).exec();
  logger.debug({ message: "Found user", user });

  if (!user) {
    logger.info({ message: "Saving new user data to DB"});
    const response = new ResponseModel({ userId: req.body.user_id , userName: req.body.user_name });
    await response.save();
    logger.info({ message: "New user data saved in DB"});
  }

  const userMoodMenuQuestion = {
    channel: req.body.channel_id,
    text: "Welcome. How are you doing?",
    attachments: [
      {
        color: "#f2c744",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Choose an option that reflects how your mood"
            },
            accessory: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select mood",
                emoji: true
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: Mood.FEELING_LUCKY,
                    emoji: true
                  },
                  value: Mood.FEELING_LUCKY
                },
                {
                  text: {
                    type: "plain_text",
                    text: Mood.FEELING_NEUTRAL,
                    emoji: true
                  },
                  value: Mood.FEELING_NEUTRAL
                },
                {
                  text: {
                    type: "plain_text",
                    text: Mood.FEELING_WELL,
                    emoji: true
                  },
                  value: Mood.FEELING_WELL
                }
              ],
              action_id: CallbackTypes.USER_MOOD
            }
          }
        ]
      }
    ]
  };

  logger.debug({ message: "User Mood Menu Questions", userMoodMenuQuestion });
  web.chat.postMessage(userMoodMenuQuestion);
    
  res.end();
};

module.exports = messageController;