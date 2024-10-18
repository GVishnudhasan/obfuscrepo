const express = require('express');
const multer = require('multer');
const isAuthenticated = require('../middleware/isAuthenticated');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Set up multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// POST: Fetch user info
router.post('/', isAuthenticated, profileController.getUserInfo);

// POST: Update user info
router.post('/update', isAuthenticated, upload.single('file'), profileController.updateUserInfo);

module.exports = router;
