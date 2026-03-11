const bcrypt = require('bcryptjs');
const StudentApplication = require('../models/StudentApplication');
const User = require('../models/User');
const Room = require('../models/Room');
const { sendApprovalEmail } = require('../config/emailService');

// @desc    Submit student application
// @route   POST /api/apply
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      fatherName,
      guardianEmail,
      phone,
      cnic,
      address,
      department,
      semester
    } = req.body;

    // Check if email already exists in applications
    const existingApplication = await StudentApplication.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({ message: 'Application with this email already exists' });
    }

    // Check if email exists in users
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create application
    const application = await StudentApplication.create({
      name,
      email,
      password: hashedPassword,
      fatherName,
      guardianEmail,
      phone,
      cnic,
      address,
      department,
      semester,
      status: 'pending',
      roomId: null,
      photo: req.file ? `/uploads/students/${req.file.filename}` : null
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        _id: application._id,
        name: application.name,
        email: application.email,
        status: application.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin only)
// @route   GET /api/admin/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await StudentApplication.find()
      .populate('roomId', 'roomNumber floor hostelBlock')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve student application
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
const approveApplication = async (req, res) => {
  try {
    const { roomId } = req.body;
    const applicationId = req.params.id;

    const application = await StudentApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if room exists and has space
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.occupiedBeds >= room.capacity) {
      return res.status(400).json({ message: 'Room is already full' });
    }

    // Create user account for the student
    const user = await User.create({
      name: application.name,
      email: application.email,
      password: application.password,
      role: 'student'
    });

    // Update application status and room
    application.status = 'approved';
    application.roomId = roomId;
    await application.save();

    // Update room occupied beds
    room.occupiedBeds += 1;
    await room.save();

    // Send approval email to student
    console.log('\n📧 === ATTEMPTING TO SEND APPROVAL EMAIL ===');
    console.log('Application Email:', application.email);
    console.log('Application Name:', application.name);
    console.log('Room Number:', room.roomNumber);
    
    try {
      console.log('🚀 Calling sendApprovalEmail function...');
      const emailResult = await sendApprovalEmail(
        application.email,
        application.name,
        room.roomNumber
      );
      console.log('✅ Email sent result:', emailResult);
    } catch (emailError) {
      console.error('❌ Failed to send approval email:', emailError.message);
      console.error('Full error:', emailError);
      // Don't fail the approval if email fails
    }
    console.log('==========================================\n');

    res.json({
      message: 'Application approved successfully. Email notification sent.',
      application,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject student application
// @route   PUT /api/admin/reject/:id
// @access  Private/Admin
const rejectApplication = async (req, res) => {
  try {
    const application = await StudentApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    res.json({
      message: 'Application rejected successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get approved students
// @route   GET /api/admin/approved-students
// @access  Private/Admin
const getApprovedStudents = async (req, res) => {
  try {
    const approvedStudents = await StudentApplication.find({ status: 'approved' })
      .populate('roomId', 'roomNumber floor hostelBlock capacity occupiedBeds')
      .sort({ createdAt: -1 });
    res.json(approvedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getApprovedStudents
};
