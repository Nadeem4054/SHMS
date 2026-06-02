const LeaveRequest = require('../models/LeaveRequest');
const StudentApplication = require('../models/StudentApplication');
const { sendLeaveApprovalEmail } = require('../config/emailService');
const { createNotification } = require('./notificationController');

// @desc    Submit leave request
// @route   POST /api/student/leave
// @access  Private (Student)
const submitLeaveRequest = async (req, res) => {
  try {
    const { 
      leaveType, 
      fromDate, 
      toDate, 
      destination, 
      reason, 
      guardianName, 
      guardianEmail, 
      guardianContact 
    } = req.body;

    // Find student application to get room number and name
    const application = await StudentApplication.findOne({ studentId: req.user._id }).populate('roomId');
    
    if (!application) {
      return res.status(404).json({ message: 'Student application not found' });
    }

    const leaveRequest = await LeaveRequest.create({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: application.roomId ? application.roomId.roomNumber : 'N/A',
      leaveType,
      fromDate,
      toDate,
      destination,
      reason,
      guardianName,
      guardianEmail,
      guardianContact
    });

    // Notify admin
    try {
      const User = require('../models/User');
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'admin',
          'New Leave Request',
          `${req.user.name} has submitted a ${leaveType} request.`,
          'leave',
          leaveRequest._id
        );
      }
    } catch (err) {
      console.error('Notification error:', err);
    }

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's leave requests
// @route   GET /api/student/my-leaves
// @access  Private (Student)
const getMyLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all leave requests (Admin)
// @route   GET /api/admin/leave-requests
// @access  Private (Admin)
const getAllLeaveRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const requests = await LeaveRequest.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve leave request
// @route   PUT /api/admin/leave-approve/:id
// @access  Private (Admin)
const approveLeaveRequest = async (req, res) => {
  try {
    const request = await LeaveRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    request.status = 'Approved';
    request.adminRemarks = req.body.adminRemarks || 'Approved by Admin';
    await request.save();

    // Send email to guardian
    try {
      await sendLeaveApprovalEmail(
        request.guardianEmail,
        request.studentName,
        request.leaveType,
        request.fromDate,
        request.toDate,
        request.destination,
        request.guardianName,
        request.roomNumber
      );
    } catch (emailErr) {
      console.error('Email error:', emailErr);
    }

    // Notify student
    try {
      await createNotification(
        request.student,
        'student',
        'Leave Request Approved',
        `Your ${request.leaveType} request to ${request.destination} has been approved.`,
        'leave',
        request._id
      );
    } catch (err) {
      console.error('Notification error:', err);
    }

    res.json({ message: 'Leave request approved and guardian notified', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject leave request
// @route   PUT /api/admin/leave-reject/:id
// @access  Private (Admin)
const rejectLeaveRequest = async (req, res) => {
  try {
    const { adminRemarks } = req.body;
    if (!adminRemarks) {
      return res.status(400).json({ message: 'Rejection remarks are required' });
    }

    const request = await LeaveRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    request.status = 'Rejected';
    request.adminRemarks = adminRemarks;
    await request.save();

    // Notify student
    try {
      await createNotification(
        request.student,
        'student',
        'Leave Request Rejected',
        `Your ${request.leaveType} request has been rejected. Reason: ${adminRemarks}`,
        'leave',
        request._id
      );
    } catch (err) {
      console.error('Notification error:', err);
    }

    res.json({ message: 'Leave request rejected', request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest
};
