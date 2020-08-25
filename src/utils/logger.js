const { createLogger, format, transports } = require('winston');

const { combine, printf } = format;
const customFormat = printf(({ level, message, timestamp }) => (
  `${timestamp} ${level}: ${message}`
));

const transportsList = [
  new transports.File({
    level: 'error',
    filename: './logs/error.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    colorize: true,
    format: combine(format.timestamp(), customFormat),
  }),
  new transports.File({
    level: 'info',
    filename: './logs/info.log',
    handleExceptions: false,
    maxsize: 5242880,
    colorize: true,
    format: combine(format.timestamp(), customFormat),
  }),
];

// Don't print to console when testing
if (process.env.NODE_ENV !== 'test') {
  transportsList.push(
    new transports.Console({
      format: combine(format.timestamp(), customFormat),
    }),
  );
}

/**
 * Create a winston logger object that saves logs to 'error.log', 'info.log' and
 * also to the console. Each message is formatted with a custom format
 *
 * @see https://stackoverflow.com/questions/27906551/node-js-logging-use-morgan-and-winston/28824464
 */
const logger = createLogger({
  transports: transportsList,
  exitOnError: false,
});

module.exports = logger;
