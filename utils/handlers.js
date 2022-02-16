const pinoLogger = require("../config/logger");
const ResponseModel = require("../models/response.model");
const { Hobby } = require("./enums");

class ResponseHandlers {
    constructor(slackWeb = null, payload = null) {
        this.payload = payload
        this.slack = slackWeb
        this.responseModel = ResponseModel
        this.logger = pinoLogger.logger
    }

    async handleUserHobbyResponse() {
        const user = this.responseModel.findOne({ userId: this.payload.user.id })
        this.logger.info({ message: 'SELECTED HOOBY OPTION', hobby: this.payload.actions[0].selected_options[0].value })

        if (user) {
            this.logger.info('Updating user hobby...')
            await this.responseModel.updateOne({ userId: this.payload.user.id }, { hobby: this.payload.actions[0].selected_options[0].value })
        }

        this.logger.info('Updated user hobby')
        this.slack.chat.postMessage({
            channel: this.payload.channel.id,
            text: "thank you",
        })
    }

    async handleUserModeResponse() {
        const userFavoriteHobbiesMessageMenuQuestion = {
            channel: this.payload.channel.id,
            text: "What are your favorite hobbies?",
            response_type: "in_channel",
            attachments: [
                {
                  "type": "section",
                  "block_id": "section678",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Pick items from the list"
                  },
                  "accessory": {
                    "action_id": "text1234",
                    "type": "multi_static_select",
                    "placeholder": {
                      "type": "plain_text",
                      "text": "Select items"
                    },
                    "options": [
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "*this is plain_text text*"
                        },
                        "value": "value-0"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "*this is plain_text text*"
                        },
                        "value": "value-1"
                      },
                      {
                        "text": {
                          "type": "plain_text",
                          "text": "*this is plain_text text*"
                        },
                        "value": "value-2"
                      }
                    ]
                  }
                }
            ]
            // attachments: [
            //     {
            //         text: "Choose your favorite hobby",
            //         fallback: "If you could read this message, you'd be choosing something fun to do right now.",
            //         color: "#3AA3E3",
            //         attachment_type: "default",
            //         callback_id: "hobby_selection",
            //         actions: [
            //             {
            //                 name: "hobby_list",
            //                 text: "What is your favorite hobby?",
            //                 type: "select",
            //                 options: [
            //                     {
            //                         "text": "Football",
            //                         "value": Hobby.FOOTBALL
            //                     },
            //                     {
            //                         "text": "Music",
            //                         "value": Hobby.MUSIC
            //                     },
            //                     {
            //                         "text": "Sleep",
            //                         "value": Hobby.SLEEP
            //                     },
            //                     {
            //                         "text": "Movies",
            //                         "value": Hobby.MOVIES
            //                     },
            //                     {
            //                         "text": "Basketball",
            //                         "value": Hobby.BASKETBALL
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
            // ]
        }
        this.logger.info({ message: 'User Hobby Menu Questions', userFavoriteHobbiesMessageMenuQuestion })

        // const user = this.responseModel.findOne({ userId: this.payload.user.id })
        this.logger.info({ message: 'SELECTED MODE OPTION', mood: this.payload.actions[0].selected_options})

        // if (user) {
        //     this.logger.info('Updating user mode...')
        //     await this.responseModel.updateOne({ userId: this.payload.user.id }, { mood: this.payload.actions[0].selected_options[0].value })
        // }

        // this.logger.info('Updated user mode')
        this.slack.chat.postMessage(userFavoriteHobbiesMessageMenuQuestion);
    }

    handleDefaultResponse () {
        this.slack.chat.postMessage({
            channel: this.payload.channel.id,
            text: "thank you",
        })
    }
}

module.exports = ResponseHandlers