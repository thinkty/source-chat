const winston = require('winston');

/**
 * Create a winston logger object that saves logs to 'error.log' and 'info.log'.
 *
 * @see https://stackoverflow.com/questions/27906551/node-js-logging-use-morgan-and-winston/28824464
 */
const logger = new winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      level: 'error',
      filename: './logs/error.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      colorize: true,
    }),
    new winston.transports.File({
      level: 'info',
      filename: './logs/info.log',
      handleExceptions: false,
      json: true,
      maxsize: 5242880,
      colorize: true,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
