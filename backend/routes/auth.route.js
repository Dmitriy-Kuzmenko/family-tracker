const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const { check } = require('express-validator');

const router = Router();

router.post('/registration',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Некорректный пароль').isLength({ min: 6 })
  ],
  AuthController.registration);

router.post('/login',
  [
    check('username', 'Введите ник').exists(),
    check('password', 'Введите пароль').exists()
  ],
  AuthController.login);

module.exports = router;