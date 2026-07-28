require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const seed = async () => {
  try {
    await connectDB();

    const admins = [
      { name: 'Pujan Subedi', email: 'pocomatpujan@gmail.com', password: 'admin@12345', role: 'superadmin' },
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
    console.log('Super Admin:');
    console.log('  pocomatpujan@gmail.com / admin@12345');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();
