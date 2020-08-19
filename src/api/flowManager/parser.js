const { Intent } = require('@google-cloud/dialogflow').protos.google.cloud.dialogflow.v2;

/**
 * This function parses the intents from the intent nodes and the context nodes
 * and returns a batch of intents
 *
 * @param {Object[]} intentNodes
 * @param {Object[]} contextNodes
 * @returns {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]}
 * An array of intents
 */
function parse(intentNodes, contextNodes) {
  console.log(intentNodes);
  console.log(contextNodes);
}

module.exports = { parse };
