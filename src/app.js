/**
 * Entry point for the 'dialogflow editor server'. This file starts the server
 * using the Express framework with the following middlewares:
 *
 * - morgan: log HTTP requests to the server
 * - cors: enable CORS mechanism for all origin
 * - body parser: parse request body
 *
 * In addition to the middlewares, setup the route with the Router from the APIs
 */

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const router = require('./api/index');
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

app.use('/', router);

app.listen(port, logger.info(`Listening on port: ${port}`));
