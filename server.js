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
app.use(pinoLogger)

app.get('/', async (req, res) => {
    res.end('Welcome to the Seren bot')
})

app.post('/respond', (req, res) => {
    const payload = JSON.parse(req.body.payload)
    const responseHandlers = new ResponseHandlers(web, payload)

    switch(payload.actions[0].action_id) {
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
                    answer: user.hobbies
                },
            ]
        }
    })

})

app.listen(port, () => console.log('App Server running on port: ', port))