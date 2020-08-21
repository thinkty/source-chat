const INTENT_TYPE = 'intentNode';
const CONTEXT_TYPE = 'contextNode';

/**
 * Check whether the graph has valid nodes and edges. The graph must have
 * atleast 1 node.
 *
 * @param {object[]} nodes
 * @param {object[]} edges
 */
function validNodesAndEdges(nodes, edges) {
  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    throw 'Invalid graph format: nodes and edges should be arrays';
  }

  if (nodes.length < 1) {
    throw 'Invalid graph format: there should be atleast one node';
  }
}

/**
 * Check for dangling nodes by iterating through the edges and adding the target
 * of the edges as non-top nodes. Eventually the size of non-top nodes should be
 * 1 less than the entire length of nodes as there should be only one top node.
 * If there are more than one top node, it means that there is a dangling node.
 *
 * @param {object[]} nodes
 * @param {object[]} edges
 */
function hasNoDanglingNodes(nodes, edges) {
  const nonTopNodes = new Set();
  edges.forEach((edge) => {
    nonTopNodes.add(edge.target);
  });

  if (nodes.length - nonTopNodes.size > 1) {
    throw 'Detected dangling nodes or multiple top nodes';
  }
}

/**
 * Function to check if the top most node is a context node and the title value
 * is 'root'. This is done to set the output context of normal intents that end
 * the flow to 'root' so that the flow can be controlled by the server.
 *
 * @param {object[]} nodes
 * @param {object[]} edges
 */
function validTopContextNode(nodes, edges) {
  const visited = new Set();
  edges.forEach((edge) => {
    visited.add(edge.target);
  });

  // Double checking
  if (nodes.length - visited.size !== 1) {
    throw 'Detected dangling nodes or multiple top nodes';
  }

  // Get the node that is not in the set = top node
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const { id } = node;

    if (!visited.has(id)) {
      const { type, title } = node;
      if (type !== 'contextNode' || title !== 'root') {
        throw 'Top node is not either a context node or does not have root as the name';
      }
      break;
    }
  }
}

/**
 * This function validates the graph by making sure that each connected node is
 * of a different type. If invalid, throws error. After all checks have been
 * successful, the function returns an object that contains an array of intent
 * nodes and an array of context nodes.
 *
 * @param graph Graph object
 * @returns An array of intent nodes and an array of context nodes
 */
function validate(graph) {
  const { nodes, edges } = graph;
  validNodesAndEdges(nodes, edges);
  hasNoDanglingNodes(nodes, edges);
  validTopContextNode(nodes, edges);

  const intentNodes = [];
  const contextNodes = [];
  nodes.forEach((node) => {
    const { type } = node;

    if (type === INTENT_TYPE) {
      intentNodes.push(node);
    } else if (type === CONTEXT_TYPE) {
      contextNodes.push(node);
    } else {
      throw `Unrecognized node type: ${type}`;
    }
  });

  return { intentNodes, contextNodes };
}

module.exports = { validate };
