const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/get_users', isAuthenticated, adminController.getUsers);
router.post('/delete_users', isAuthenticated, adminController.deleteUser);

router.get('/get_driver', isAuthenticated, adminController.getDrivers);
router.post('/delete_driver', isAuthenticated, adminController.deleteDriver);

router.get('/get_booking', isAuthenticated, adminController.getBookings);
router.post('/delete_booking', isAuthenticated, adminController.deleteBooking);

router.post('/check_profile_status', isAuthenticated, adminController.checkProfileStatus);

router.get('/get_analytics', isAuthenticated, adminController.getAnalytics);

module.exports = router;
