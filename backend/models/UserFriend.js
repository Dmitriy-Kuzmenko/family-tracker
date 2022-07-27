const { Schema, Types, model } = require('mongoose');

const schema = new Schema({
  user_id: {
    type: Types.ObjectId,
    ref: 'User'
  },
  friend_id: {
    type: Types.ObjectId,
    ref: 'User'
  }
});

module.exports = model('UserFriend', schema);