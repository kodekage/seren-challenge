require('dotenv').config()
const express = require('express')
const { WebClient } = require('@slack/web-api')
const { Mood, CallbackTypes } = require('./utils/enums')
const ResponseHandlers = require('./utils/handlers')
const ResponseModel = require('./models/response.model')
const mongoConnection = require('./config/mongoose')
const pinoLogger = require('./config/logger')

const app = express()
const port = process.env.PORT || 3000
const logger = pinoLogger.logger
// Initialize Slack Web Client
const web = new WebClient(process.env.SLACK_BOT_TOKEN)
// Connect to Mongo Atlas
mongoConnection()

app.use(express.urlencoded({ extended: true}))
// app.use(pinoLogger)

app.get('/', async (req, res) => {
    try {
        const response = new ResponseModel({ userId: '123', userName: 'prosper', mood: 'happy', hobby: 'sleep' })

        await response.save()
        res.end('Welcome to the Seren bot');
    } catch (error) {
        logger.error({ message: error.message })
        res.status(400).json({ status: 400, message: error.message })
    }
})

app.post('/respond', (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const responseHandlers = new ResponseHandlers(web, payload)

    switch(payload.callback_id) {
        case CallbackTypes.USER_MOOD:
            responseHandlers.handleUserModeResponse().catch(error => logger.error({ message: 'Error', error }))
            return res.end()
        case CallbackTypes.USER_HOBBY:
            responseHandlers.handleUserHobbyResponse().catch(error => logger.error({ message: 'Error', error }))
            return res.end()
        default:
            responseHandlers.handleDefaultResponse().catch(error => logger.error({ message: 'Error', error }))
            return res.end()
    }
})

app.post('/messages', async (req, res) => {
    logger.info({ message: 'Bot Received a message', body: req.body })

    if (req.body.text !== 'hello') {
        return res.end(`Hi <@${req.body.user_id}>, to interact with me, you need to send 'Hello' messge`)
    }
    
    const user = await ResponseModel.findOne({ userId: req.body.user_id }).exec()
    logger.info({ message: 'User', user })

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

    logger.info({ message: 'User Mood Menu Questions', userMoodMenuQuestion })
    web.chat.postMessage(userMoodMenuQuestion);
    
    res.end()
})

app.get('/response/:userName', async (req, res) => {
    const user = await ResponseModel.findOne({ userName: req.params.userName }).exec()

    res.status(200).json({
        status: 200,
        data:{
            response: [
                {
                    question: 'How are you feeling',
                    answer: user.mood
                },
                {
                    question: 'What are your favorite hobbies?',
                    answer: user.hobby
                },
            ]
        }
    })

})

app.listen(port, () => console.log('App Server running on port: ', port))