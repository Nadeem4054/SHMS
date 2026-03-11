const express = require('express');
const router = express.Router();
const {
  createNotice,
  getAllNotices,
  updateNotice,
  deleteNotice,
  toggleNotice
} = require('../controllers/noticeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes (for both admin and students)
router.get('/', authMiddleware, getAllNotices);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, createNotice);
router.put('/:id', authMiddleware, adminMiddleware, updateNotice);
router.delete('/:id', authMiddleware, adminMiddleware, deleteNotice);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleNotice);

module.exports = router;
