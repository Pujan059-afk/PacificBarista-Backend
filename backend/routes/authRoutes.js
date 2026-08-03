const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { login, sendOtp, verifyOtp, getMe, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Rate limiter: max 10 attempts per 15 minutes per IP on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authLimiter, login);
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;
