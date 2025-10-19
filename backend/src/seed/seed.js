// backend/src/seed.js
require('dotenv').config();
const sequelize = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Metric = require('../models/Metric');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ This resets all data
    console.log('Database synced!');

    // Hash password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Admin user
    await User.create({
      username: 'admin',
      name: 'Admin User',
      email: 'admin@manifest.com',
      phone: '9999999999',
      passwordHash,
      role: 'admin',
      totalSales: 0,
      totalEarnings: 0
    });

    // Staff users
    await User.bulkCreate([
      { username:'dev1',name: 'John Doe', email: 'john@manifest.com', phone: '9876543210', passwordHash, role: 'staff', totalSales: 15, totalEarnings: 4500 },
      { username:'dev2',name: 'Jane Smith', email: 'jane@manifest.com', phone: '9123456789', passwordHash, role: 'staff', totalSales: 25, totalEarnings: 7200 }
    ]);

    // Household products
    await Product.bulkCreate([
      { name: 'Vacuum Cleaner', price: 250 },
      { name: 'Microwave Oven', price: 180 },
      { name: 'Air Purifier', price: 200 },
      { name: 'Iron Box', price: 50 },
      { name: 'Water Filter', price: 300 }
    ]);

    // Metrics (simulated analytics)
    const now = new Date();
    const metrics = [];
    for (let i = 0; i < 30; i++) {
      const day = new Date(now - i * 24 * 60 * 60 * 1000);
      metrics.push(
        { name: 'users', value: Math.floor(Math.random() * 10) + 1, timestamp: day },
        { name: 'sales', value: Math.floor(Math.random() * 1000) + 200, timestamp: day },
        { name: 'conversions', value: Math.floor(Math.random() * 5) + 1, timestamp: day }
      );
    }
    await Metric.bulkCreate(metrics);

    console.log('✅ Seed data created successfully!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
}

seed();
