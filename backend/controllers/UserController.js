const User = require('../models/User');
const UserFriend = require('../models/UserFriend');
const LastLocation = require('../models/LastLocation');

const { Types } = require('mongoose');

class UserController {
  async getUsers(req, res) {
    try {
      let userFriendList = await UserFriend.find({ user_id: req.user.userId });
      userFriendList = userFriendList.map(item => item.friend_id.toString());

      let userList = await User.find({ _id: { $ne: req.user.userId } });
      userList = userList.map((user) => {
        return userFriendList.includes(user._id.toString()) ? { ...user._doc, friend: true } : { ...user._doc }
      });

      res.json(userList);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async addFriend(req, res) {
    try {
      const { friendId } = req.body;

      await UserFriend.updateOne({ user_id: req.user.userId, friend_id: Types.ObjectId(friendId) }, {
        $set: {
          user_id: req.user.userId,
          friend_id: Types.ObjectId(friendId)
        }
      }, { upsert: true });

      await UserFriend.updateOne({ user_id: Types.ObjectId(friendId), friend_id: req.user.userId }, {
        $set: {
          user_id: Types.ObjectId(friendId),
          friend_id: req.user.userId,
        }
      }, { upsert: true });

      res.json({});
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async deleteFriend(req, res) {
    try {
      await UserFriend.findOneAndDelete({ user_id: req.user.userId, friend_id: Types.ObjectId(req.params.id) });
      await UserFriend.findOneAndDelete({ friend_id: req.user.userId, user_id: Types.ObjectId(req.params.id) });
      res.json({});
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async updateLocation(req, res) {
    try {
      const { latitude, longitude, address } = req.body;

      await LastLocation.updateOne({ user_id: req.user.userId }, {
        $set: {
          user_id: req.user.userId,
          latitude: latitude,
          longitude: longitude,
          address: address,
          datetime: new Date()
        }
      }, { upsert: true });

      res.json({});
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getLastLocation(req, res) {
    try {
      const lastLocation = await LastLocation.findOne({ user_id: Types.ObjectId(req.params.id) });
      res.json(lastLocation);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getFriendsLocation(req, res) {
    try {
      const friends = await UserFriend.find({ user_id: req.user.userId });
      const friendsLocation = await LastLocation.find({ user_id: { $in: friends.map(item => item.friend_id) } });
      res.json(friendsLocation);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new UserController()