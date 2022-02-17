const pino = require("pino");
const pinoLogger = require("pino-http")({
  // Reuse an existing logger instance
  logger: pino({
        redact: [
            "body.token",
            "body.user_id",
            "body.user_name",
            "user.userId",
        ],
        prettyPrint: {
        levelFirst: true
        }
    }),

  // Define a custom request id function
  genReqId: function (req) { return req.id; },

  // Define custom serializers
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  },

  // Set to `false` to prevent standard serializers from being wrapped.
  wrapSerializers: true,

  // Logger level is `info` by default
  useLevel: "debug",

  // Define a custom success message
  customSuccessMessage: function (res) {
    if (res.statusCode === 404) {
      return "resource not found";
    }
    return "request completed";
  },

  // Define a custom receive message
  customReceivedMessage: function (req) {
    return "request received: " + req.method;
  },

  // Define a custom error message
  customErrorMessage: function (error, res) {
    return "request errored with status code: " + res.statusCode;
  },
  // Override attribute keys for the log object
  customAttributeKeys: {
    req: "request",
    res: "response",
    err: "error",
    responseTime: "timeTaken"
  },

  // Define additional custom request properties
  customProps: function (req,res) {
    return {
      customProp: req.customProp,
      // user request-scoped data is in res.locals for express applications
      customProp2: res.locals.myCustomData
    };
  }
});

module.exports = pinoLogger;