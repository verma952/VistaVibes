// === FILE: routes/authRoutes.js ===
const express = require('express');
const { sendOtpController, verifyOtpController } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user email
router.post('/send-otp', sendOtpController);

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
router.post('/verify-otp', verifyOtpController);

module.exports = router;
