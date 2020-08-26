/**
 * This module initializes various adapters if needed.
 * - Discord : requires initialization due to websocket usage
 */

const { DiscordAdapter } = require('./discord');

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
};
