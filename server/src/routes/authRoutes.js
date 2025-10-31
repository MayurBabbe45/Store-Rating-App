const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const {
  signupValidationRules,
  loginValidationRules,
  changePasswordValidationRules,
  validateResult,
} = require('../middlewares/validationMiddleware');

// Public routes
router.post('/signup', signupValidationRules, validateResult, authController.signup);
router.post('/login', loginValidationRules, validateResult, authController.login);

// Protected routes
router.put(
  '/change-password',
  verifyToken,
  changePasswordValidationRules,
  validateResult,
  authController.changePassword
);

module.exports = router;
