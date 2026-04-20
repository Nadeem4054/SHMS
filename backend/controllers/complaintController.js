const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Submit new complaint
// @route   POST /api/complaints
// @access  Private (student)
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, roomNumber } = req.body;

    // Get student info
    const student = await User.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create complaint
    const complaint = await Complaint.create({
      studentId: req.user._id,
      studentName: student.name,
      roomNumber,
      title,
      description,
      category
    });

    // Create notification for admin
    try {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        await createNotification(
          adminUser._id,
          'admin',
          'New Complaint Submitted',
          `${student.name} submitted a complaint: ${title}`,
          'complaint',
          complaint._id
        );
      }
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's own complaints
// @route   GET /api/complaints/my
// @access  Private (student)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all complaints (admin)
// @route   GET /api/admin/complaints
// @access  Private (admin)
const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter
    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/admin/complaints/:id
// @access  Private (admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    // Validate status
    const validStatuses = ['In Progress', 'Resolved', 'Not Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update complaint
    complaint.status = status;
    if (adminReply) {
      complaint.adminReply = adminReply;
    }

    const updatedComplaint = await complaint.save();

    res.json({
      message: 'Complaint updated successfully',
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
};
