const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controller/auth');
const { checkAuth } = require('../middleware/check-auth');
const User = require('../models/user');

router.get('/login', authController.get_user_login);

router.get('/auth/me', checkAuth, authController.get_user_token);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid Email or Password'),
  ],
  authController.post_user_login
);

router.post(
  '/recoverpassword',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid Email or Password'),
  ],
  authController.post_password_recover
);

router.post('/recover', authController.post_password_recover_link);
router.get('/recover', authController.get_password_recover);

router.put(
  '/change-password',
  checkAuth,
  authController.validatePasswordChange,
  authController.put_change_user_password
);

router.get('/logout', authController.get_user_logout);

router.post('/logout', authController.post_user_logout);

module.exports = router;
