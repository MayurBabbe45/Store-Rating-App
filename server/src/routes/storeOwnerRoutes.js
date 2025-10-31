// Import necessary modules and dependencies
const express = require('express');

// Create a new router instance
const router = express.Router();

// Import the controller functions for handling store owner logic
const storeOwnerController = require('../controllers/storeOwnerController');

// Import middleware for authentication (verifying JWT token)
const { verifyToken } = require('../middlewares/authMiddleware');

// Import middleware for role authorization (checking if the user has the required role)
const { authorizeRoles } = require('../middlewares/roleMiddleware');

/**
 * Middleware Application Block:
 * Apply the authentication (verifyToken) and authorization (authorizeRoles)
 * middleware to ALL routes defined below this line in this file.
 * This ensures only authenticated users with the 'store_owner' role can access these routes.
 */
router.use(verifyToken, authorizeRoles('store_owner'));

// =============================
// Store Owner Protected Routes
// =============================

/**
 * @route GET /api/store-owner/dashboard
 * @description Retrieves the store owner's dashboard data.
 * @access Private (Requires 'store_owner' role)
 */
router.get('/dashboard', storeOwnerController.getDashboard);


// Export the router so it can be mounted in the main Express application
module.exports = router;
