const { protos } = require('@google-cloud/dialogflow');

/**
 * A testing purpose action handler
 */
async function test(id, input, nextStates, currStates) {
  const { Message } = protos.google.cloud.dialogflow.v2.Intent;
  return {
    states: nextStates,
    messages: [new Message({ text: { text: [input] } })],
  };
}

/**
 * This map contains the mapping between the action name and the actual function
 */
const actionMap = {
  test,
};

/**
 * Factory function to create an action response object to return as a result of
 * handle action
 *
 * @param {string[]} states Next states of the user
 * @param {import('@google-cloud/dialogflow').protos.google.cloud.dialogflow.v2.Intent.Message[]}
 * messages Message to send to user
 */
function createActionResponse(states, messages) {
  return { states, messages };
}

/**
 * Handle actions specified by the intent. If the action handler does not exist
 * in the action map, return null for next states and an error message
 *
 * @param {string} id Unique user id
 * @param {string} input User input
 * @param {string[]} nextStates Next states of the user retreived from the state table
 * @param {string[]} currStates Current states of the user retrieved from the database
 * @param {string} action Name of the action
 * @returns An action reponse object that contains next states and the message
 */
async function handleAction(id, input, nextStates, currStates, action) {
  const actionHandler = actionMap[action];

  if (!actionHandler) {
    return createActionResponse(null, `Could not find an action handler for ${action}`);
  }

  const { states, messages } = await actionHandler(id, input, nextStates, currStates);
  return createActionResponse(states, messages);
}

module.exports = { handleAction };
