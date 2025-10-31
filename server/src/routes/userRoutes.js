const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');
const { ratingValidationRules, validateResult } = require('../middlewares/validationMiddleware');

// All user routes require authentication and user role
router.use(verifyToken);
router.use(authorizeRoles('user'));

// Store browsing
router.get('/stores', userController.getStores);

// Rating submission
router.post('/ratings', ratingValidationRules, validateResult, userController.submitRating);

module.exports = router;
