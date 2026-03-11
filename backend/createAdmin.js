const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// MongoDB connection uses env var
const MONGO_URI = process.env.MONGO_URI;

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if specific admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hostel.com' });
    if (existingAdmin) {
      console.log('Admin already exists:');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@hostel.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@hostel.com');
    console.log('Password: admin123');
    console.log('');
    console.log('You can now login at http://localhost:3000/login');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
