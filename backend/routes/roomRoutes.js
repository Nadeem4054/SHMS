const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getAvailableRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/admin/rooms', authMiddleware, adminMiddleware, createRoom);
router.get('/rooms', authMiddleware, getAllRooms);
router.get('/rooms/available', authMiddleware, adminMiddleware, getAvailableRooms);
router.get('/rooms/:id', authMiddleware, getRoomById);
router.put('/admin/rooms/:id', authMiddleware, adminMiddleware, updateRoom);
router.delete('/admin/rooms/:id', authMiddleware, adminMiddleware, deleteRoom);

module.exports = router;
