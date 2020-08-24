const { IntentsClient } = require('@google-cloud/dialogflow');

/**
 * Helper function to remove all the previous intents from Dialogflow so that
 * the new intents can be updated without causing the issue of duplicate names
 *
 * @param {string} projectId
 * @param {import("@google-cloud/dialogflow").v2.IntentsClient} client
 */
async function removePreviousIntents(projectId, client) {
  const parent = `projects/${projectId}/agent`;
  const result = await client.listIntents({ parent });
  const intents = result[0];

  if (intents.length > 0) {
    await client.batchDeleteIntents({ parent, intents });
  }
}

/**
 * Helper function to send the new intents to Dialogflow
 *
 * @param {string} projectId
 * @param {import("@google-cloud/dialogflow").v2.IntentsClient} client
 * @param {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent[]} intents
 */
async function updateNewIntents(projectId, client, intents) {
  await client.batchUpdateIntents({
    parent: `projects/${projectId}/agent`,
    intentBatchInline: { intents },
  });
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
  const env = process.env.NODE_ENV;
  const clientEmail = env === 'debug' ? process.env.DEBUG_DIALOGFLOW_CLIENT_EMAIL : process.env.DIALOGFLOW_CLIENT_EMAIL;
  const privateKey = (env === 'debug' ? process.env.DEBUG_DIALOGFLOW_PRIVATE_KEY : process.env.DIALOGFLOW_PRIVATE_KEY).replace(/\\n/g, '\n');
  const projectId = env === 'debug' ? process.env.DEBUG_DIALOGFLOW_PROJECT_ID : process.env.DIALOGFLOW_PROJECT_ID;

  const client = new IntentsClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    projectId,
  });

  await removePreviousIntents(projectId, client);
  await updateNewIntents(projectId, client, intents);
}

module.exports = { update };
