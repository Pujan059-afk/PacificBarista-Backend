const express = require('express');
const router = express.Router();
const { login, sendOtp, verifyOtp, getMe, logout } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

module.exports = router;
