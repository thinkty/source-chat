const logger = require('../../utils/logger');
const { validate } = require('./validator');
const { parse } = require('./parser');
const { update } = require('./updater');

/**
 * This function handles updating Dialogflow and the state transition table. The
 * process involves the following steps:
 * 1. Validating: check that the graph is valid
 * 2. Parsing: parse and create intents from the graph
 * 3. Updating: send the parsed intents to dialogflow and update the state table
 *
 * @param {import("express").Request} req Request from the editor
 * @param {import("express").Response} res Express response object
 */
function handleGraph(req, res) {
  const { body } = req;
  const { agent, flowchart, graph } = body;

  logger.info(`Received graph for ${agent}/${flowchart}`);

  // Step 1
  validate(graph);

  // Step 2
  const intents = parse(graph);

  // Step 3
  update(intents);

  res.sendStatus(200);
}

module.exports = { handleGraph };
