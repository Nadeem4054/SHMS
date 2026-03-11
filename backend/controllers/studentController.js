const StudentApplication = require('../models/StudentApplication');
const User = require('../models/User');
const Room = require('../models/Room');

// @desc    Get student's room details
// @route   GET /api/student/my-room
// @access  Private/Student
const getMyRoom = async (req, res) => {
  try {
    // Find student application by email (matching the logged-in user's email)
    const application = await StudentApplication.findOne({ 
      email: req.user.email 
    }).populate('roomId', 'roomNumber floor hostelBlock capacity occupiedBeds');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status !== 'approved') {
      return res.status(200).json({
        status: application.status,
        message: application.status === 'pending' 
          ? 'Your application is pending admin approval' 
          : 'Your application has been rejected'
      });
    }

    res.json({
      status: application.status,
      room: application.roomId,
      application: {
        _id: application._id,
        name: application.name,
        email: application.email,
        department: application.department,
        semester: application.semester,
        photo: application.photo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
const getProfile = async (req, res) => {
  try {
    const application = await StudentApplication.findOne({ 
      email: req.user.email 
    }).populate('roomId', 'roomNumber floor hostelBlock');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({
      user: req.user,
      application: {
        _id: application._id,
        name: application.name,
        email: application.email,
        fatherName: application.fatherName,
        guardianEmail: application.guardianEmail,
        phone: application.phone,
        cnic: application.cnic,
        address: application.address,
        department: application.department,
        semester: application.semester,
        status: application.status,
        room: application.roomId,
        photo: application.photo
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students (Admin only)
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    
    // Get application status for each student
    const studentsWithStatus = await Promise.all(
      students.map(async (student) => {
        const application = await StudentApplication.findOne({ email: student.email });
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt,
          applicationStatus: application ? application.status : 'no_application',
          hasApplication: !!application,
          roomId: application ? application.roomId : null,
          roomNumber: application?.roomId ? application.roomId.roomNumber : null,
          photo: application ? application.photo : null
        };
      })
    );

    res.json(studentsWithStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a student with cascade delete (Admin only)
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Step 1: Find the student
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(400).json({ message: 'Can only delete student accounts' });
    }

    // Step 2: Find student's application
    const application = await StudentApplication.findOne({ email: student.email });
    
    let freedRoom = null;
    
    // Step 3: If room was assigned, free up the room
    if (application && application.roomId) {
      const room = await Room.findById(application.roomId);
      if (room && room.occupiedBeds > 0) {
        room.occupiedBeds -= 1;
        await room.save();
        freedRoom = {
          roomNumber: room.roomNumber,
          hostelBlock: room.hostelBlock
        };
        console.log(`✅ Room ${room.roomNumber} freed up. Occupied beds: ${room.occupiedBeds}/${room.capacity}`);
      }
    }

    // Step 4: Delete application
    if (application) {
      await StudentApplication.deleteOne({ _id: application._id });
      console.log(`✅ Application deleted for ${student.email}`);
    }

    // Step 5: Delete student user
    await User.findByIdAndDelete(studentId);
    console.log(`✅ Student ${student.name} deleted`);

    res.json({
      message: 'Student deleted successfully',
      freedRoom: freedRoom,
      deletedStudent: {
        _id: student._id,
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rooms with assigned students (Admin only)
// @route   GET /api/admin/rooms-with-students
// @access  Private/Admin
const getRoomsWithStudents = async (req, res) => {
  try {
    // Get all rooms
    const rooms = await Room.find().sort({ roomNumber: 1 });
    
    // For each room, find assigned students
    const roomsWithStudents = await Promise.all(
      rooms.map(async (room) => {
        // Find all approved applications for this room
        const applications = await StudentApplication.find({
          roomId: room._id,
          status: 'approved'
        }).select('name email createdAt updatedAt');

        return {
          _id: room._id,
          roomNumber: room.roomNumber,
          type: room.capacity === 1 ? 'single' : room.capacity === 2 ? 'double' : 'triple',
          capacity: room.capacity,
          occupiedBeds: room.occupiedBeds,
          status: room.occupiedBeds >= room.capacity ? 'occupied' : room.occupiedBeds > 0 ? 'partially_occupied' : 'available',
          hostelBlock: room.hostelBlock,
          floor: room.floor,
          students: applications.map(app => ({
            name: app.name,
            email: app.email,
            assignedDate: app.updatedAt
          }))
        };
      })
    );

    res.json(roomsWithStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyRoom, getProfile, getAllStudents, deleteStudent, getRoomsWithStudents };
