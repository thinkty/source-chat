const { IntentsClient } = require('@google-cloud/dialogflow');

/**
 * Helper function to remove all the previous intents from Dialogflow so that
 * the new intents can be updated without causing the issue of duplicate names
 *
 * @param {import("@google-cloud/dialogflow").v2.IntentsClient} client 
 */
async function removePreviousIntents(client) {
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  const parent = `projects/${projectId}/agent`;
  const intents = await client.listIntents({ parent });

  await client.batchDeleteIntents({ parent, intents });
}

/**
 * This function sends the intents to Dialogflow and updates the state
 * transition table with the latest intents. Before sending the new intents to
 * Dialogflow, it must first get rid of the past intents. This is done by clear-
 * ing out the current intents from Dialogflow
 *
 * @param {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]} intents
 */
async function update(intents) {
  const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
  const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY;
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;

  const client = new IntentsClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    projectId,
  });

  await removePreviousIntents(client);
}

module.exports = { update };
