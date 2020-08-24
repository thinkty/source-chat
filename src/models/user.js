const { Schema, model } = require('mongoose');

/**
 * This schema is intented to keep track of the user status. The user property
 * must be unique amongst users and various platforms. The state property must
 * have a valid context value that exists in the Dialogflow console.
 */
const UserSchema = new Schema({
  user: { type: String, required: true, unique: true },
  state: { type: String, default: 'root' },
}, { timestamps: true });

module.exports = { UserSchema };
