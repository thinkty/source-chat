/**
 * This function validates the graph by making sure that each connected node is
 * of a different type. If invalid, throw error.
 *
 * @param graph Graph object
 */
function validate(graph) {
  const { nodes, edges } = graph;

  basicCheckupOnNodesAndEdges(graph);


}

/**
 * Check whether the graph has valid nodes and edges. The graph must have
 * atleast 1 node.
 *
 * @param graph Graph object
 */
function basicCheckupOnNodesAndEdges(graph) {
  const { nodes, edges } = graph;

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    throw 'Invalid graph format: nodes and edges should be arrays';
  }

  if (nodes.length < 1) {
    throw 'Invalid graph format: there should be atleast one node';
  }
}

module.exports = { validate };
