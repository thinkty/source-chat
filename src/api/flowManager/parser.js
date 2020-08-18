const { Intent } = require('@google-cloud/dialogflow').protos.google.cloud.dialogflow.v2;

/**
 * This function parses the intents from the graph and returns it.
 *
 * @param graph Graph object
 * @returns {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]}
 * An array of intents
 */
function parse(graph) {
  const intent = new Intent({});
  
}

module.exports = { parse };
