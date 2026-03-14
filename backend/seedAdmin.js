const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing users to start fresh
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new User({
      name: 'System Administrator',
      email: 'admin@hostel.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('');
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login Credentials:');
    console.log('------------------');
    console.log('Email: admin@hostel.com');
    console.log('Password: admin123');
    console.log('');

    // Create sample student user
    const studentSalt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('student123', studentSalt);

    const student = new User({
      name: 'John Doe',
      email: 'student@hostel.com',
      password: studentPassword,
      role: 'student'
    });

    await student.save();
    console.log('✅ Sample student user created!');
    console.log('Email: student@hostel.com');
    console.log('Password: student123');
    console.log('');

    // Display all created users
    const users = await User.find({});
    console.log('📋 All users in database:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('Login at: http://localhost:3000/login');
    console.log('');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

seedAdmin();
