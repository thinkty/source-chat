const { Router } = require('express');
const logger = require('../../utils/logger');
const { createGraph, getAllGraphs } = require('../../utils/db');

const router = Router();

/**
 * Validate the graph to make sure it has nodes and edges
 *
 * @param {object} graph JSON graph object
 */
function checkGraph(graph) {
  const { nodes, edges } = graph;

  if (nodes && edges) {
    return;
  }

  throw 'Validation failed for given graph';
}

/**
 * Retrieve all the graphs from the database and return it
 */
router.get('/graphs', (req, res, next) => {
  try {
    getAllGraphs()
      .then((documents) => {
        console.log(documents);
        // TODO: send the graphs as response
      });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a new graph extracted from the reqeuest to the database
 */
router.post('/graphs', (req, res, next) => {
  try {
    const { body } = req;
    const { graph } = body;

    checkGraph(graph);
    createGraph(graph)
      .then(() => {
        logger.info('Successfully saved graph');
        res.sendStatus(200);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = { graphManagerRouter: router };
