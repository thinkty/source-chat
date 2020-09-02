require('dotenv').config();
const { StateTable } = require('../api/stateTable');
const graph = require('./sample.json');
const { CONTEXT_TYPE, INTENT_TYPE } = require('../config/graph');

describe('Testing the State Transition Table module', () => {
  it('Should update the state table with the latest intents', async () => {
    await StateTable.update();

    let contextNodes = 0;
    graph.nodes.forEach((node) => {
      const { type } = node;
      if (type === CONTEXT_TYPE) {
        contextNodes += 1;
      }
    });

    expect(StateTable.table.size).toEqual(contextNodes);
  });

  it('Should fail when the context does not exist', () => {
    const states = ['noneExistantState'];
    const value = 'noneExistantIntentDisplayName';

    expect(() => {StateTable.lookup(states, value)}).toThrow();
  });

  it('Should retrieve the appropriate context', () => {
    const state = 'root';
    const id = '0c810a65-d0e8-408d-8218-c3dc7f8fd910';
    const value = graph.nodes[0].title;

    let rootContexts = 0;
    graph.nodes.forEach((node) => {
      const { type } = node;
      if (type === INTENT_TYPE) {
        const { contexts } = node;
        const { in: inputContexts } = contexts;
        if (inputContexts.includes(id)) {
          rootContexts += 1;
        }
      }
    });

    expect(StateTable.lookup([state], value).length).toEqual(rootContexts);
  });
});
