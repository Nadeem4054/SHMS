const express = require('express');
const router = express.Router();
const { getMyRoom, getProfile, getAllStudents, deleteStudent, getRoomsWithStudents } = require('../controllers/studentController');
const { authMiddleware, studentMiddleware, adminMiddleware } = require('../middleware/auth');

// Student routes
router.get('/student/my-room', authMiddleware, studentMiddleware, getMyRoom);
router.get('/student/profile', authMiddleware, studentMiddleware, getProfile);

// Admin routes
router.get('/admin/students', authMiddleware, adminMiddleware, getAllStudents);
router.delete('/admin/students/:id', authMiddleware, adminMiddleware, deleteStudent);
router.get('/admin/rooms-with-students', authMiddleware, adminMiddleware, getRoomsWithStudents);

module.exports = router;
