const express = require("express");
const mongoConnection = require("./config/mongoose");
const messageController = require("./controllers/message.controller");
const respondController = require("./controllers/respond.controller");
const userResponseController = require("./controllers/userResponse.controller");

const app = express();
// Connect to Mongo Atlas
mongoConnection();

app.use(express.urlencoded({ extended: true}));

app.get("/", async (req, res) => {
  res.end("Welcome to the Seren bot");
});

app.post("/respond", respondController);

app.post("/messages", messageController);

app.get("/response/:userName", userResponseController);

module.exports = { app, messageController };