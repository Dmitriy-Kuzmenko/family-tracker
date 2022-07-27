const UserLocation = require('../models/UserLocation');

const { Types } = require('mongoose');

class LocationController {
  async getUserLocations(req, res) {
    try {
      const userLocationList = await UserLocation.find({ user_id: Types.ObjectId(req.params.id) });
      res.json(userLocationList);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async addUserLocation(req, res) {
    try {
      const { latitude, longitude, address } = req.body;

      const userLocation = await new UserLocation({
        user_id: req.user.userId,
        latitude: latitude,
        longitude: longitude,
        address: address,
      });

      await userLocation.save();
      res.json(userLocation);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}


module.exports = new LocationController();
