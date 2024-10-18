const Booking = require('../modal/BookingModal');
const User = require('../modal/UserModal');

// Controller to get users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ userRole: 'user' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to delete users
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'User Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to get drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ userRole: 'driver' });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to delete drivers
exports.deleteDriver = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'Driver Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to get bookings
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to delete bookings
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: 'Booking Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to check profile status
exports.checkProfileStatus = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });
    res.status(200).json({ status: user.profileStatus });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller to get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const users = await User.find({ userRole: 'user' });
    const drivers = await User.find({ userRole: 'driver' });
    const bookings = await Booking.find();
    res.status(200).json({
      userLength: users.length,
      driverLength: drivers.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
