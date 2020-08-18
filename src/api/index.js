/**
 * This module defines the basic routes for the server's APIs
 * [GET]
 * - / : send 200 status
 *
 * [POST]
 * - /flow : handles updating Dialogflow and the state transition table
 */

const express = require('express');
const { handleGraph } = require('./flowManager/index');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

router.post('/flow', (req, res, next) => {
  try {
    handleGraph(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
