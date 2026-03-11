const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getApprovedStudents
} = require('../controllers/applicationController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/apply', upload.single('photo'), submitApplication);
router.get('/admin/applications', authMiddleware, adminMiddleware, getAllApplications);
router.put('/admin/approve/:id', authMiddleware, adminMiddleware, approveApplication);
router.put('/admin/reject/:id', authMiddleware, adminMiddleware, rejectApplication);
router.get('/admin/approved-students', authMiddleware, adminMiddleware, getApprovedStudents);

module.exports = router;
