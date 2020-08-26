require('dotenv').config();
const { StateTable } = require('../api/stateTable');
const graph = require('./sample.json');
const { INTENT_TYPE } = require('../config/graph');

describe('Testing the State Transition Table module', () => {
  it('Should update the state table with the latest intents', async () => {
    await StateTable.update();

    let totalInputContextNum = 0;
    graph.nodes.forEach((node) => {
      const { type } = node;
      if (type === INTENT_TYPE) {
        const { contexts } = node;
        const { in: inputContexts } = contexts;
        totalInputContextNum += inputContexts.length;
      }
    });

    expect(StateTable.table.size).toEqual(totalInputContextNum);
  });

  it('Should fail when the context does not exist', () => {

  });

  it('Should retrieve the appropriate context', () => {

  });
});
