/* eslint-env jest */
const mongoose = require("../config/mongoose");
const { mockRequest, mockResponse, moodPayload } = require("../utils/helpers");
const respondController = require("./respond.controller");

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

describe("respondController", () => {
  beforeAll(() => {
    mongoose.mockImplementation(() => jest.fn());
  });


  test("Should call handler when correct payload is passed", async() => {
    const body = {
      payload: moodPayload,
    };
    const req = mockRequest(body);
    const res = mockResponse();

    await respondController(req, res);
    
    expect(res.end).toHaveBeenCalledWith();
  });

  test("Should throw syntax error when incorrect payload is passed", () => {
    const body = {};
    const req = mockRequest(body);
    const res = mockResponse();
    
    expect(() => { respondController(req, res); }).toThrow(SyntaxError);
  });
});