const { Router } = require('express');
const { handleUserInput } = require('./handler');
const logger = require('../../utils/logger');

/**
 * 
 * @param {object} payload Payload from Slack that contains event type, user id,
 * user input, etc
 */
async function handleEventCallbacks(payload) {
  const { event } = body;
  const { type, bot_id } = event;

  switch (type) {
    case 'message':
      
      break;

    case 'app_mention':

      break;

    default:
      logger.error(`Unexpected event callback type: ${type}`);
      break;
  }
}

/**
 * Function to handle slack events by event type
 * - `url_verification` event is sent when the user first adds the server's url
 * on slack
 * - `event_callback` are Web API events such as direct messages and mentions
 *
 * @see https://api.slack.com/events
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {function} next Error handler
 */
function handleSlackEvents(req, res, next) {
  try {
    const { body } = req;
    const { type } = body;

    switch (type) {
      case 'url_verification':
        const { challenge } = body;
        res.send(challenge);
        break;
      
      case 'event_callback':
        res.sendStatus(200); // Need to reply with 200
        handleEventCallbacks(body);
        break;
    
      default:
        throw `Slack | Unexpected event type ${type}`;
    }
  } catch (error) {
    next(error);
  }
}

const router = Router();
router.post('/events', handleSlackEvents); // /slack/events

module.exports = { slackRouter: router };
