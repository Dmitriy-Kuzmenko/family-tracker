const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        });
      }

      const { username, email, password } = req.body;

      let isUsed = await User.findOne({ email });

      if (isUsed) {
        return res.status(300).json({ message: 'Данный Email уже занят, попробуйте другой.' });
      }

      isUsed = await User.findOne({ username });

      if (isUsed) {
        return res.status(300).json({ message: 'Данный username уже занят, попробуйте другой.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email, username, password: hashedPassword
      });

      await user.save();

      res.status(201).json({ message: 'Пользователь создан' });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при регистрации'
        });
      }

      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: 'Такого username нет в базе' });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Пароль не верный' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.jwtSecret,
        { expiresIn: '1h' }
      );

      res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new AuthController()