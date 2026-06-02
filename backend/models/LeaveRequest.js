const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    enum: ['Day Outing', 'Overnight', 'Emergency'],
    required: true
  },
  fromDate: {
    type: Date,
    required: true
  },
  toDate: {
    type: Date,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianEmail: {
    type: String,
    required: true
  },
  guardianContact: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemarks: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
