const { Router } = require('express');
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.get('/list', auth, UserController.getUsers);
router.get('/getFriendsLocation', auth, UserController.getFriendsLocation);

router.post('/add', auth, UserController.addFriend);
router.post('/updateLocation', auth, UserController.updateLocation);

router.delete('/getLocation/:id', auth, UserController.getLastLocation);
router.delete('/delete/:id', auth, UserController.deleteFriend);

module.exports = router;