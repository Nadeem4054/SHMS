const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const updateAdminEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin and update email
    const admin = await User.findOneAndUpdate(
      { email: 'admin@hostel.com', role: 'admin' },
      { email: 'nk4054420@gmail.com' },
      { new: true }
    );

    if (admin) {
      console.log('');
      console.log('✅ Admin email updated successfully!');
      console.log('');
      console.log('Updated Admin Details:');
      console.log('----------------------');
      console.log('Name:', admin.name);
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Password: admin123 (unchanged)');
      console.log('');
    } else {
      // Check if admin with new email already exists
      const existingAdmin = await User.findOne({ email: 'nk4054420@gmail.com' });
      if (existingAdmin) {
        console.log('Admin with email nk4054420@gmail.com already exists');
      } else {
        console.log('Admin with email admin@hostel.com not found');
      }
    }

  } catch (error) {
    console.error('Error updating admin email:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminEmail();
