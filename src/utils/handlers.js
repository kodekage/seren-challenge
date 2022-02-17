const pinoLogger = require("../config/logger");
const ResponseModel = require("../models/response.model");
const { Hobby, CallbackTypes } = require("./enums");

/**
 * ResponseHandler has the responsibility of handling the response
 * to the bots questions on slack
 */
class ResponseHandlers {
  constructor(slackWeb = null, payload = null) {
    this.payload = payload;
    this.slack = slackWeb;
    this.responseModel = ResponseModel;
    this.logger = pinoLogger;
  }

  /**
   * Handles response to the hobby questions by fetching the response,
   * logging, persisting to mongo and finally sending the user a 'thank you'
   * message in the channel the interaction started.
   */
  async handleUserHobbyResponse() {
    const user = this.responseModel.findOne({ userId: this.payload.user.id });
    this.logger.info({ message: "SELECTED HOOBY OPTION", hobby: this.payload.actions[0].selected_options });

    if (user) {
      this.logger.info("Updating user hobbies...");
      const selectedHobbies = this.payload.actions[0].selected_options.map(option => option.value);
      await this.responseModel.updateOne({ userId: this.payload.user.id }, { hobbies: selectedHobbies });
    }

    this.logger.info("Updated user hobbies");
    this.slack.chat.postMessage({
      channel: this.payload.channel.id,
      text: "thank you",
    });
  }

  /**
   * Handles response to the user mood questions. Follows the same patten
   * like the handleUserHobbyResponse method
   */
  async handleUserModeResponse() {
    const userFavoriteHobbiesMessageMenuQuestion = {
      channel: this.payload.channel.id,
      text: "What are your favorite hobbies?",
      attachments: [
        {
          color: "#f2c744",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "You can select multiple hobbies"
              },
              accessory: {
                type: "multi_static_select",
                placeholder: {
                  type: "plain_text",
                  text: "Select hobbies",
                  emoji: true
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: Hobby.FOOTBALL,
                      emoji: true
                    },
                    value: Hobby.FOOTBALL
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: Hobby.MUSIC,
                      emoji: true
                    },
                    value: Hobby.MUSIC
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: Hobby.MOVIES,
                      emoji: true
                    },
                    value: Hobby.MOVIES
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: Hobby.SLEEP,
                      emoji: true
                    },
                    value: Hobby.SLEEP
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: Hobby.BASKETBALL,
                      emoji: true
                    },
                    value: Hobby.BASKETBALL
                  },
                ],
                action_id: CallbackTypes.USER_HOBBY
              }
            }
          ]
        }
      ]
    };
    this.logger.debug({ message: "User Hobby Menu Questions", userFavoriteHobbiesMessageMenuQuestion });

    const user = this.responseModel.findOne({ userId: this.payload.user.id });
    this.logger.info({ message: "SELECTED MODE OPTION", mood: this.payload.actions[0].selected_option });

    if (user) {
      this.logger.info("Updating user mode...");
      await this.responseModel.updateOne({ userId: this.payload.user.id }, { mood: this.payload.actions[0].selected_option.value });
    }

    this.logger.info("Updated user mode");
    this.slack.chat.postMessage(userFavoriteHobbiesMessageMenuQuestion);
  }

  /**
   * This is a generic response handler
   */
  async handleDefaultResponse () {
    this.slack.chat.postMessage({
      channel: this.payload.channel.id,
      text: "thank you",
    });
  }
}

module.exports = ResponseHandlers;