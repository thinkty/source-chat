/**
 * This module initializes various adapters if needed.
 * - Discord : requires initialization due to websocket usage
 * - Slack : needs to setup route
 */
const { Router } = require('express');
const { DiscordAdapter } = require('./discord');
const { slackRouter } = require('./slack');

const router = Router();
router.use('/slack', slackRouter);

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
