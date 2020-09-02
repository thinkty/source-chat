const { Router } = require('express');
const { default: axios } = require('axios');
const { handleUserInput } = require('./handler');
const logger = require('../../utils/logger');

/**
 * Function to handle messages coming in through the custom route. A custom
 * route is used for interacting with platforms such as your web application, a
 * React component to show a chatroom, and more.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {function} next Error handler
 */
function handleMessage(req, res, next) {
  try {
    const { body } = req;

    /* Your function to parse and handle message goes here */

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

const router = Router();
router.post('/message', handleMessage);

module.exports = { customRouter: router };
