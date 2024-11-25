const express = require('express');
const authController = require('../controllers/auth');  // Make sure this path is correct

const router = express.Router();

// Ensure you're using POST and passing a function as the callback
router.post('/register', authController.register);
router.post('/login', authController.login);

// router.post('/home', authController.home);
// router.post('/dashboard', authController.dashboard);
// router.post('/enroll', authController.enroll);
// router.post('/course', authController.course);

module.exports = router;
