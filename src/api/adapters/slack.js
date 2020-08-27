const { Router } = require('express');
const { default: axios } = require('axios');
const { handleUserInput } = require('./handler');
const logger = require('../../utils/logger');

/**
 * Helper function to send messages to the specified Slack channel
 *
 * @param {string} channel Channel to send the responses to
 * @param {string[]} texts Messages to send
 */
function sendTexts(channel, texts) {
  axios.post('https://slack.com/api/chat.postMessage', {
    channel,
    text: texts.join('\n'),
  },
  { headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` } })
    .then(() => {
      logger.info(`<- Slack | ${channel} | ${texts.toString()}`);
    })
    .catch((reason) => {
      logger.error(typeof reason === 'string' ? reason : JSON.stringify(reason));
    });
}

/**
 * Helper method to handle event callbacks from Slack
 *
 * @param {object} payload Payload from Slack that contains event type, user id,
 * user input, etc
 */
async function handleEventCallbacks(payload) {
  const { event } = payload;
  const {
    type,
    bot_id: botId,
    text,
    user,
    channel,
  } = event;

  // Ignore messages from bots including self
  if (botId) {
    return;
  }

  switch (type) {
    case 'message':
      logger.info(`-> Slack | ${user}, ${channel} | ${text}`);
      await handleUserInput(user, text)
        .then((messages) => {
          sendTexts(channel, messages.map((message) => message.text.text));
        });
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
 * - `event_callback` are Web API events such as direct messages, mentions, etc.
 *
 * @see https://api.slack.com/events
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {function} next Error handler
 */
function handleSlackEvents(req, res, next) {
  try {
    const { body } = req;
    const { type, challenge } = body;

    switch (type) {
      case 'url_verification':
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
