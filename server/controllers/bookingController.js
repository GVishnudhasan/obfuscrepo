const Booking = require('../modal/BookingModal');
const User = require('../modal/UserModal');

// Create a new booking
exports.createBooking = async (req, res) => {
  const {
    userId,
    pickupLocation,
    dropOffLocation,
    vehicleType,
    date,
    time,
    estimatedCost,
  } = req.body;

  if (
    !userId ||
    !pickupLocation ||
    !dropOffLocation ||
    !vehicleType ||
    !date ||
    !time ||
    !estimatedCost
  ) {
    return res.status(402).json({ message: 'All fields are required.' });
  }

  const newBooking = new Booking({
    userId,
    pickupLocation,
    dropOffLocation,
    vehicleType,
    date,
    time,
    estimatedCost,
  });

  try {
    await newBooking.save();
    res.status(200).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// View bookings for a user
exports.viewBooking = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(402).json({ message: 'User ID is required.' });
  }

  try {
    const bookings = await Booking.find({ userId });
    res.status(200).json({ message: 'Bookings fetched successfully', bookings });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(402).json({ message: 'Booking ID is required.' });
  }

  try {
    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// View open bookings based on user vehicle type
exports.viewOpenBooking = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(402).json({ message: 'User ID is required.' });
  }

  try {
    const user = await User.findOne({ _id: userId }).select('vehicleType');
    if (!user || !user.vehicleType) {
      return res.status(402).json({ message: 'User or vehicle type not found.' });
    }

    const bookings = await Booking.find({
      status: 'pending',
      vehicleType: user.vehicleType,
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { bookingId, userId, newStatus } = req.body;

  if (!bookingId || !userId || !newStatus) {
    return res.status(400).json({ message: 'Booking ID, User ID, and new status are required.' });
  }

  try {
    const currentBooking = await Booking.findOne({ _id: bookingId });
    if (!currentBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    currentBooking.status = newStatus;
    currentBooking.cabId = userId;
    await currentBooking.save();
    res.status(200).json({ message: 'Booking status updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get the current booking
exports.getCurrentBooking = async (req, res) => {
  const { userRole, userId } = req.body;

  if (!userRole || !userId) {
    return res.status(402).json({ message: 'User role and User ID are required.' });
  }

  try {
    let currentBooking;
    if (userRole === 'user') {
      currentBooking = await Booking.findOne({ userId, status: 'current' });
    } else {
      currentBooking = await Booking.findOne({ cabId: userId, status: 'current' });
    }

    if (!currentBooking) {
      return res.status(402).json({ message: 'No current booking found.' });
    }

    const currentUser = userRole === 'user'
      ? await User.findOne({ _id: currentBooking.cabId })
      : await User.findOne({ _id: currentBooking.userId });

    res.status(200).json({ currentBooking, currentUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Handle the completion of a tour
exports.handleCompleteTour = async (req, res) => {
  const { bookingId, userId } = req.body;

  if (!bookingId || !userId) {
    return res.status(402).json({ message: 'Booking ID and user ID are required.' });
  }

  try {
    const booking = await Booking.findOne({ _id: bookingId });
    if (!booking) {
      return res.status(402).json({ message: 'Booking not found.' });
    }

    booking.status = 'completed';
    await booking.save();

    const user = await User.findOne({ _id: userId });
    user.earnedMoney += booking.estimatedCost;
    await user.save();

    res.status(200).json({
      message: `Tour completed! You earned ${booking.estimatedCost} booking success.`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
