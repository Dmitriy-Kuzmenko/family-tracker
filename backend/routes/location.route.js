const { Router } = require('express');
const LocationController = require('../controllers/LocationController');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.get('/list/:id', auth, LocationController.getUserLocations);
router.post('/add', auth, LocationController.addUserLocation);


module.exports = router;