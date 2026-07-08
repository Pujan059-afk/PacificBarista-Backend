require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const seed = async () => {
  try {
    await connectDB();

    const admins = [
      { name: 'Admin', email: 'pacificbarista@gmail.com', password: 'admin@12345', role: 'admin' },
      { name: 'Pujan Subedi', email: 'pocomatpujan@gmail.com', password: 'admin@12345', role: 'admin' },
    ];

    for (const adminData of admins) {
      const existing = await Admin.findOne({ email: adminData.email });
      if (existing) {
        console.log(`Admin "${adminData.email}" already exists. Skipping...`);
      } else {
        await Admin.create(adminData);
        console.log(`Admin "${adminData.email}" created.`);
      }
    }

    console.log('\nSeed complete!');
    console.log('Admins:');
    console.log('  pacificbarista@gmail.com / admin@12345');
    console.log('  pocomatpujan@gmail.com / admin@12345');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
