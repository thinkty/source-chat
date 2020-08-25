/**
 * Entry point for the 'dialogflow editor server'. This file starts the server
 * using the Express framework with the following middlewares:
 *
 * - morgan: log HTTP requests to the server
 * - cors: enable CORS mechanism for all origin
 * - body parser: parse request body
 * - error handling middleware to send status 500
 *
 * In addition to the middlewares, setup the route with the Router from the APIs
 * and also connect to the database with the given url
 */

require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const router = require('./api/index');
const { StateTable } = require('./api/stateTable');

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
app.use((err, req, res, next) => {
  logger.error(err);
  if (typeof err === 'string') {
    res.status(500).send(err);
  } else {
    res.sendStatus(500);
  }
});
app.use('/', router);

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.once('open', () => { logger.info('MongoDB connection open'); });
mongoose.connection.on('error', () => { logger.error('MongoDB error'); });
mongoose.connection.on('disconnected', () => { logger.info('MongoDB disconnected'); });

StateTable.update();

app.listen(port, logger.info(`Listening on port: ${port}`));
