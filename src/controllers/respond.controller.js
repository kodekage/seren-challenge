const { WebClient } = require("@slack/web-api");
const pinoLogger = require("../config/logger");
const { CallbackTypes } = require("../utils/enums");
const ResponseHandlers = require("../utils/handlers");

const respondController = (req, res) => {
  const logger = pinoLogger.logger;
  // parse payload to object 
  const payload = JSON.parse(req.body.payload);
  //init slack web api
  const web = new WebClient(process.env.SLACK_BOT_TOKEN);

  const responseHandlers = new ResponseHandlers(web, payload);

  switch(payload.actions[0].action_id) {
  case CallbackTypes.USER_MOOD:
    responseHandlers.handleUserModeResponse().catch(error => logger.error({ message: "Error", error }));
    return res.end();
  case CallbackTypes.USER_HOBBY:
    responseHandlers.handleUserHobbyResponse().catch(error => logger.error({ message: "Error", error }));
    return res.end();
  default:
    responseHandlers.handleDefaultResponse().catch(error => logger.error({ message: "Error", error }));
    return res.end();
  }
};

module.exports = respondController;
