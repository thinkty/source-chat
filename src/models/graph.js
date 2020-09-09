const { Schema, model } = require('mongoose');

/**
 * This schema is intended for version controlling various graphs. The graph
 * property is used to store the json graph.
 */
const GraphSchema = new Schema({
  graph: { type: Object, required: true },
}, { timestamps: true });

module.exports = { Graph: model('Graph', GraphSchema) };
