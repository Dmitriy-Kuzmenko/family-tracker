const { Schema, model } = require('mongoose');

const schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 30,
  }
});

module.exports = model('User', schema);