const Admin = require('../models/Admin');
const { generateToken } = require('../utils/helpers');
const { sendOtpEmail } = require('../utils/email');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(admin._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    token,
  });
};

const sendOtp = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  admin.otp = otp;
  admin.otpExpiry = otpExpiry;
  await admin.save();

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    res.status(500).json({ message: 'Failed to send OTP. Try again.' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const admin = await Admin.findOne({ email }).select('+otp +otpExpiry');

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  if (!admin.otp || !admin.otpExpiry) {
    return res.status(400).json({ message: 'No OTP requested. Request a new one.' });
  }

  if (admin.otpExpiry < new Date()) {
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save();
    return res.status(400).json({ message: 'OTP has expired. Request a new one.' });
  }

  if (admin.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  admin.otp = undefined;
  admin.otpExpiry = undefined;
  await admin.save();

  const token = generateToken(admin._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
    token,
  });
};

const getMe = async (req, res) => {
  res.json({ user: req.admin });
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

module.exports = { login, sendOtp, verifyOtp, getMe, logout };
