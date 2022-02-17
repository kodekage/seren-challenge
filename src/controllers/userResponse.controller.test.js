/* eslint-env jest */
const mongoose = require("../config/mongoose");
const { mockRequest, mockResponse, jsonResponse } = require("../utils/helpers");
const userResponseController = require("./userResponse.controller");

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

describe("userResponseController", () => {
  beforeAll(() => {
    mongoose.mockImplementation(() => jest.fn());
  });


  test("Should return status code 200 and json payload when correct user params is passed", async() => {
    const param = { params: { userName: "prosper" }};
    const req = mockRequest(null, param);
    const res = mockResponse();

    await userResponseController(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(jsonResponse);
  });
});