/**
 * Adapters handle the part of receiving the messages from the user and sending
 * the responses back to the user. This module (which is not an Adapter) handles
 * the following tasks:
 * - Handling user input based on the user id and user input and actually
 * progressing the user through the flow
 * - Utilizing the adapters to send the response to the user
 */

const { SessionsClient, protos } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');
const { retrieveUser, createUser, updateUser } = require('../../utils/db');
const logger = require('../../utils/logger');
const { StateTable } = require('../stateTable');

/**
 * Helper function to get the state of the given user. If the retrieved document
 * is null, the user does not exist in the database, create the user and return
 * the default value which is 'root'
 *
 * @param {string} id Unique user id
 */
async function getUserState(id) {
  const doc = await retrieveUser(id);

  if (doc == null || doc === '') {
    await createUser(id);
    const newDoc = await retrieveUser(id);
    const { state } = newDoc;
    return state;
  }

  const { state } = doc;
  return state;
}

/**
 * Helper function to generate a session value for Dialogflow
 *
 * @see https://googleapis.dev/nodejs/dialogflow/latest/v2.SessionsClient.html#detectIntent
 * @param {string} projectId
 * @returns {String} Generated session
 */
function generateSession(projectId) {
  return `projects/${projectId}/agent/sessions/${uuidv4()}`;
}

/**
 * Helper function to format Query Parameters based on the given raw context.
 * One can also set the payload of the query parameters to send to the webhook
 * on fulfillment. The lifespan count of the contexts are set to 1 to enable
 * strict control with the server
 *
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.QueryParameters.html
 * @param {string[]} rawContexts Unformatted context value
 * @param {string} projectId
 * @returns Formatted query parameters
 */
function generateQueryParams(rawContexts, projectId) {
  const { QueryParameters, Context } = protos.google.cloud.dialogflow.v2;
  const session = uuidv4();

  return new QueryParameters({
    contexts: rawContexts.map((value) => (
      new Context({
        name: `projects/${projectId}/agent/sessions/${session}/contexts/${value}`,
        lifespanCount: 1,
      })
    )),
  });
}

/**
 * Based on the current state and user input, detect the intent from Dialogflow
 *
 * @param {string[]} states Current user states
 * @param {string} input User input
 */
async function detectIntent(states, input) {
  const env = process.env.NODE_ENV;
  const clientEmail = env === 'debug' ? process.env.DEBUG_DIALOGFLOW_CLIENT_EMAIL : process.env.DIALOGFLOW_CLIENT_EMAIL;
  const privateKey = (env === 'debug' ? process.env.DEBUG_DIALOGFLOW_PRIVATE_KEY : process.env.DIALOGFLOW_PRIVATE_KEY).replace(/\\n/g, '\n');
  const projectId = env === 'debug' ? process.env.DEBUG_DIALOGFLOW_PROJECT_ID : process.env.DIALOGFLOW_PROJECT_ID;

  const client = new SessionsClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    projectId,
  });

  const result = await client.detectIntent({
    session: generateSession(projectId),
    queryInput: {
      text: {
        text: input,
        languageCode: process.env.DIALOGFLOW_LANG,
      },
    },
    queryParams: generateQueryParams(states, projectId),
  });

  return result[0];
}

/**
 * This function is the core of this module. It handles user input and returns a
 * payload to send to the user. The process is as follows:
 * - Retrieve user state from the database with the given id
 * - With the state and user input, query Dialogflow for the intent
 * - Lookup the state transition table with current state and the intent's
 * display name
 * - Update the user's state with the retrieved states
 * - Send the responses
 *
 * @param {string} id Unique ID of the user that will be used to query the
 * database for the current state of the user
 * @param {string} input Input given from the user that will be used to detect
 * an intent from Dialogflow
 * @returns {import("@google-cloud/dialogflow").protos.google.cloud.dialogflow.v2.Intent.Message[]}
 * Payload to send to user
 */
async function handleUserInput(id, input) {
  try {
    const states = await getUserState(id);
    const response = await detectIntent(states, input);

    const { queryResult } = response;
    const { intent, fulfillmentMessages } = queryResult;

    if (!intent) {
      throw `Cannot detect intent from ${states.toString()} with '${input}'`;
    }

    const { displayName } = intent;
    const nextStates = StateTable.lookup(states, displayName);
    await updateUser(id, nextStates);

    return fulfillmentMessages;

  } catch (error) {
    logger.error(typeof error === 'string' ? error : JSON.stringify(error));
    const { Message } = protos.google.cloud.dialogflow.v2.Intent;
    return [new Message({ text: { text: ['Error: please try again later'] } })];
  }
}

module.exports = {
  handleUserInput,
};
