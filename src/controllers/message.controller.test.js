/* eslint-env jest */
const { WebClient } = require("@slack/web-api");
const { messageController } = require("../app");
const mongoose = require("../config/mongoose");
const { mockRequest, mockResponse } = require("../utils/helpers");

jest.mock("../config/mongoose");
jest.mock("../models/response.model", () => {
  const methods = {
    findOne: jest.fn(() => ({
      exec: jest.fn(() => ({
        mood: "neutral",
        hobbies: ["football", "sleep"]
      }))
    })),
    updateOne: jest.fn(),
    save: jest.fn(),
  };
  return methods;
});
jest.mock("../config/logger", () => {
  const logger = {
    info(){ return  jest.fn(); },
    error(){ return jest.fn(); },
    debug(){ return jest.fn(); },
    warn() { return jest.fn(); }
  };
  return logger;
});

jest.mock("@slack/web-api", () => {
  const mSlack = {
    chat: {
      postMessage: jest.fn(),
    },
  };
  return { WebClient: jest.fn(() => mSlack) };
});

describe("MessageController", () => {
  let slack;

  beforeAll(() => {
    mongoose.mockImplementation(() => jest.fn());
    slack = new WebClient();
  });

  test("Should respond null when 'hello' message is sent", async() => {
    const body = {
      "channel_id": "C033XMZN9CH",
      "channel_name": "intro",
      "user_id": "U12345",
      "text": "hello"
    };
    const chat = {
      "channel": "C033XMZN9CH",
      "text": "Welcome. How are you doing?",
      "attachments": [
        {
          "color": "#f2c744",
          "blocks": [
            {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "Choose an option that reflects how your mood"
              },
              "accessory": {
                "type": "static_select",
                "placeholder": {
                  "type": "plain_text",
                  "text": "Select mood",
                  "emoji": true
                },
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Feeling Lucky",
                      "emoji": true
                    },
                    "value": "Feeling Lucky"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Neutral",
                      "emoji": true
                    },
                    "value": "Neutral"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Doing Well",
                      "emoji": true
                    },
                    "value": "Doing Well"
                  }
                ],
                "action_id": "user_mood"
              }
            }
          ]
        }
      ]
    };
    const req = mockRequest(body);
    const res = mockResponse();

    await messageController(req, res);
    
    expect(res.end).toHaveBeenCalledWith();
    expect(slack.chat.postMessage).toBeCalledWith(chat);
  });

  test("Should respond when 'hello' message is sent", async() => {
    const body = {
      "channel_id": "C033XMZN9CH",
      "channel_name": "intro",
      "user_id": "U12345",
      "text": "hi"
    };

    const req = mockRequest(body);
    const res = mockResponse();

    await messageController(req, res);
    
    expect(res.end).toHaveBeenCalledWith(`Hi <@${body.user_id}>, to interact with me, you need to send 'Hello' messge`);
  });
});