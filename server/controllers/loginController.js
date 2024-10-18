const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modal/UserModal');
const { JWT_SECRET } = require('../constants/constants');

// Login function
exports.login = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  try {
    if (!userEmail || !userPassword) {
      return res.status(402).json({ message: 'UserEmail and Password are required.' });
    }

    const user = await User.findOne({ userEmail: userEmail.toLowerCase() });
    if (!user) {
      return res.status(402).json({ message: 'User is not registered. Please register!' });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(402).json({ message: 'Invalid login details!' });
    }

    const userPayLoad = {
      userEmail: user.userEmail,
      userId: user._id,
      userRole: user.userRole,
    };

    const token = jwt.sign(userPayLoad, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, userInfo: userPayLoad, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', reason: error.message });
  }
};

// Login Check function
exports.loginCheck = (req, res) => {
  if (req.user && req.user.userEmail) {
    res.json({
      message: 'This is a protected route',
      userEmail: req.user.userEmail,
    });
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
};
