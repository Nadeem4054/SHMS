const express = require('express');
const router = express.Router();
const { 
  submitLeaveRequest, 
  getMyLeaveRequests, 
  getAllLeaveRequests, 
  approveLeaveRequest, 
  rejectLeaveRequest 
} = require('../controllers/leaveRequestController');
const { authMiddleware, adminMiddleware, studentMiddleware } = require('../middleware/auth');

// Student routes
router.post('/student/leave', authMiddleware, studentMiddleware, submitLeaveRequest);
router.get('/student/my-leaves', authMiddleware, studentMiddleware, getMyLeaveRequests);

// Admin routes
router.get('/admin/leave-requests', authMiddleware, adminMiddleware, getAllLeaveRequests);
router.put('/admin/leave-approve/:id', authMiddleware, adminMiddleware, approveLeaveRequest);
router.put('/admin/leave-reject/:id', authMiddleware, adminMiddleware, rejectLeaveRequest);

module.exports = router;
