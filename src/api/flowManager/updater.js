const { IntentsClient } = require('@google-cloud/dialogflow');

/**
 * This function sends the intents to Dialogflow and updates the state
 * transition table with the latest intents
 *
 * @param {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]} intents
 */
function update(intents) {
  const client = new IntentsClient({});
}

module.exports = { update };
