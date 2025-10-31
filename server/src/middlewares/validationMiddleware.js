const { body, validationResult } = require('express-validator');

const signupValidationRules = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&amp;*(),.?":{}|&lt;&gt;]/)
    .withMessage('Password must contain at least one special character'),
  
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
];

const loginValidationRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const ratingValidationRules = [
  body('storeId')
    .isInt({ min: 1 })
    .withMessage('Valid store ID is required'),
  
  body('ratingValue')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
];

const changePasswordValidationRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&amp;*(),.?":{}|&lt;&gt;]/)
    .withMessage('New password must contain at least one special character')
];

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
  ratingValidationRules,
  changePasswordValidationRules,
  validateResult
}
