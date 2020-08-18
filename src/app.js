/**
 * Entry point for the 'dialogflow editor server'. This file starts the server
 * using the Express framework and additional middle-wares such as morgan, cors,
 * body parser.
 */

const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');

const port = process.env.PORT || 8080;
const app = express();

// Log http requests
app.use(morgan('common', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
}));

// Parse request body in the middle
app.use(bodyParser.json());

app.get('/', (req, res) => {
  logger.info('yeet');
  res.sendStatus(200);
});

app.listen(port, logger.info(`Listening on port: ${port}`));
