const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  user: { type: String, required: true, unique: true },
  state: { type: String, default: 'root' },
}, { timestamps: true });

module.exports = { UserSchema };
