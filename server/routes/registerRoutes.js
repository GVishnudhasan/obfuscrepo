const express = require('express');
const registerController = require('../controllers/registerController');

const router = express.Router();

// POST: Register a new user
router.post('/', registerController.registerUser);

module.exports = router;
