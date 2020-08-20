const { protos } = require('@google-cloud/dialogflow');

/**
 * Helper function to format the output contexts according to the guideline by
 * Dialogflow. The lifespan count is set to 1 as the state transition table will
 * take care of the flow. Instead of giving the flow control to Dialogflow, by
 * having your own flow control logic, you can implement loops and complex
 * patterns in your graph.
 *
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IIntent.html
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IContext.html
 * @param {string[]} outputContexts
 * @param {Map<string, string>} contextMap Map with key of context node id and
 * value of context node title
 */
function formatOutputContexts(outputContexts, contextMap) {
  const { Context } = protos.google.cloud.dialogflow.v2;

  return outputContexts.map((id) => new Context({
    name: contextMap.get(id),
    lifespanCount: 1,
    parameters: null,
  }));
}

/**
 * Helper function to format the training phrases for the intent. Currently,
 * there is no support for entities yet so the training phrase parts are not
 * filled in.
 *
 * @param {string[]} trainingPhrases List of training phrases for the intent
 */
function formatTrainingPhrases(trainingPhrases) {
  const { TrainingPhrase } = protos.google.cloud.dialogflow.v2.Intent;

  return trainingPhrases.map((phrase) => new TrainingPhrase({
    name: phrase,
    type: 'EXAMPLE',
  }));
}

/**
 * Helper function to format the responses for the intent. Currently, the editor
 * only takes text responses.
 *
 * @param {object[]} responses Multiple pools of responses to send to the user
 */
function formatResponses(responses) {
  const { Message } = protos.google.cloud.dialogflow.v2.Intent;

  return responses.map((pool) => new Message({ text: { text: pool } }));
}

/**
 * This function parses the intents from the intent nodes and the context nodes
 * and returns a batch of intents. From the intent node, the following list of
 * properties are parsed:
 * - title : combined with the name of the flowchart, it will be the display
 * name of the intent
 * - fulfillment : whether the intent should call the webhook
 * - isFallback : an intent is considered a fallback node when it is explicitly
 * stated that it is a fallback node or when there are no training phrases and
 * events. This means that the intent takes any input in the given context.
 * - contexts : contains input and output contexts
 * - events : a list of events that can trigger the intent
 * - training phrases : an array of strings for the intent to use it to train
 * - action : a helpful message for the webhook on fulfillment
 * - responses : list of pools of responses to send to the user
 *
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IIntent.html
 * @param {object[]} intentNodes
 * @param {object[]} contextNodes
 * @param {string} flowchart Name of the flowchart
 * An array of intents
 */
function parse(intentNodes, contextNodes, flowchart) {
  // Iterate through the context nodes and form a map with the key being the id
  // and the value being the title with the flowchart name prepended
  const contextMap = new Map();
  contextNodes.forEach((node) => {
    const { id, title } = node;
    contextMap.set(id, `${flowchart}-${title}`);
  });

  const { Intent } = protos.google.cloud.dialogflow.v2;

  return intentNodes.map((node) => {
    const {
      title,
      fulfillment,
      isFallback,
      contexts,
      events,
      trainingPhrases,
      action,
      responses,
    } = node;

    return new Intent({
      displayName: `${flowchart}-${title}`,
      webhookState: fulfillment ? 'WEBHOOK_STATE_ENABLED' : null,
      isFallback: isFallback || (trainingPhrases.length === 0 && events.length === 0),
      inputContextNames: contexts.in.map((id) => contextMap.get(id)),
      events,
      trainingPhrases: formatTrainingPhrases(trainingPhrases),
      action,
      outputContexts: formatOutputContexts(contexts.out, contextMap),
      messages: formatResponses(responses),
    });
  });
}

module.exports = { parse };
