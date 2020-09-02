const { protos } = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

/**
 * Helper function to format the context. The format:
 * projects/{project_id}/agent/sessions/{session_id}/contexts/{context_id}
 *
 * @param {string} context Raw context value
 * @returns {string} Formatted context value
 */
function formatContextName(context) {
  const env = process.env.NODE_ENV;
  const projectId = env === 'test' ? process.env.DEBUG_DIALOGFLOW_PROJECT_ID : process.env.DIALOGFLOW_PROJECT_ID;
  const session = uuidv4();

  return `projects/${projectId}/agent/sessions/${session}/contexts/${context}`;
}

/**
 * Helper function to format the output contexts according to the guideline by
 * Dialogflow. The lifespan count is set to 1 as the state transition table will
 * take care of the flow. Instead of giving the flow control to Dialogflow, by
 * having your own flow control logic, you can implement loops and complex
 * patterns in your graph.
 * However, there are special cases. When
 * 1. The node is a fallback node or events are given, and does not have any
 * output contexts specified, the output context will be the input context
 * 2. The node is not a fallback node and no events are given, and it does not
 * have any output context specified, the output context will be the root
 *
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IIntent.html
 * @see https://googleapis.dev/nodejs/dialogflow/latest/google.cloud.dialogflow.v2.IContext.html
 * @param {object} node Node object containing events and fallback information
 * @param {string[]} outputContexts
 * @param {Map<string, string>} contextMap Map with key of context node id and
 * value of context node title
 */
function formatOutputContexts(node, outputContexts, contextMap) {
  const { Context } = protos.google.cloud.dialogflow.v2;
  const { isFallback, events } = node;

  if (outputContexts.length === 0) {
    // Exceptional case 1
    if (isFallback || events.length > 0) {
      const { contexts } = node;
      return contexts.in.map((id) => (
        new Context({
          name: formatContextName(contextMap.get(id)),
          lifespanCount: 1,
          parameters: null,
        })
      ));
    }

    // Exceptional case 2
    return [
      new Context({
        name: formatContextName('root'),
        lifespanCount: 1,
        parameters: null,
      }),
    ];
  }

  return outputContexts.map((id) => new Context({
    name: formatContextName(contextMap.get(id)),
    lifespanCount: 1,
    parameters: null,
  }));
}

/**
 * Helper function to format the training phrases for the intent. Currently,
 * there is no support for entities yet so the training phrase only has a single
 * part
 *
 * @param {string[]} trainingPhrases List of training phrases for the intent
 */
function formatTrainingPhrases(trainingPhrases) {
  const { TrainingPhrase } = protos.google.cloud.dialogflow.v2.Intent;
  const { Part } = protos.google.cloud.dialogflow.v2.Intent.TrainingPhrase;

  return trainingPhrases.map((phrase) => {
    // When adding support for entities, edit this part to partition the phrase
    // into multiple parts
    const part = new Part({
      text: phrase,
    });

    return new TrainingPhrase({
      type: 'EXAMPLE',
      parts: [part],
    });
  });
}

/**
 * Helper function to format the responses for the intent. Currently, the editor
 * only takes text responses and a custom payload. If a custom payload is given,
 * it checks if the payload is a valid JSON object and has properties
 *
 * @param {object[]} responses Multiple pools of responses to send to the user
 * @param {string} payload Custom payload specified by the user
 */
function formatResponses(responses, payload) {
  const { Message } = protos.google.cloud.dialogflow.v2.Intent;
  const { Struct, Value } = protos.google.protobuf;
  const messages = responses.map((pool) => new Message({ text: { text: pool } }));

  try {
    const payloadObj = JSON.parse(payload);

    if (Object.keys(payloadObj).length !== 0) {
      const fields = {};
      Object.keys(payloadObj).forEach((key) => {
        fields[key] = new Value({ stringValue: payloadObj[key] });
      });

      messages.push(new Message({ payload: { fields } }));
    }
  } catch (error) {
    return messages;
  }

  return messages;
}

/**
 * This function parses the intents from the intent nodes and the context nodes
 * and returns a batch of intents. From the intent node, the following list of
 * properties are parsed:
 * - title : Display name of the intent
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
 * @returns An array of intents
 */
function parse(intentNodes, contextNodes) {
  // Iterate through the context nodes and form a map with the key being the id
  // and the value being the title
  const contextMap = new Map();
  contextNodes.forEach((node) => {
    const { id, title } = node;
    contextMap.set(id, title);
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
      payload,
    } = node;

    return new Intent({
      displayName: title,
      webhookState: fulfillment ? 'WEBHOOK_STATE_ENABLED' : null,
      isFallback: isFallback || (trainingPhrases.length === 0 && events.length === 0),
      inputContextNames: contexts.in.map((id) => formatContextName(contextMap.get(id))),
      events,
      trainingPhrases: formatTrainingPhrases(trainingPhrases),
      action,
      outputContexts: formatOutputContexts(node, contexts.out, contextMap),
      messages: formatResponses(responses, payload),
    });
  });
}

module.exports = { parse };
