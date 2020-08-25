/**
 * Adapters handle the part of receiving the messages from the user and sending
 * the responses back to the user. This module (which is not an Adapter) handles
 * the following tasks:
 * - Handling user input based on the user id and user input and actually
 * progressing the user through the flow
 * - Utilizing the adapters to send the response to the user
 */

/**
 * This function is the core of this module. It handles user input and returns a
 * payload to send to the user
 *
 * @param {string} id Unique ID of the user that will be used to query the
 * database for the current state of the user
 * @param {string} input Input given from the user that will be used to detect
 * an intent from Dialogflow
 * @returns Payload to send to user
 */
async function handleUserInput(id, input) {
  return {
    type: 'text',
    content: 'TEST',
  };
}

module.exports = {
  handleUserInput,
};
