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
    throw 'Detected dangling nodes';
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

  const intentNodes = [];
  nodes.forEach((node) => {
    const { type } = node;

    if (type === INTENT_TYPE) {
      intentNodes.push(node);
    } else if (type !== CONTEXT_TYPE) {
      throw `Unrecognized node type: ${type}`;
    }
  });

  return { intentNodes };
}

module.exports = { validate };
