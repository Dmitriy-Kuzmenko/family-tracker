const { Schema, Types, model } = require('mongoose');

const schema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'User'
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
    default: new Date()
  }
});

module.exports = model('LastLocation', schema);