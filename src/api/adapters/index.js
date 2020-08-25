/**
 * This module initializes various adapters if needed.
 * - Discord : requires initialization due to websocket usage
 */

const { DiscordAdapter } = require("./discord");

function init() {
  DiscordAdapter.login(process.env.DISCORD_TOKEN);
}

module.exports = { initializeAdapters: init };
