const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { submitComplaint, getMyComplaints, getAllComplaints, updateComplaintStatus } = require('../controllers/complaintController');

// Student routes
router.post('/complaints', authMiddleware, submitComplaint);
router.get('/complaints/my', authMiddleware, getMyComplaints);

// Admin routes
router.get('/admin/complaints', authMiddleware, getAllComplaints);
router.put('/admin/complaints/:id', authMiddleware, updateComplaintStatus);

module.exports = router;
