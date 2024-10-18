const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const bookingController = require('../controllers/bookingController');
const router = express.Router();

router.post('/', isAuthenticated, bookingController.createBooking);
router.post('/viewBooking', isAuthenticated, bookingController.viewBooking);
router.post('/deleteBooking', isAuthenticated, bookingController.deleteBooking);
router.post('/viewOpenBooking', isAuthenticated, bookingController.viewOpenBooking);
router.post('/updateBookingStatus', isAuthenticated, bookingController.updateBookingStatus);
router.post('/gettingCurrentBooking', isAuthenticated, bookingController.getCurrentBooking);
router.post('/handleCompleteTour', isAuthenticated, bookingController.handleCompleteTour);

module.exports = router;
