const User = require('../modal/UserModal');

// Fetch User Info function
exports.getUserInfo = async (req, res) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      return res.status(402).json({ message: 'userId is required.' });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(402).json({ message: 'User is not registered. Please register!' });
    }

    res.json({ userInfo: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', reason: error.message });
  }
};

// Update User Info function
exports.updateUserInfo = async (req, res) => {
  const userInfo = req.body;
  try {
    if (!userInfo.userId) {
      return res.status(402).json({ message: 'userId is required.' });
    }

    const user = await User.findById({ _id: userInfo.userId });
    if (!user) {
      return res.status(402).json({ message: 'User is not registered. Please register!' });
    }

    // Update user fields
    if (userInfo.phoneNumber) user.phoneNumber = userInfo.phoneNumber;
    if (userInfo.fullName) user.fullName = userInfo.fullName;

    if (userInfo.userRole === 'driver') {
      if (userInfo.vehicleNumber) user.vehicleNumber = userInfo.vehicleNumber;
      if (userInfo.vehicleType) user.vehicleType = userInfo.vehicleType;
      user.profileStatus = true;
    }

    // Handle profile image upload
    if (req.file) {
      user.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', reason: error.message });
  }
};
