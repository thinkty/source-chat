/**
 * Entry point for the 'dialogflow editor server'. This file starts the server
 * using the Express framework with the following middlewares:
 *
 * - morgan: log HTTP requests to the server
 * - cors: enable CORS mechanism for all origin
 * - body parser: parse request body
 */

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('common', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
}));

app.get('/', (req, res) => {
  logger.info('yeet');
  res.sendStatus(200);
});

app.listen(port, logger.info(`Listening on port: ${port}`));
