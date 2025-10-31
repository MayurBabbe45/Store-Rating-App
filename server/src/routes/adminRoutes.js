const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(verifyToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', adminController.getDashboard);
router.post('/users', adminController.createUser);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/stores', adminController.createStore);
router.get('/stores', adminController.getStores);

module.exports = router;
