const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const loginController = require('../controllers/loginController');

const router = express.Router();

// POST: Login route
router.post('/', loginController.login);

// GET: Protected route for checking login
router.get('/user_login', isAuthenticated, loginController.loginCheck);

module.exports = router;
