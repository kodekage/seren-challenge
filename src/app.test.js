/* eslint-env jest */
const request = require("supertest");
const { app } = require("./app");
const mongoose = require("./config/mongoose");
const ResponseHandlers = require("./utils/handlers");


ResponseHandlers;

jest.mock("./config/mongoose");
jest.mock("./models/response.model", () => {
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
jest.mock("./config/logger", () => {
  const logger = {
      info(){ return  jest.fn(); },
      error(){ return jest.fn(); }
  };
  return { logger };
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

    beforeAll(() => {
      mongoose.mockImplementation(() => jest.fn());
    });

  test("Root endpoint should return 200 status code", async () => {
    return request(app)
      .get("/")
      .expect(200);
  });

  test("User response endpoint should return 200 status code", async () => {
    return request(app)
      .get("/response/oparaprosper79")
      .expect(200)
      .then(response => {
        expect(response.body.data).toEqual({
          response: [
          {
            question: "How are you feeling",
            answer: "neutral"
          },
          {
            question: "What are your favorite hobbies?",
            answer: [
              "football",
              "sleep"
            ]
            }
          ]
        });
      });
  });

  test("Messages Endpoint should return 200 status code", async () => {
    return request(app).post("/messages").expect(200);
  });

  test("Respond Endpoint should return 500 when payload is absent", async () => {
    return request(app).post("/respond").expect(500);
  });
});