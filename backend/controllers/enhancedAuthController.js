const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Enhanced Login Function with Debugging
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login Attempt:', { email, passwordLength: password?.length });

    // Input validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ 
        message: 'Email and password are required',
        debug: 'MISSING_INPUTS'
      });
    }

    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.log('❌ Database not connected');
      return res.status(500).json({ 
        message: 'Database connection error',
        debug: 'DB_NOT_CONNECTED'
      });
    }

    // Find user by email
    console.log('🔍 Searching for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({ 
        message: 'Login failed. Please try again.',
        debug: 'USER_NOT_FOUND'
      });
    }

    console.log('✅ User found:', { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      hasPassword: !!user.password 
    });

    // Compare password
    console.log('🔍 Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Password comparison failed');
      return res.status(401).json({ 
        message: 'Login failed. Please try again.',
        debug: 'INVALID_PASSWORD'
      });
    }

    console.log('✅ Password comparison successful');

    // Generate token
    const token = generateToken(user._id);

    // Return success response (without password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    };

    console.log('✅ Login successful for:', email);
    
    res.json({
      message: 'Login successful',
      user: userResponse
    });

  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      debug: 'SERVER_ERROR',
      error: error.message 
    });
  }
};

// Test user creation helper
const createTestUser = async (req, res) => {
  try {
    const { email, password, name, role = 'student' } = req.body;
    
    console.log('🔍 Creating test user:', { email, name, role });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        user: {
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        }
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('🔐 Password hashed successfully');

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    console.log('✅ Test user created:', { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });

    res.status(201).json({
      message: 'Test user created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('💥 Create user error:', error);
    res.status(500).json({ 
      message: 'Error creating test user',
      error: error.message 
    });
  }
};

module.exports = { 
  login, 
  createTestUser,
  generateToken 
};
