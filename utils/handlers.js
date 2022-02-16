const ResponseModel = require("../models/response.model");
const { Hobby } = require("./enums");

class ResponseHandlers {
    constructor(slackWeb = null, payload = null) {
        this.payload = payload
        this.slack = slackWeb
        this.responseModel = ResponseModel
    }

    async handleUserHobbyResponse() {
        const user = this.responseModel.findOne({ userId: this.payload.user.id })

        if (user) {
            console.log('SELECTED HOOBY OPTION -> ', this.payload.actions[0].selected_options[0].value)
            await this.responseModel.updateOne({ userId: this.payload.user.id }, { hobby: this.payload.actions[0].selected_options[0].value })
        }

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
                    text: "Choose your favorite hobby",
                    fallback: "If you could read this message, you'd be choosing something fun to do right now.",
                    color: "#3AA3E3",
                    attachment_type: "default",
                    callback_id: "hobby_selection",
                    actions: [
                        {
                            name: "hobby_list",
                            text: "What is your favorite hobby?",
                            type: "select",
                            options: [
                                {
                                    "text": "Football",
                                    "value": Hobby.FOOTBALL
                                },
                                {
                                    "text": "Music",
                                    "value": Hobby.MUSIC
                                },
                                {
                                    "text": "Sleep",
                                    "value": Hobby.SLEEP
                                },
                                {
                                    "text": "Movies",
                                    "value": Hobby.MOVIES
                                },
                                {
                                    "text": "Basketball",
                                    "value": Hobby.BASKETBALL
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        const user = this.responseModel.findOne({ userId: this.payload.user.id })

        if (user) {
            console.log('SELECTED MOOD OPTION -> ', this.payload.actions[0].selected_options[0].value)
            await this.responseModel.updateOne({ userId: this.payload.user.id }, { mood: this.payload.actions[0].selected_options[0].value })
        }

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