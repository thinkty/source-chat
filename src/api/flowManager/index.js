const logger = require('../../utils/logger');
const { validate } = require('./validator');
const { parse } = require('./parser');
const { update } = require('./updater');
const { StateTable } = require('../stateTable');

/**
 * This function handles updating Dialogflow and the state transition table. The
 * process involves the following steps:
 * 1. Validating: check that the graph is valid
 * 2. Parsing: parse and create intents from the graph
 * 3. Updating: send the parsed intents to dialogflow
 * 4. Updating: update the state table with the new intents from Dialogflow
 *
 * @param {import("express").Request} req Request from the editor
 * @param {import("express").Response} res Express response object
 */
async function handleGraph(req, res) {
  const { body } = req;
  const { agent, graph } = body;

  logger.info(`Received graph for ${agent}`);

  // Step 1
  const { intentNodes, contextNodes } = validate(graph);

  // Step 2
  const intents = parse(intentNodes, contextNodes);

  // Step 3
  await update(intents);

  // Step 4
  await StateTable.update();

  res.sendStatus(200);
}

module.exports = { handleGraph };
