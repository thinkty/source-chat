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
  return await User.findOne({ user: id }).exec();
}

/**
 * Given an ID of the user and the new state value, update the database
 *
 * @param {string} id Unique id of the user
 * @param {string} state New state value
 */
async function updateUser(id, state) {
  await User.findByIdAndUpdate({ user: id }, { state })
    .exec()
    .then(() => {
      logger.debug(`Updated ${id} state to ${state}`);
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
