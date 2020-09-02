/**
 * This module initializes various adapters if needed.
 * - Discord : requires initialization due to websocket usage
 * - Slack : needs to setup route
 */
const { Router } = require('express');
const { DiscordAdapter } = require('./discord');
const { slackRouter } = require('./slack');
const { customRouter } = require('./custom');

const router = Router();
router.use('/slack', slackRouter);
router.use('/custom', customRouter);

function init() {
  if (process.env.DISCORD_TOKEN) {
    DiscordAdapter.login(process.env.DISCORD_TOKEN);
  }
}

/**
 * Terminate all open connections for cleanup
 */
function close() {
  if (process.env.DISCORD_TOKEN) {
    DiscordAdapter.destroy();
  }
}

module.exports = {
  initializeAdapters: init,
  closeAdapters: close,
  adapterRouter: router,
};
