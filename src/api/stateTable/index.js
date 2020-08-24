const { IntentsClient } = require('@google-cloud/dialogflow');

/**
 * Helper method to de-format the context name that includes all the
 * unnecessary information and extract only the actual context name
 *
 * @param {string} context Formatted context name
 */
function parseContext(context) {
  return context.substr(context.lastIndexOf('/') + 1);
}

/**
 * A state transition table for managing the flow that is following the
 * singleton pattern in order to keep updating and fetching process of states
 * much efficient between various adapters (for various chat platforms) and the
 * flow manager module.
 * The table data structure is a hash map with each key being the input context
 * and the value being another map that has the intent's display name as the key
 * and an array that contains all the next available states as the value.
 * Although there is a debate whether using singleton is good or bad, I am using
 * it in this case as I think singleton is the most adequate solution for this
 * kind of specific situation.
 */
class StateTable {
  constructor() {
    this.table = new Map();
  }

  /**
   * Method to update the table with the intents from Dialogflow
   */
  async update() {
    const clientEmail = process.env.DIALOGFLOW_CLIENT_EMAIL;
    const privateKey = process.env.DIALOGFLOW_PRIVATE_KEY.replace(/\\n/g, '\n');
    const projectId = process.env.DIALOGFLOW_PROJECT_ID;

    const client = new IntentsClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId,
    });

    const value = await client.listIntents({ parent: `projects/${projectId}/agent` })
      .catch((reason) => { throw 'Failed to update the State Transition Table'; });

    value[0].forEach((intent) => {
      const nextStates = intent.outputContexts.map((context) => parseContext(context.name));
      const currStates = intent.inputContextNames.map((name) => parseContext(name));
      const { displayName } = intent;

      currStates.forEach((state) => {
        const map = this.table.has(state) ? this.table.get(state) : new Map();
        this.table.set(state, map.set(displayName, nextStates));
      });
    });
  }
}

exports.StateTable = new StateTable();
