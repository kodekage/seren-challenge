require('dotenv').config()
const express = require('express')
const { WebClient } = require('@slack/web-api');
const { Mood, CallbackTypes } = require('./utils/enums');
const Handlers = require('./utils/handlers');


const app = express()
const port = process.env.PORT || 3000;
// Initialize Slack Web Client
const web = new WebClient(process.env.SLACK_BOT_TOKEN)

app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.end('Welcome to the Seren bot');
})

app.post('/respond', (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const handlers = new Handlers(web, payload)

    switch(payload.callback_id) {
        case CallbackTypes.USER_MOOD:
            handlers.handleUserModeResponse()
            return res.end()
        default:
            handlers.handleDefaultResponse()
            return res.end()
    }
})

app.post('/messages', async (req, res) => {
    console.log('POST MESSAGES ', req.body)

    const userMoodMenuQuestion = {
        channel: req.body.channel_id,
        text: "Welcome. How are you doing?",
        response_type: "in_channel",
        attachments: [
            {
                text: "Choose an option that reflects how your mood",
                fallback: "If you could read this message, you'd be choosing something fun to do right now.",
                color: "#3AA3E3",
                attachment_type: "default",
                callback_id: "user_mood",
                actions: [
                    {
                        name: "feeling_list",
                        text: "How are you doing?",
                        type: "select",
                        options: [
                            {
                                "text": "Doing Well",
                                "value": Mood.FEELING_WELL
                            },
                            {
                                "text": "Neutral",
                                "value": Mood.FEELING_NEUTRAL
                            },
                            {
                                "text": "Feeling Lucky",
                                "value": Mood.FEELING_LUCKY
                            }
                        ]
                    }
                ]
            }
        ]
    }

    web.chat.postMessage(userMoodMenuQuestion);
    
    res.end()
})

app.listen(port, () => console.log('App Server running on port: ', port))