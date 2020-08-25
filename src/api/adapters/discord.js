const Discord = require('discord.js');
const logger = require('../../utils/logger');
const { handleUserInput } = require('./handler');

const client = new Discord.Client();

client.on('ready', () => {
  logger.info('Discord adapter ready');
});

client.on('error', (error) => {
  logger.error(error.message);
});

/**
 * Handle incoming messages and send the response back to the user
 */
client.on('message', async (message) => {
  const { content, channel, author } = message;
  const { id, username } = author;

  // Ignore messages from the bot itself
  if (username === process.env.DISCORD_BOT_NAME) {
    return;
  }

  logger.info(`Discord | ${id} | ${content}`);

  await handleUserInput(id, content)
    .then((response) => {
      channel.send(response);
    })
    .catch((error) => {
      logger.error(error);
    });
});

module.exports = { DiscordAdapter: client };
