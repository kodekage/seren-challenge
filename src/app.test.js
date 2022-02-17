/* eslint-env jest */
const request = require("supertest");
const nock = require("nock");
const { app, messageController } = require("./app");
const mongoose = require("./config/mongoose");
const { WebClient } = require("@slack/web-api");
const ResponseHandlers = require("./utils/handlers");
const mockExpress = require("@jest-mock/express");


ResponseHandlers;


jest.mock("./config/mongoose");
jest.mock("./config/logger", () => {
  const logger = {
      info(){ return  jest.fn(); },
      error(){ return jest.fn(); }
  };
  return { logger };
});
jest.mock("./utils/handlers", () => {
  const methods = {
    constructor: jest.fn(),
    handleUserHobbyResponse: jest.fn(),
    handleUserModeResponse: jest.fn(),
    handleDefaultResponse: jest.fn(),
  };
  const ResponseHandlers = jest.fn(() => methods);

  return ResponseHandlers;
});

jest.mock("@slack/web-api", () => {
  const mSlack = {
    chat: {
      postMessage: jest.fn(),
    },
  };
  return { WebClient: jest.fn(() => mSlack) };
});

describe("App", () => {
    let slack, res, req;

    beforeAll(() => {
      mongoose.mockImplementation(() => jest.fn());
      slack = new WebClient();
      mockExpress.getMockRes();
    });

  test("It should response the GET method", async () => {
    return request(app)
      .get("/")
      .expect(200);
  });

  test("Messages Endpoint should return 200 status code", async () => {
    req = mockExpress.getMockReq({
      body: {
        "token": "123456789",
        "team_id": "T012HLUEF2R",
        "team_domain": "kodekagedev",
        "channel_id": "C012X18492S",
        "channel_name": "introduction",
        "user_id": "1234",
        "user_name": "prosper",
        "command": "/bot",
        "text": "hello",
        "api_app_id": "A033X9ADU0G",
        "is_enterprise_install": "false",
        "response_url": "https://hooks.slack.com/commands/T012HLUEF2R/3117782386435/D6QGMPpY3WVaemkdSkdl8toP",
      }
    });
    
    // return messageController(req, res).then(res => console.log(res))


    // return expect(slack.chat.postMessage).toBeCalledWith({ text: 'Hello world!', channel: '123' });
    return request(app).post("/messages").expect(200).then(res => {
      console.log(res);
    //   // expect(res.text).toEqual("Hi <@undefined>, to interact with me, you need to send 'Hello' messge")
    });
  });

  // test("Messages Endpoint", async () => {
  //   const body = {
  //     "token": "[Redacted]",
  //     "team_id": "T012HLUEF2R",
  //     "team_domain": "kodekagedev",
  //     "channel_id": "C012X18492S",
  //     "channel_name": "introduction",
  //     "user_id": "",
  //     "user_name": "[Redacted]",
  //     "command": "/bot",
  //     "text": "hello",
  //     "api_app_id": "A033X9ADU0G",
  //     "is_enterprise_install": "false",
  //     "response_url": "https://hooks.slack.com/commands/T012HLUEF2R/3117782386435/D6QGMPpY3WVaemkdSkdl8toP",
  //   }
    // const req = await nock('http://localhost:3000', {}).post('/messages', body).reply(200, 'OK')
    // const req = await request(app).post("/messages").send({ body })

    // console.log(req)

    // expect(200)

    // return request(app).post("/messages").send({ text: 'Hello' }).expect(200).then(res => {
      // console.log(res.)
      // expect(slack.chat.postMessage).toBeCalledWith({ text: 'Hello world!', channel: '123' });
      // expect(res.text).toEqual("Hi <@undefined>, to interact with me, you need to send 'Hello' messge")
  //   });
  // });

  // test("Respond Endpoint should return 200 status code", async () => {
  //   const payload = JSON.stringify({
  //     type: 'block_actions',
  //     user: {
  //       id: 'U012CAEHVF0',
  //       username: 'oparaprosper79',
  //       name: 'oparaprosper79',
  //       team_id: 'T012HLUEF2R'
  //     },
  //     api_app_id: 'A033X9ADU0G',
  //     token: 'hMCBp2D9xVUxhuppThcB5ffb',
  //     container: {
  //       type: 'message_attachment',
  //       message_ts: '1645060182.635749',
  //       attachment_id: 1,
  //       channel_id: 'C012X18492S',
  //       is_ephemeral: false,
  //       is_app_unfurl: false
  //     },
  //     trigger_id: '3141523430816.1085708491093.8557de0c4dd7592178b6742cc44669a9',
  //     team: { id: 'T012HLUEF2R', domain: 'kodekagedev' },
  //     enterprise: null,
  //     is_enterprise_install: false,
  //     channel: { id: 'C012X18492S', name: 'introduction' },
  //     message: {
  //       bot_id: 'B0337H7EKH9',
  //       type: 'message',
  //       text: 'Welcome. How are you doing?',
  //       user: 'U0339S88NH2',
  //       ts: '1645060182.635749',
  //       team: 'T012HLUEF2R',
  //       attachments: [ [Object] ]
  //     },
  //     state: { values: { Nb3: [Object] } },
  //     response_url: 'https://hooks.slack.com/actions/T012HLUEF2R/3130388479713/hfVnM7Q67HlO7sx4JmSe5eO1',
  //     actions: [
  //       {
  //         type: 'static_select',
  //         action_id: 'user_mood',
  //         block_id: 'Nb3',
  //         selected_option: [Object],
  //         placeholder: [Object],
  //         action_ts: '1645060185.661084'
  //       }
  //     ]
  //   })
  //   return request(app).post("/respond").send({ payload: payload }).expect(500).then(response => console.log(response));
  // });
});