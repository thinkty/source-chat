const { IntentsClient } = require('@google-cloud/dialogflow');

/**
 * This function sends the intents to Dialogflow and updates the state
 * transition table with the latest intents
 *
 * @param {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]} intents
 */
function update(intents, agent) {
  const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
  const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;

  console.log(`${clientEmail}, ${privateKey}, ${projectId}`);

  const client = new IntentsClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    projectId,
  });
}

module.exports = { update };
