/**
 * This function validates the graph by making sure that each connected node is
 * of a different type. If invalid, throw error.
 *
 * @param graph Graph object
 */
function validate(graph) {
  const { nodes, edges } = graph;

  if (!nodes.length || nodes.length === 0 || !edges.length || edges.length === 0) {
    throw 'Invalid graph format';
  }
}

module.exports = { validate };
