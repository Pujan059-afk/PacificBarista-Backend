const Admin = require('../models/Admin');

const getAdmins = async (req, res) => {
  const admins = await Admin.find().select('-password -otp -otpExpiry').sort({ createdAt: -1 });
  res.json({ admins });
};

const createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  const existing = await Admin.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'An admin with this email already exists' });
  }
  const admin = await Admin.create({
    name,
    email,
    password,
    role: role === 'superadmin' ? 'superadmin' : 'admin',
  });
  res.status(201).json({
    admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
};

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  if (email && email !== admin.email) {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An admin with this email already exists' });
    }
    admin.email = email;
  }

  if (name) admin.name = name;
  if (role) {
    if (admin.role === 'superadmin' && role !== 'superadmin') {
      const superAdminCount = await Admin.countDocuments({ role: 'superadmin' });
      if (superAdminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove role from the last super admin' });
      }
    }
    admin.role = role;
  }
  if (password && password.length >= 6) {
    admin.password = password;
  }

  await admin.save();
  res.json({
    admin: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }
  if (admin.role === 'superadmin') {
    const superAdminCount = await Admin.countDocuments({ role: 'superadmin' });
    if (superAdminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last super admin' });
    }
  }
  await Admin.findByIdAndDelete(id);
  res.json({ message: 'Admin deleted successfully' });
};

module.exports = { getAdmins, createAdmin, updateAdmin, deleteAdmin };
