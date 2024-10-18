const bcrypt = require('bcryptjs');
const User = require('../modal/UserModal');

// Register User function
exports.registerUser = async (req, res) => {
  const { userEmail, userPassword, username, phoneNumber, fullName, userRole } = req.body;

  if (!userEmail || !userPassword || !username || !phoneNumber || !fullName || !userRole) {
    return res.status(402).json({
      message:
        'All fields are required (userEmail, userPassword, username, phoneNumber, fullName, userRole)',
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ userEmail: userEmail.toLowerCase() });
    if (existingUser) {
      return res.status(402).json({ message: 'User already exists. Please log in.' });
    }

    // Check if username already exists
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(402).json({ message: 'Username already exists. Try another one.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create new user
    const newUser = new User({
      userEmail: userEmail.toLowerCase(),
      userPassword: hashedPassword,
      username,
      phoneNumber,
      fullName,
      userRole,
      profileStatus: userRole === 'user' ? true : false,
    });

    // Save user to the database
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', reason: error.message });
  }
};
