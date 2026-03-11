const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  floor: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 4
  },
  occupiedBeds: {
    type: Number,
    required: true,
    default: 0
  },
  hostelBlock: {
    type: String,
    default: 'A',
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);
