const Admin = require('../models/Admin');
const { generateToken } = require('../utils/helpers');

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
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token,
  });
};

const getMe = async (req, res) => {
  res.json(req.admin);
};

const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully' });
};

module.exports = { login, getMe, logout };
