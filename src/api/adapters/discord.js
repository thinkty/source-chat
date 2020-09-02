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
client.on('message', async (discordMessage) => {
  const { content, channel, author } = discordMessage;
  const { id, username } = author;

  // Ignore messages from the bot itself
  if (username === process.env.DISCORD_BOT_NAME) {
    return;
  }

  logger.info(`-> Discord | ${id} | ${content}`);

  await handleUserInput(id, content)
    .then((messages) => {
      messages.forEach((message) => {
        const { text, payload } = message;
        if (text) {
          channel
            .send(text.text)
            .then(() => logger.info(`<- Discord | ${id} | ${text.text}`));
        } else if (payload) {
          /* Your code to handle custom payloads */
          logger.info(payload);
        }
      });
    })
    .catch((error) => {
      logger.error(typeof error === 'string' ? error : JSON.stringify(error));
    });
});

module.exports = { DiscordAdapter: client };
