require('dotenv').config()
const express = require('express')
const { WebClient } = require('@slack/web-api')
const { Mood, CallbackTypes } = require('./utils/enums')
const ResponseHandlers = require('./utils/handlers')
const ResponseModel = require('./models/response.model')
const mongoConnection = require('./config/mongoose')

const app = express()
const port = process.env.PORT || 3000;
// Initialize Slack Web Client
const web = new WebClient(process.env.SLACK_BOT_TOKEN)
// Connect to Mongo Atlas
mongoConnection()

app.use(express.urlencoded({ extended: true}))

app.get('/', async (req, res) => {
    try {
        const response = new ResponseModel({ userId: '123', userName: 'prosper', mood: 'happy', hobby: 'sleep' })

        await response.save()
        res.end('Welcome to the Seren bot');
    } catch (error) {
        console.log(error)
    }
})

app.post('/respond', (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const responseHandlers = new ResponseHandlers(web, payload)

    switch(payload.callback_id) {
        case CallbackTypes.USER_MOOD:
            responseHandlers.handleUserModeResponse().catch(error => console.log(error))
            return res.end()
        case CallbackTypes.USER_HOBBY:
            responseHandlers.handleUserHobbyResponse().catch(error => console.log(error))
            return res.end()
        default:
            responseHandlers.handleDefaultResponse().catch(error => console.log(error))
            return res.end()
    }
})

app.post('/messages', async (req, res) => {
    console.log('POST MESSAGES ', req.body)

    if (req.body.text !== 'hello') {
        return res.end(`Hi <@${req.body.user_id}>, to interact with me, you need to send 'Hello' messge`)
    }
    
    const user = await ResponseModel.findOne({ userId: req.body.user_id }).exec()
    console.log('\nUser ---> ', user, '\n');

    if (!user) {
        const response = new ResponseModel({ userId: req.body.user_id , userName: req.body.user_name })
        await response.save()
    }

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