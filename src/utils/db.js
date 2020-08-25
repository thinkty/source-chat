const { User } = require('../models/user');
const logger = require('./logger');

/**
 * Given an ID of a new user, create a new user on the database. The ID must be
 * unique amongst various platforms (Slack, Discord, etc.)
 *
 * @param {string} id Unique id of the user
 */
async function createUser(id) {
  const user = new User({ user: id });
  await user.save();
}

/**
 * Given an ID of a user, find and return the user from the database. If no user
 * is found, null will be returned.
 *
 * @param {string} id Unique id of the user
 */
async function retrieveUser(id) {
  const doc = await User.findOne({ user: id }).exec();
  return doc;
}

/**
 * Given an ID of the user and the new state value, update the database
 *
 * @param {string} id Unique id of the user
 * @param {string[]} states New state values
 */
async function updateUser(id, states) {
  await User.findByIdAndUpdate({ user: id }, { states })
    .exec()
    .then(() => {
      logger.debug(`Updated ${id} state to ${states}`);
    })
    .catch((error) => {
      logger.debug(`Failed to update ${id}`);
    });
}

/**
 * Given an ID of the user, remove the user from the database
 *
 * @param {string} id Unique id of the user
 */
async function deleteUser(id) {
  await User.findOneAndDelete({ user: id })
    .exec()
    .catch((error) => {
      logger.debug(`Failed to delete ${id}`);
    });
}

module.exports = {
  createUser,
  retrieveUser,
  updateUser,
  deleteUser,
};
