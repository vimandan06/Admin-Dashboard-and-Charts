const express = require('express');
const { register, login, sendOtp, verifyOtpReset } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register); // register new staff (admin can create also)
router.post('/login', login);
router.post('/send-otp', sendOtp); // send OTP for forgot or registration verification
router.post('/reset-password', verifyOtpReset);

module.exports = router;
