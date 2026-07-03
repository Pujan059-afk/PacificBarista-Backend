require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const seed = async () => {
  try {
    await connectDB();

    const existing = await Admin.findOne({ email: 'pacificbarista@gmail.com' });
    if (existing) {
      console.log('Admin already exists. Skipping...');
      process.exit(0);
    }

    await Admin.create({
      name: 'Admin',
      email: 'pacificbarista@gmail.com',
      password: 'admin@12345',
      role: 'admin',
    });

    console.log('Admin created successfully!');
    console.log('Email: pacificbarista@gmail.com');
    console.log('Password: admin@12345');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
